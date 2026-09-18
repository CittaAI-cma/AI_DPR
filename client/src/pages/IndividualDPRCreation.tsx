// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Save, Eye, ChevronRight, ChevronLeft, ZoomIn, ZoomOut, Maximize2, RotateCcw, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { useIndividualDPRStore } from '@/store/individualDPRStore';
import { IndividualDPRForm } from '@/components/individual-dpr/IndividualDPRForm';
import { ClusterDPRDocumentView } from '@/components/cluster-dpr/ClusterDPRDocumentView';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import { toClusterPayload } from '@/lib/individualDpr/toClusterPayload';
import { getVisibleSteps, getStepTitle, getSchemeImpact } from '@/lib/individualDpr/schemeFormConfig';
import { peekHandoff } from '@/lib/ventureMatch/mapToDpr';
import { prefillFromVentureMatch } from '@/lib/individualDpr/prefillFromVentureMatch';
import { SchemeBriefPanel } from '@/components/individual-dpr/SchemeBriefPanel';
import { SchemePickerGrid } from '@/components/individual-dpr/SchemePickerGrid';
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
    setStepData,
    setMatchedSchemeCode,
    setVentureMatchAnswers,
    applyPrefill,
  } = useIndividualDPRStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState<'split' | 'form' | 'preview'>('split');
  const [previewZoom, setPreviewZoom] = useState(0.6);
  const [project, setProject] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [setupPhase, setSetupPhase] = useState<SetupPhase>('pick');
  const viewLanguage: 'english' | 'telugu' = i18n.language.startsWith('te') ? 'telugu' : 'english';

  const currentStep = data.currentStep || 1;
  const visibleSteps = getVisibleSteps(data.matchedSchemeCode || null);
  const lastVisible = visibleSteps[visibleSteps.length - 1] || 18;
  const stepOrdinal = Math.max(1, visibleSteps.indexOf(currentStep) + 1);
  const schemeImpact = getSchemeImpact(data.matchedSchemeCode || null);
  const clusterPayload = toClusterPayload(data);

  const prevPayloadRef = useRef<any>(null);
  const pendingPathsRef = useRef<string[]>([]);
  const lastHitPathsRef = useRef<string[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextDiffRef = useRef(true);
  const [previewHitIndex, setPreviewHitIndex] = useState(0);
  const [previewHitCount, setPreviewHitCount] = useState(0);
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
      prevPayloadRef.current = clusterPayload;
      return;
    }
    const changed = diffPayloadFieldPaths(prevPayloadRef.current, clusterPayload);
    prevPayloadRef.current = clusterPayload;
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
  }, [clusterPayload, previewZoom, refreshHits]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoadingData(true);
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
          if (answers) setVentureMatchAnswers(answers);

          const scheme = schemeFromUrl || null;
          setMatchedSchemeCode(scheme);

          if (answers) {
            applyPrefill(prefillFromVentureMatch(answers));
          }
          setCurrentStep(1);
          // Scheme Finder with a code → brief; otherwise show cards first
          setSetupPhase(scheme ? 'brief' : 'pick');
          setIsLoadingData(false);
          return;
        }

        if (projectIdFromUrl) {
          try {
            const projectResponse = await api.getProject(projectIdFromUrl);
            const projectData = projectResponse.data || projectResponse;
            setProject(projectData);
            let dprData = null;
            if (dprIdFromUrl) {
              try {
                const dprResponse = await api.getClusterDPR(dprIdFromUrl);
                dprData = dprResponse.data || dprResponse;
              } catch {
                /* draft only */
              }
            }
            loadDataFromProject(projectData, dprData);
            const pid = projectData._id || projectData.id;
            setDprIds(dprData?._id || dprData?.id || '', pid);
            setSetupPhase('form');
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
    if (!visibleSteps.includes(currentStep) && visibleSteps.length) {
      setCurrentStep(visibleSteps[0]);
    }
  }, [data.matchedSchemeCode]);

  const saveToDatabase = useCallback(async () => {
    try {
      const hasAnyData = Object.keys(data).some((key) => {
        if (key.startsWith('step')) {
          const stepData = data[key];
          return stepData && typeof stepData === 'object' && Object.keys(stepData).length > 0;
        }
        return false;
      });
      if (hasAnyData || data.projectId) {
        const response = await api.saveClusterDPRDraft(clusterPayload);
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
      toast.error(t('clusterDpr.toasts.saveFailedDb'));
      return false;
    }
  }, [clusterPayload, data, setDprIds]);

  const goAdjacent = async (dir: 1 | -1) => {
    await saveToDatabase();
    const idx = visibleSteps.indexOf(currentStep);
    const next = visibleSteps[idx + dir];
    if (next) {
      setCurrentStep(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraft = async () => {
    const success = await saveToDatabase();
    if (success) toast.success(t('clusterDpr.toasts.saveSuccess'));
    else if (!data.step1?.clusterName) toast.error(t('individualDpr.toasts.needUnitName'));
    else toast.error(t('clusterDpr.toasts.saveFailed'));
  };

  const handleGenerateDPR = async () => {
    setIsGenerating(true);
    try {
      if (!data.step1 || !data.step1.clusterName) {
        toast.error(t('individualDpr.toasts.needUnitNameGenerate'));
        setIsGenerating(false);
        return;
      }
      const saveSuccess = await saveToDatabase();
      if (!saveSuccess) {
        toast.error(t('clusterDpr.toasts.saveBeforeGenerateFailed'));
        setIsGenerating(false);
        return;
      }

      toast.loading(t('clusterDpr.toasts.generating'), { id: 'generating-dpr' });
      const response = await api.generateClusterDPR(
        {
          ...clusterPayload,
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
        toast.success(t('clusterDpr.toasts.generateSuccess'), { id: 'generating-dpr' });
        navigate(`/dpr/view/${response.data.dprId}`);
      } else {
        throw new Error(response.message || 'Failed to generate DPR');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || t('clusterDpr.toasts.generateFailed'),
        { id: 'generating-dpr' }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepCompletion = (step: number): boolean => {
    const stepData = data[`step${step}`];
    return !!stepData;
  };

  const handlePickScheme = (code: string | null) => {
    setMatchedSchemeCode(code);
    const nextVisible = getVisibleSteps(code);
    setCurrentStep(nextVisible[0] || 1);
    setSetupPhase('brief');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBriefNext = () => {
    setSetupPhase('form');
    setCurrentStep(visibleSteps[0] || 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const headerSubtitle =
    setupPhase === 'pick'
      ? t('individualDpr.picker.headerHint', { defaultValue: 'Select a scheme to continue' })
      : setupPhase === 'brief'
        ? t('individualDpr.picker.briefHint', { defaultValue: 'Review the scheme, then continue to the form' })
        : `${t('individualDpr.stepOf', { current: stepOrdinal, total: visibleSteps.length })}${
            visibleSteps.length !== 18
              ? ` ${t('individualDpr.hiddenForScheme', { count: 18 - visibleSteps.length })}`
              : ''
          }`;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                      setSetupPhase('brief');
                      return;
                    }
                    navigate('/dashboard');
                  }}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {setupPhase === 'pick' ? t('common.back') : t('common.previous')}
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">{t('individualDpr.title')}</h1>
                  <p className="text-sm text-muted-foreground">{headerSubtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <LanguageToggle />
                {setupPhase === 'form' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSetupPhase('pick');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {t('individualDpr.picker.changeScheme', { defaultValue: 'Change scheme' })}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2">
                      <Save className="h-4 w-4" />
                      {t('clusterDpr.saveDraft')}
                    </Button>
                    <div className="flex items-center gap-1 border rounded-lg p-1">
                      <Button variant={previewMode === 'form' ? 'primary' : 'ghost'} size="sm" onClick={() => setPreviewMode('form')}>
                        {t('clusterDpr.form')}
                      </Button>
                      <Button variant={previewMode === 'split' ? 'primary' : 'ghost'} size="sm" onClick={() => setPreviewMode('split')}>
                        {t('clusterDpr.split')}
                      </Button>
                      <Button variant={previewMode === 'preview' ? 'primary' : 'ghost'} size="sm" onClick={() => setPreviewMode('preview')} className="gap-2">
                        <Eye className="h-4 w-4" />
                        {t('clusterDpr.preview')}
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
                      {t('clusterDpr.generateDpr')}
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
              <div className="flex items-center justify-between gap-3">
                <Button variant="outline" onClick={() => setSetupPhase('pick')} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  {t('individualDpr.picker.backToSchemes', { defaultValue: 'All schemes' })}
                </Button>
                <Button variant="primary" onClick={handleBriefNext} className="gap-2">
                  {t('individualDpr.picker.continueToForm', { defaultValue: 'Next — start DPR steps' })}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {setupPhase === 'form' && (
          <>
        <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {visibleSteps.map((step) => {
                const isCompleted = getStepCompletion(step);
                const isCurrent = step === currentStep;
                return (
                  <button
                    key={step}
                    onClick={() => {
                      setCurrentStep(step);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                      ${isCurrent
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : isCompleted
                        ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'}
                    `}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isCurrent ? 'bg-primary-foreground/20' : isCompleted ? 'bg-success' : 'bg-muted-foreground/20'}`}>
                      {isCompleted && !isCurrent ? '✓' : step}
                    </span>
                    <span className="hidden sm:inline">{t('clusterDpr.stepShort', { n: step })}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {currentStep !== 1 && (
          <div className="bg-amber-50 border-b border-amber-200">
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <p className="text-sm font-semibold text-foreground">
                {t('individualDpr.scheme', { title: tf(schemeImpact.title) })}
              </p>
              <ul className="mt-1 text-sm text-muted-foreground list-disc pl-5 space-y-0.5">
                {schemeImpact.bullets.map((b) => (
                  <li key={b}>{tf(b)}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`grid gap-6 ${previewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {(previewMode === 'form' || previewMode === 'split') && (
              <div id="cluster-dpr-form" className="space-y-6">
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
                  <Card>
                    <CardHeader>
                      <CardTitle>{t(`individualDpr.steps.${currentStep}`, { defaultValue: getStepTitle(currentStep) })}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <IndividualDPRForm
                        key={`step-${currentStep}-${data.projectId || 'new'}-${data.matchedSchemeCode || 'vanilla'}`}
                        currentStep={currentStep}
                        onNext={() => goAdjacent(1)}
                        onPrevious={() => goAdjacent(-1)}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => goAdjacent(-1)} disabled={currentStep === visibleSteps[0]} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    {t('common.previous')}
                  </Button>
                  <Button variant="primary" onClick={() => goAdjacent(1)} disabled={currentStep === lastVisible} className="gap-2">
                    {t('common.next')}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {(previewMode === 'preview' || previewMode === 'split') && (
              <div className="space-y-6">
                <Card className="sticky top-[146px] max-h-[calc(100vh-170px)] overflow-hidden flex flex-col">
                  <CardHeader className="flex-shrink-0 border-b border-border">
                    <div className="flex items-center justify-between">
                      <CardTitle>{t('clusterDpr.livePreview')}</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 border rounded-lg p-1">
                          <Button variant="ghost" size="sm" onClick={() => setPreviewZoom(Math.max(0.5, previewZoom - 0.1))} className="h-7 w-7 p-0">
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <span className="text-xs px-2 min-w-[3rem] text-center">{Math.round(previewZoom * 100)}%</span>
                          <Button variant="ghost" size="sm" onClick={() => setPreviewZoom(Math.min(2, previewZoom + 0.1))} className="h-7 w-7 p-0">
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setPreviewZoom(1)} className="h-7 w-7 p-0">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('dpr-preview-scroll')?.requestFullscreen?.()}
                          className="gap-2"
                        >
                          <Maximize2 className="h-4 w-4" />
                          {t('individualDpr.fullscreen')}
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
                        <div
                          id="dpr-preview"
                          className="bg-white mx-auto shadow-lg"
                          style={{ minHeight: '100%', width: '21cm', padding: '2rem' }}
                        >
                          <ClusterDPRDocumentView
                            trackFieldHits
                            dpr={{
                              content: {
                                english: {
                                  clusterData: clusterPayload,
                                  ...data.generatedDPR?.sections,
                                },
                              },
                              metadata: {
                                clusterData: clusterPayload,
                                isIndividualDPR: true,
                              },
                            }}
                            project={project || {
                              _id: data.projectId,
                              id: data.projectId,
                              projectName: data.step1?.clusterName,
                              projectType: 'cluster',
                              stepData: clusterPayload,
                            }}
                            viewLanguage={viewLanguage}
                            onSectionClick={(stepNumber: number) => {
                              if (visibleSteps.includes(stepNumber)) setCurrentStep(stepNumber);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            onDataChange={(field, value) => {
                              if (field === 'financialStatements') {
                                setStepData(15, { ...(data.step15 || {}), financialStatements: value });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </Layout>
  );
};
