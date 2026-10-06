// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Save, ChevronRight, ChevronLeft, ZoomIn, ZoomOut, Maximize2, RotateCcw, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { useIndividualDPRStore } from '@/store/individualDPRStore';
import { IndividualDPRForm } from '@/components/individual-dpr/IndividualDPRForm';
import { IndividualDPRDocumentView } from '@/components/individual-dpr/IndividualDPRDocumentView';
import { StyleEditor } from '@/components/individual-dpr/StyleEditor';
import { getSchemeDocSteps, sectionTitleFromStep } from '@/lib/individualDpr/individualDocModel';
import { defaultStyleForScheme, pageEdgeMm, resolveDocumentStyle, selectionStepOrder, setPictureFrame } from '@/lib/individualDpr/documentStyle';
import { PageSheet } from '@/components/individual-dpr/PageSheet';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { DevModeToggle } from '@/components/ui/DevModeToggle';
import { useAuthStore } from '@/store/authStore';
import { isSuperAdmin } from '@/lib/rbac';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import { toIndividualPayload, getUnitName } from '@/lib/individualDpr/toIndividualPayload';
import { individualDprApi } from '@/lib/individualDpr/individualDprApi';
import { getVisibleSteps, getStepTitle, getSchemeImpact, SCHEME_OPTIONS, getContentStep } from '@/lib/individualDpr/schemeFormConfig';
import { missingIndividualRequired } from '@/lib/requiredStepFields';
import { contentToLocal, getSchemeStepCount } from '@/lib/individualDpr/schemeStepCatalog';
import { peekHandoff } from '@/lib/ventureMatch/mapToDpr';
import { hasUnder18Applicant } from '@/lib/privacy/under18';
import { GuardianNotice } from '@/components/privacy/GuardianNotice';
import { SchemeBriefPanel } from '@/components/individual-dpr/SchemeBriefPanel';
import { SchemePickerGrid } from '@/components/individual-dpr/SchemePickerGrid';
import { getSchemeUiTemplate } from '@/lib/individualDpr/schemeUiTemplate';
import {
  collectFieldHits,
  diffPayloadFieldPaths,
  highlightHit,
  scrollHitIntoPreview,
} from '@/lib/individualDpr/previewFieldHits';

type SetupPhase = 'pick' | 'brief' | 'form';

export const IndividualDPRCreation: React.FC = () => {
  const { t, i18n } = useTranslation();
  const tf = useClusterFormText();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const {
    data,
    setCurrentStep,
    setGeneratedDPR,
    resetData,
    setDprIds,
    loadDataFromProject,
    setMatchedSchemeCode,
    setVentureMatchAnswers,
    setSchemeExtras,
  } = useIndividualDPRStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStepping, setIsStepping] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [requiredNotice, setRequiredNotice] = useState('');
  const [devMode, setDevMode] = useState(false);
  const isAdmin = isSuperAdmin(useAuthStore((s) => s.user?.role));
  const [previewZoom, setPreviewZoom] = useState(0.6);
  const [project, setProject] = useState<any>(null);
  const isNewDraft = searchParams.get('new') === 'true';
  const [isLoadingData, setIsLoadingData] = useState(!isNewDraft);
  const [setupPhase, setSetupPhase] = useState<SetupPhase>(
    isNewDraft && searchParams.get('scheme') ? 'brief' : 'pick'
  );
  const viewLanguage: 'english' | 'telugu' = i18n.language.startsWith('te') ? 'telugu' : 'english';

  const currentStep = data.currentStep || 1;
  const schemeCode = data.matchedSchemeCode || null;
  const visibleSteps = getVisibleSteps(schemeCode);
  const schemeImpact = getSchemeImpact(schemeCode);
  const dprPayload = toIndividualPayload(data);

  const prevPayloadRef = useRef<any>(null);
  const pendingPathsRef = useRef<string[]>([]);
  const lastHitPathsRef = useRef<string[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextDiffRef = useRef(true);
  const [previewHitIndex, setPreviewHitIndex] = useState(0);
  const [previewHitCount, setPreviewHitCount] = useState(0);
  const [styling, setStyling] = useState(false);
  const [docStyle, setDocStyle] = useState<any>(null);
  const selectionSteps = selectionStepOrder(getSchemeDocSteps(schemeCode), docStyle?.sectionOrder, visibleSteps);
  const lastVisible = selectionSteps[selectionSteps.length - 1] || getSchemeStepCount(schemeCode);
  const stepOrdinal = Math.max(1, selectionSteps.indexOf(currentStep) + 1);
  const docStyleRef = useRef<any>(null);
  docStyleRef.current = docStyle;
  const [hotSectionId, setHotSectionId] = useState<string | null>(null);
  const [styleSaving, setStyleSaving] = useState(false);
  const [editNonce, setEditNonce] = useState(0);
  const [editStepN, setEditStepN] = useState<number | null>(null);
  const styleBeforeEdit = useRef<any>(null);
  const previewHitsRef = useRef<HTMLElement[]>([]);

  const refreshHits = useCallback((paths: string[]) => {
    const root = document.getElementById('dpr-preview');
    const hits = collectFieldHits(root, paths);
    previewHitsRef.current = hits;
    lastHitPathsRef.current = paths;
    setPreviewHitCount(hits.length);
    return hits;
  }, []);

  const goToPreviewHit = useCallback(
    (index: number) => {
      const fresh = refreshHits(lastHitPathsRef.current);
      if (!fresh.length) return;
      const next = Math.max(0, Math.min(index, fresh.length - 1));
      setPreviewHitIndex(next);
      const scrollParent = document.getElementById('dpr-preview-scroll');
      const target = fresh[next];
      if (scrollParent && target) {
        scrollHitIntoPreview(scrollParent, target, previewZoom);
        highlightHit(target);
      }
    },
    [previewZoom, refreshHits]
  );

  useEffect(() => {
    if (skipNextDiffRef.current) {
      skipNextDiffRef.current = false;
      prevPayloadRef.current = dprPayload;
      return;
    }
    const changed = diffPayloadFieldPaths(prevPayloadRef.current, dprPayload);
    prevPayloadRef.current = dprPayload;
    if (!changed.length) return;

    pendingPathsRef.current = Array.from(
      new Set([...pendingPathsRef.current, ...changed])
    );
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const paths = pendingPathsRef.current;
      pendingPathsRef.current = [];
      // Double rAF: wait for React commit + layout after fieldHit DOM updates
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const hits = refreshHits(paths);
          if (hits.length > 0) {
            setPreviewHitIndex(0);
            const scrollParent = document.getElementById('dpr-preview-scroll');
            if (scrollParent) {
              scrollHitIntoPreview(scrollParent, hits[0], previewZoom);
              highlightHit(hits[0]);
            }
          } else {
            setPreviewHitIndex(0);
            highlightHit(null);
          }
        });
      });
    }, 140);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [dprPayload, previewZoom, refreshHits]);

  useEffect(() => {
    const load = async () => {
      try {
        const projectIdFromUrl = params.projectId || searchParams.get('projectId');
        const dprIdFromUrl = params.dprId || searchParams.get('dprId');
        const isNew = searchParams.get('new') === 'true';
        const schemeFromUrl = searchParams.get('scheme');

        if (isNew) {
          resetData();
          setDprIds('', '');
          setProject(null);

          const handoff = peekHandoff();
          const answers = handoff?.answers || null;
          // Keep answers for overlay rules (uploads / MUDRA bands) only — do not prefill form fields.
          if (answers) setVentureMatchAnswers(answers);

          const scheme = schemeFromUrl || null;
          setMatchedSchemeCode(scheme);

          setCurrentStep(1);
          // Scheme Finder with a code → brief; otherwise show cards first
          setSetupPhase(scheme ? 'brief' : 'pick');
          setIsLoadingData(false);
          return;
        }

        setIsLoadingData(true);
        if (projectIdFromUrl) {
          try {
            const projectResponse = await api.getProject(projectIdFromUrl);
            const projectData = projectResponse.data || projectResponse;
            setProject(projectData);
            let dprData = null;
            if (dprIdFromUrl) {
              try {
                const dprResponse = await individualDprApi.get(dprIdFromUrl);
                dprData = dprResponse.data || dprResponse;
              } catch {
                /* draft only */
              }
            }
            loadDataFromProject(projectData, dprData);
            const pid = projectData._id || projectData.id;
            setDprIds(dprData?._id || dprData?.id || '', pid);
            setSetupPhase('form');
            const loaded = useIndividualDPRStore.getState().data;
            const first = getVisibleSteps(loaded.matchedSchemeCode)[0] || 1;
            void openStyleEditor(first);
          } catch {
            resetData();
            setSetupPhase('pick');
          }
        } else {
          resetData();
          setSetupPhase('pick');
        }
      } finally {
        setIsLoadingData(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    // Remap legacy content-step numbers (e.g. 12) to scheme-local consecutive steps (e.g. PMEGP step 8)
    if (!visibleSteps.includes(currentStep) && visibleSteps.length) {
      const mapped = contentToLocal(schemeCode, currentStep);
      setCurrentStep(mapped && visibleSteps.includes(mapped) ? mapped : visibleSteps[0]);
    }
  }, [schemeCode]);

  const saveToDatabase = useCallback(async () => {
    try {
      if (hasUnder18Applicant(data)) {
        toast.error(t('privacy.guardianMessage'));
        return false;
      }
      const hasAnyData = Object.keys(data).some((key) => {
        if (key.startsWith('step')) {
          const stepData = data[key];
          return stepData && typeof stepData === 'object' && Object.keys(stepData).length > 0;
        }
        return false;
      });
      if (hasAnyData || data.projectId) {
        const response = await individualDprApi.saveDraft(dprPayload);
        if (response.success && response.data) {
          if (response.data.dprId && response.data.projectId) {
            setDprIds(response.data.dprId, response.data.projectId);
            const schemeQ = data.matchedSchemeCode ? `&scheme=${data.matchedSchemeCode}` : '';
            window.history.replaceState(
              {},
              '',
              `/individual-dpr/create?projectId=${response.data.projectId}&dprId=${response.data.dprId}${schemeQ}`
            );
          }
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(t('individualDpr.toasts.saveFailedDb'));
      return false;
    }
  }, [dprPayload, data, setDprIds, t]);

  const warnRequired = (missing: { key: string; label: string }[]) => {
    const keys = missing.map((field) => field.key);
    setInvalidFields(keys);
    const message = `${tf('Fill the required fields before continuing')}: ${missing
      .map((field) => tf(field.label))
      .join(', ')}`;
    setRequiredNotice(message);
    toast.error(message);
    window.setTimeout(() => {
      const root = document.getElementById('individual-dpr-form');
      const first = keys
        .map((key) => root?.querySelector(`[data-required-field="${key}"]`))
        .find(Boolean) as HTMLElement | undefined;
      (first || document.getElementById('required-fields-notice'))?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 80);
  };

  const guardForward = (targetStep: number) => {
    if (isAdmin && devMode) return true;
    const from = selectionSteps.indexOf(currentStep);
    const to = selectionSteps.indexOf(targetStep);
    if (to <= from) return true;
    for (let i = from; i < to; i += 1) {
      const step = selectionSteps[i];
      const content = getContentStep(step, schemeCode);
      const missing = missingIndividualRequired(content, data[`step${content}`], schemeCode);
      if (missing.length) {
        if (step !== currentStep) setCurrentStep(step);
        warnRequired(missing);
        return false;
      }
    }
    return true;
  };

  const goAdjacent = async (dir: 1 | -1) => {
    if (isStepping) return;
    const advancing = dir === 1;
    const idx = selectionSteps.indexOf(currentStep);
    const target = selectionSteps[idx + dir];
    if (advancing && target && !guardForward(target)) return;
    if (advancing) {
      setInvalidFields([]);
      setRequiredNotice('');
    }
    if (advancing) setIsStepping(true);
    try {
      await saveToDatabase();
      const idx = selectionSteps.indexOf(currentStep);
      const next = selectionSteps[idx + dir];
      if (next) {
        setCurrentStep(next);
        if (styling) {
          setEditStepN(next);
          setEditNonce((n) => n + 1);
          document.querySelectorAll('.fill-edit-scroll').forEach((node) => {
            node.scrollTo({ top: 0 });
          });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } finally {
      if (advancing) setIsStepping(false);
    }
  };

  const aiAssistedKey = JSON.stringify(data.schemeExtras?.aiAssistedSteps || []);
  useEffect(() => {
    const assisted: number[] = data.schemeExtras?.aiAssistedSteps || [];
    const content = getContentStep(currentStep, schemeCode);
    if (!assisted.includes(content)) return;
    const missing = missingIndividualRequired(content, data[`step${content}`], schemeCode);
    setInvalidFields(missing.map((field) => field.key));
    // Highlight skipped required fields once AI content is applied on this step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiAssistedKey]);

  useEffect(() => {
    if (!invalidFields.length) return;
    const content = getContentStep(currentStep, schemeCode);
    const still = missingIndividualRequired(content, data[`step${content}`], schemeCode).map(
      (field) => field.key
    );
    const next = invalidFields.filter((key) => still.includes(key));
    if (next.length !== invalidFields.length) {
      setInvalidFields(next);
      if (!next.length) setRequiredNotice('');
    }
  }, [data, currentStep, schemeCode, invalidFields]);

  const handleSaveDraft = async () => {
    const success = await saveToDatabase();
    if (success) toast.success(t('individualDpr.toasts.saveSuccess'));
    else if (!getUnitName(data.step1)) toast.error(t('individualDpr.toasts.needUnitName'));
    else toast.error(t('individualDpr.toasts.saveFailed'));
  };

  const openStyleEditor = async (step?: number) => {
    const latest = useIndividualDPRStore.getState().data;
    const code = latest.matchedSchemeCode || schemeCode;
    const start = step || currentStep;
    styleBeforeEdit.current = latest.schemeExtras?.documentStyle || null;
    const saved = latest.schemeExtras?.documentStyle;
    setEditStepN(start);
    setEditNonce((n) => n + 1);
    if (saved) {
      setDocStyle(resolveDocumentStyle(saved, code));
      setStyling(true);
      return;
    }
    setDocStyle(defaultStyleForScheme(code));
    setStyling(true);
    if (!code) return;
    try {
      const res = await api.getSchemeDocumentStyle(code);
      if (res?.data?.documentStyle) {
        setDocStyle(resolveDocumentStyle(res.data.documentStyle, code));
      }
    } catch {
      /* the local default is already on screen */
    }
  };

  const onStyleChange = (next: any) => {
    docStyleRef.current = next;
    setDocStyle(next);
    const current = useIndividualDPRStore.getState().data.schemeExtras || {};
    setSchemeExtras({ ...current, documentStyle: next });
  };

  const saveReportStyle = async () => {
    const latest = useIndividualDPRStore.getState().data;
    const extras = { ...(latest.schemeExtras || {}), documentStyle: docStyle };
    setSchemeExtras(extras);
    try {
      setStyleSaving(true);
      const response = await individualDprApi.saveDraft(toIndividualPayload({ ...latest, schemeExtras: extras }));
      if (response?.success && response.data?.dprId && response.data?.projectId) {
        setDprIds(response.data.dprId, response.data.projectId);
      }
      toast.success('Style saved on this DPR');
    } catch {
      toast.error('Could not save the style. Save the draft after the unit name is filled.');
    } finally {
      setStyleSaving(false);
    }
  };

  const saveSchemeDefault = async () => {
    if (!schemeCode || !docStyle) return;
    try {
      setStyleSaving(true);
      await api.saveSchemeDocumentStyle(schemeCode, docStyle);
      toast.success('The next DPR for this scheme starts from this look');
    } catch {
      toast.error('Could not save the scheme default');
    } finally {
      setStyleSaving(false);
    }
  };

  const handleGenerateDPR = async () => {
    setIsGenerating(true);
    try {
      if (!data.step1 || !getUnitName(data.step1)) {
        toast.error(t('individualDpr.toasts.needUnitNameGenerate'));
        setIsGenerating(false);
        return;
      }
      const saveSuccess = await saveToDatabase();
      if (!saveSuccess) {
        toast.error(t('individualDpr.toasts.saveBeforeGenerateFailed'));
        setIsGenerating(false);
        return;
      }

      toast.loading(t('individualDpr.toasts.generating'), { id: 'generating-dpr' });
      const response = await individualDprApi.generate(
        {
          ...dprPayload,
          currentStep: undefined,
          isDraft: undefined,
          lastSaved: undefined,
          generatedDPR: undefined,
        },
        'bilingual'
      );

      if (response.success && response.data) {
        setGeneratedDPR(response.data.content);
        resetData();
        toast.success(t('individualDpr.toasts.generateSuccess'), { id: 'generating-dpr' });
        navigate(`/dpr/view/${response.data.dprId}`);
      } else {
        throw new Error(response.message || 'Failed to generate DPR');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || t('individualDpr.toasts.generateFailed'),
        { id: 'generating-dpr' }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepCompletion = (localStep: number): boolean => {
    const content = getContentStep(localStep, schemeCode);
    const stepData = data[`step${content}`];
    return !!stepData && typeof stepData === 'object' && Object.keys(stepData).length > 0;
  };

  const handlePickScheme = (code: string | null) => {
    setMatchedSchemeCode(code);
    const nextVisible = getVisibleSteps(code);
    setCurrentStep(nextVisible[0] || 1);
    setSetupPhase('brief');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBriefNext = () => {
    const step = visibleSteps[0] || 1;
    setSetupPhase('form');
    setCurrentStep(step);
    void openStyleEditor(step);
  };

  const handleSchemeDropdownChange = (code: string) => {
    const nextCode = code || null;
    setMatchedSchemeCode(nextCode);
    const nextVisible = getVisibleSteps(nextCode);
    if (!nextVisible.includes(currentStep)) {
      setCurrentStep(nextVisible[0] || 1);
    }
  };

  const selectedSchemeLabel =
    SCHEME_OPTIONS.find((o) => o.code === (data.matchedSchemeCode || ''))?.label ||
    tf(schemeImpact.title);
  const schemeUi = getSchemeUiTemplate(data.matchedSchemeCode || null);

  const headerSubtitle =
    setupPhase === 'pick'
      ? t('individualDpr.picker.headerHint', { defaultValue: 'Select a scheme to continue' })
      : setupPhase === 'brief'
        ? t('individualDpr.picker.briefHint', { defaultValue: 'Review the scheme, then continue to the form' })
        : t('individualDpr.stepOf', {
            current: stepOrdinal,
            total: visibleSteps.length,
            defaultValue: `Step ${stepOrdinal} of ${visibleSteps.length}`,
          });

  return (
    <Layout fullBleed={Boolean(styling && docStyle)}>
      <div className={styling && docStyle ? 'flex min-h-0 flex-1 flex-col overflow-hidden bg-background' : 'min-h-screen bg-background'}>
        <div className={styling && docStyle
          ? 'shrink-0 border-b border-border bg-background px-4 pb-4 pt-2'
          : 'sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'}>
          <div className={styling && docStyle ? '' : 'max-w-[1920px] mx-auto px-4 py-4 sm:px-6 lg:px-8'}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (setupPhase === 'brief') {
                      setSetupPhase('pick');
                      return;
                    }
                    if (setupPhase === 'form') {
                      setStyling(false);
                      setSetupPhase('brief');
                      return;
                    }
                    navigate('/dashboard');
                  }}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {setupPhase === 'pick'
                    ? t('common.back')
                    : setupPhase === 'brief'
                      ? t('individualDpr.picker.backToSchemes', { defaultValue: 'All Schemes' })
                      : t('common.previous')}
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">{t('individualDpr.title')}</h1>
                  {setupPhase === 'form' ? (
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {t('individualDpr.schemeSelected', {
                        defaultValue: 'Scheme: {{name}}',
                        name: selectedSchemeLabel,
                      })}
                    </p>
                  ) : null}
                  <p className="text-sm text-muted-foreground">{headerSubtitle}</p>
                  {hasUnder18Applicant(data) && <GuardianNotice className="mt-3" />}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {setupPhase === 'brief' && (
                  <Button variant="primary" onClick={handleBriefNext} className="gap-2">
                    {t('individualDpr.picker.continueToForm', { defaultValue: 'Start DPR steps' })}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
                {setupPhase === 'form' && <LanguageToggle />}
                {setupPhase === 'form' && (
                  <DevModeToggle
                    on={devMode}
                    onChange={(next) => {
                      setDevMode(next);
                      if (next) {
                        setInvalidFields([]);
                        setRequiredNotice('');
                      }
                    }}
                  />
                )}
                {setupPhase === 'form' && (
                  <>
                    <label className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground whitespace-nowrap">
                        {t('individualDpr.schemeLabel', { defaultValue: 'Scheme' })}
                      </span>
                      <select
                        className="max-w-[min(100vw-8rem,22rem)] rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                        value={data.matchedSchemeCode || ''}
                        onChange={(e) => handleSchemeDropdownChange(e.target.value)}
                        aria-label={t('individualDpr.schemeLabel', { defaultValue: 'Scheme' })}
                      >
                        {SCHEME_OPTIONS.map((opt) => (
                          <option key={opt.code || 'vanilla'} value={opt.code}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2">
                      <Save className="h-4 w-4" />
                      {t('individualDpr.saveDraft')}
                    </Button>
                    <div className="flex items-center gap-1 border rounded-lg p-1">
                      <Button
                        variant={!styling ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setStyling(false)}
                      >
                        {t('individualDpr.form')}
                      </Button>
                      <Button
                        variant={styling ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => { void openStyleEditor(); }}
                      >
                        {t('individualDpr.customise', { defaultValue: 'Customise' })}
                      </Button>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleGenerateDPR}
                      isLoading={isGenerating}
                      className="gap-2"
                      disabled={currentStep !== lastVisible}
                    >
                      {t('individualDpr.generateDpr')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {setupPhase === 'pick' && (
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isLoadingData ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{t('individualDpr.loading')}</p>
              </div>
            ) : (
              <SchemePickerGrid onSelect={handlePickScheme} />
            )}
          </div>
        )}

        {setupPhase === 'brief' && (
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-5xl mx-auto space-y-6">
              <SchemeBriefPanel
                schemeCode={data.matchedSchemeCode || null}
                formNotes={{
                  title: tf(schemeImpact.title),
                  bullets: schemeImpact.bullets.map((b) => tf(b)),
                }}
              />
            </div>
          </div>
        )}

        {setupPhase === 'form' && styling && docStyle && (
          <div className="shrink-0 border-b border-border bg-background px-3 py-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              {selectionSteps.map((step) => {
                const isCompleted = getStepCompletion(step);
                const isCurrent = step === currentStep;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => {
                      if (step !== currentStep && !guardForward(step)) return;
                      setInvalidFields([]);
                      setRequiredNotice('');
                      setCurrentStep(step);
                      setEditStepN(step);
                      setEditNonce((n) => n + 1);
                    }}
                    className={`
                      flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all
                      ${isCurrent
                        ? (schemeUi?.stepActiveClass || 'bg-primary text-primary-foreground shadow-sm')
                        : isCompleted
                        ? 'border border-success/20 bg-success/10 text-success hover:bg-success/20'
                        : (schemeUi?.stepIdleClass || 'bg-muted/50 text-muted-foreground hover:bg-muted')}
                    `}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${isCurrent ? 'bg-primary-foreground/20' : isCompleted ? 'bg-success' : 'bg-muted-foreground/20'}`}>
                      {isCompleted && !isCurrent ? '✓' : step}
                    </span>
                    <span>{t('individualDpr.stepShort', { n: step })}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {setupPhase === 'form' && (
          <>
        {!styling && (
        <div className="sticky top-[8.75rem] z-20 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {selectionSteps.map((step) => {
                const isCompleted = getStepCompletion(step);
                const isCurrent = step === currentStep;
                return (
                  <button
                    key={step}
                    onClick={() => {
                      if (step === currentStep) return;
                      if (!guardForward(step)) return;
                      setInvalidFields([]);
                      setRequiredNotice('');
                      setCurrentStep(step);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                      ${isCurrent
                        ? (schemeUi?.stepActiveClass || 'bg-primary text-primary-foreground shadow-sm')
                        : isCompleted
                        ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20'
                        : (schemeUi?.stepIdleClass || 'bg-muted/50 text-muted-foreground hover:bg-muted')}
                    `}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isCurrent ? 'bg-primary-foreground/20' : isCompleted ? 'bg-success' : 'bg-muted-foreground/20'}`}>
                      {isCompleted && !isCurrent ? '✓' : step}
                    </span>
                    <span className="hidden sm:inline">{t('individualDpr.stepShort', { n: step })}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        )}

        {!styling && (
        <div className={schemeUi?.bannerClass || 'bg-amber-50 border-b border-amber-200'}>
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
              {schemeUi ? (
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 lg:justify-between">
                  <div className="min-w-0 text-center lg:text-left">
                    <p
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-[0.08em] uppercase border ${
                        schemeUi.id === 'PMEGP'
                          ? 'bg-teal-100/90 text-teal-900 border-teal-300'
                          : 'bg-indigo-100/90 text-indigo-950 border-indigo-300 rounded-md'
                      }`}
                    >
                      {tf(schemeUi.badge)}
                    </p>
                    <p className="text-base font-semibold text-foreground mt-2 tracking-tight">
                      {selectedSchemeLabel}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xl mx-auto lg:mx-0">
                      {tf(schemeUi.tagline)}
                    </p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 max-w-xl text-left">
                    {schemeImpact.bullets.slice(0, 3).map((b) => (
                      <li key={b} className="flex gap-2">
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                            schemeUi.id === 'PMEGP' ? 'bg-teal-600' : 'bg-indigo-600'
                          }`}
                          aria-hidden
                        />
                        <span>{tf(b)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    {t('individualDpr.scheme', {
                      title: selectedSchemeLabel,
                      defaultValue: 'Scheme: {{title}}',
                    })}
                  </p>
                  <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-0.5">
                    {schemeImpact.bullets.map((b) => (
                      <li key={b}>{tf(b)}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}

        <div className={styling && docStyle ? 'min-h-0 flex-1' : 'max-w-[1920px] mx-auto px-4 py-6 sm:px-6 lg:px-8'}>
          {styling && docStyle ? (
            <StyleEditor
              style={docStyle}
              schemeCode={schemeCode}
              steps={getSchemeDocSteps(schemeCode).map((step) => ({
                id: step.id,
                title: sectionTitleFromStep(step),
                n: step.n,
              }))}
              activeSectionId={hotSectionId}
              onActiveSection={setHotSectionId}
              onEditSection={(step) => {
                if (step?.n && visibleSteps.includes(step.n)) setCurrentStep(step.n);
              }}
              renderEditor={(step) => (
                <div className="space-y-4">
                  {requiredNotice ? (
                    <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                      {requiredNotice}
                    </div>
                  ) : null}
                  <IndividualDPRForm
                    currentStep={step.n}
                    invalidFields={invalidFields}
                    onNext={() => goAdjacent(1)}
                    onPrevious={() => goAdjacent(-1)}
                  />
                  <div className="flex items-center justify-between gap-2 border-t pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => goAdjacent(-1)}
                      disabled={step.n === selectionSteps[0] || isStepping}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t('common.previous')}
                    </Button>
                    {step.n === lastVisible ? (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleGenerateDPR}
                        isLoading={isGenerating}
                        className="gap-2"
                      >
                        {t('individualDpr.generateDpr')}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => goAdjacent(1)}
                        isLoading={isStepping}
                        className="gap-2"
                      >
                        {t('common.next')}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              editNonce={editNonce}
              editStepN={editStepN}
              onChange={onStyleChange}
              onSave={saveReportStyle}
              onClose={() => {
                const current = useIndividualDPRStore.getState().data.schemeExtras || {};
                if (styleBeforeEdit.current) {
                  setSchemeExtras({ ...current, documentStyle: styleBeforeEdit.current });
                } else {
                  const next = { ...current };
                  delete next.documentStyle;
                  setSchemeExtras(next);
                }
                setDocStyle(null);
                setStyling(false);
                setSetupPhase('brief');
              }}
              saving={styleSaving}
              canSaveSchemeDefault={isAdmin}
              onSaveSchemeDefault={saveSchemeDefault}
              language={viewLanguage}
              onLanguage={(lang) => i18n.changeLanguage(lang === 'telugu' ? 'te' : 'en')}
              hasTelugu
            >
              <IndividualDPRDocumentView
                trackFieldHits
                documentStyle={docStyle}
                activeSectionId={hotSectionId}
                dpr={{
                  content: { english: { clusterData: dprPayload } },
                  metadata: {
                    clusterData: dprPayload,
                    isIndividualDPR: true,
                    matchedSchemeCode: data.matchedSchemeCode || null,
                  },
                }}
                project={project || {
                  _id: data.projectId,
                  id: data.projectId,
                  projectName: getUnitName(data.step1),
                  projectType: 'individual',
                  stepData: dprPayload,
                }}
                viewLanguage={viewLanguage}
                onImageFrame={(slot, box) => {
                  if (!docStyleRef.current) return;
                  onStyleChange(setPictureFrame(docStyleRef.current, slot, box));
                }}
                onSectionClick={(stepNumber: number) => {
                  if (visibleSteps.includes(stepNumber)) setCurrentStep(stepNumber);
                  setEditStepN(stepNumber);
                  setEditNonce((n) => n + 1);
                }}
              />
            </StyleEditor>
          ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <div id="individual-dpr-form" className="space-y-6">
                {isLoadingData ? (
                  <Card>
                    <CardContent className="py-12">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">{t('individualDpr.loading')}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className={schemeUi?.formShellClass || undefined}>
                    <CardHeader>
                      <CardTitle>
                        {tf(getStepTitle(currentStep, data.matchedSchemeCode))}
                      </CardTitle>
                      {schemeUi ? (
                        <p className="text-xs text-muted-foreground mt-1">{tf(schemeUi.badge)}</p>
                      ) : null}
                    </CardHeader>
                    <CardContent>
                      {requiredNotice ? (
                        <div
                          id="required-fields-notice"
                          role="alert"
                          className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                        >
                          {requiredNotice}
                        </div>
                      ) : null}
                      {(data.schemeExtras?.aiAssistedSteps || []).includes(
                        getContentStep(currentStep, data.matchedSchemeCode)
                      ) ? (
                        <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                          {tf(
                            'AI-generated content. Please cross-check all details. The submitter is responsible for the accuracy of the final document.'
                          )}
                        </p>
                      ) : null}
                      <IndividualDPRForm
                        key={`step-${currentStep}-${data.projectId || 'new'}-${data.matchedSchemeCode || 'vanilla'}`}
                        currentStep={currentStep}
                        invalidFields={invalidFields}
                        onNext={() => goAdjacent(1)}
                        onPrevious={() => goAdjacent(-1)}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => goAdjacent(-1)} disabled={currentStep === selectionSteps[0] || isStepping} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    {t('common.previous')}
                  </Button>
                  {currentStep === lastVisible ? (
                    <Button
                      variant="primary"
                      onClick={handleGenerateDPR}
                      isLoading={isGenerating}
                      className="gap-2"
                    >
                      {t('individualDpr.generateDpr')}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => goAdjacent(1)}
                      isLoading={isStepping}
                      className="gap-2"
                    >
                      {t('common.next')}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="sticky top-[13.25rem] max-h-[calc(100vh-14rem)] overflow-hidden flex flex-col">
                  <CardHeader className="flex-shrink-0 space-y-3 border-b border-border">
                    <CardTitle>{t('individualDpr.livePreview')}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex shrink-0 items-center gap-1 rounded-lg border p-1">
                        <Button variant="ghost" size="sm" onClick={() => setPreviewZoom(Math.max(0.5, previewZoom - 0.1))} className="h-7 w-7 p-0">
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[3rem] px-2 text-center text-xs">{Math.round(previewZoom * 100)}%</span>
                        <Button variant="ghost" size="sm" onClick={() => setPreviewZoom(Math.min(2, previewZoom + 0.1))} className="h-7 w-7 p-0">
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setPreviewZoom(1)} className="h-7 w-7 p-0">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => document.getElementById('dpr-preview-scroll')?.requestFullscreen?.()}
                          className="h-7 shrink-0 gap-1 whitespace-nowrap px-2"
                        >
                          <Maximize2 className="h-4 w-4" />
                          {t('individualDpr.preview')}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 min-h-0 overflow-hidden p-0 bg-gray-100 relative flex flex-col">
                    {previewHitCount > 0 && (
                      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 no-print">
                        {previewHitIndex > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 bg-white/95 shadow"
                            onClick={() => goToPreviewHit(previewHitIndex - 1)}
                            title="Previous changed place"
                          >
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Up
                          </Button>
                        )}
                        {previewHitIndex < previewHitCount - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 bg-white/95 shadow"
                            onClick={() => goToPreviewHit(previewHitIndex + 1)}
                            title="Next changed place"
                          >
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Down
                          </Button>
                        )}
                        <span className="text-[10px] text-center text-gray-600 bg-white/90 rounded px-1 py-0.5 shadow">
                          {previewHitIndex + 1}/{previewHitCount}
                        </span>
                      </div>
                    )}
                    {/*
                      Use CSS zoom (affects layout) instead of transform scale.
                      Transform left layout at full size → broken vertical scroll + horizontal drift.
                    */}
                    <div
                      id="dpr-preview-scroll"
                      className="w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
                    >
                      <div
                        id="dpr-preview-container"
                        className="py-4"
                        style={{ zoom: previewZoom } as React.CSSProperties}
                      >
                        {(() => {
                          const saved = data.schemeExtras?.documentStyle;
                          const look = saved ? resolveDocumentStyle(saved, schemeCode) : null;
                          const doc = (
                            <IndividualDPRDocumentView
                              trackFieldHits
                              dpr={{
                                content: {
                                  english: {
                                    clusterData: dprPayload,
                                  },
                                },
                                metadata: {
                                  clusterData: dprPayload,
                                  isIndividualDPR: true,
                                  matchedSchemeCode: data.matchedSchemeCode || null,
                                },
                              }}
                              project={project || {
                                _id: data.projectId,
                                id: data.projectId,
                                projectName: getUnitName(data.step1),
                                projectType: 'individual',
                                stepData: dprPayload,
                              }}
                              viewLanguage={viewLanguage}
                              onSectionClick={(stepNumber: number) => {
                                if (visibleSteps.includes(stepNumber)) setCurrentStep(stepNumber);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            />
                          );
                          if (!look) {
                            return (
                              <div
                                id="dpr-preview"
                                className="bg-white mx-auto shadow-lg"
                                style={{ minHeight: '100%', width: '21cm', padding: '2rem' }}
                              >
                                {doc}
                              </div>
                            );
                          }
                          return (
                            <PageSheet
                              id="dpr-preview"
                              className="bg-white mx-auto shadow-lg"
                              pageSize={look.pageSize}
                              edgeTopMm={pageEdgeMm(look.marginMm.top)}
                              edgeBottomMm={pageEdgeMm(look.marginMm.bottom)}
                            >
                              {doc}
                            </PageSheet>
                          );
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
          </div>
          )}
        </div>
          </>
        )}
      </div>
    </Layout>
  );
};
