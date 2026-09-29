// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { AISuggestionsService, AISuggestion } from '@/services/aiSuggestions.service';
import { useClusterDPRStore } from '@/store/clusterDPRStore';
import { toast } from 'react-hot-toast';
import { extraFieldsForScheme } from '@/lib/individualDpr/schemeFormConfig';
import { getSchemeSteps } from '@/lib/individualDpr/schemeStepCatalog';
import { EXTRA_FIELD_LABELS, getIndividualDocFields } from '@/lib/individualDpr/individualDocModel';
import { getUnitName } from '@/lib/individualDpr/toIndividualPayload';
import { normalizeMilestones, toDateInputValue } from '@/lib/dprAiFieldNormalize';
import { fillCurrentStepWithAi, FillStepProgress } from '@/lib/individualDpr/fillAllStepsWithAi';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';

interface AISuggestionsProps {
  currentStep: number;
  currentStepData: any;
  onApplySuggestion?: (field: string, content: string) => void;
  excludeFields?: string[];
  data?: any;
  setStepData?: (step: number, stepData: any) => void;
  getStepData?: (step: number) => any;
  setSchemeExtras?: (extras: any) => void;
  contextHint?: string;
  isIndividualDPR?: boolean;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  currentStep,
  currentStepData,
  onApplySuggestion,
  excludeFields = [],
  data: dataProp,
  setStepData: setStepDataProp,
  getStepData: getStepDataProp,
  setSchemeExtras: setSchemeExtrasProp,
  contextHint,
  isIndividualDPR = false,
}) => {
  const clusterStore = useClusterDPRStore();
  const tf = useClusterFormText();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const aiAllowed = !!user?.privacy?.aiAssist;
  const data = dataProp ?? clusterStore.data;
  const setStepData = setStepDataProp ?? clusterStore.setStepData;
  const getStepData = getStepDataProp ?? clusterStore.getStepData;
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [hasGenerated, setHasGenerated] = useState(false);
  const schemeExtraFields = extraFieldsForScheme(isIndividualDPR ? data?.matchedSchemeCode : null);
  const [applyingAll, setApplyingAll] = useState(false);
  const [applyingFields, setApplyingFields] = useState<Set<string>>(new Set());
  const [fillProgress, setFillProgress] = useState<FillStepProgress | null>(null);
  const fieldLabel = (field: string) => {
    if (EXTRA_FIELD_LABELS[field]) return EXTRA_FIELD_LABELS[field];
    const pretty: Record<string, string> = {
      natureOfBusiness: 'Nature of Business',
      majorProducts: 'Major Products',
      unitName: 'Unit / Project Name',
      district: 'District',
      location: 'Location',
      sectorType: 'Sector / industry type',
      sectorDescription: 'Sector description',
      processOfManufacture: 'Process of manufacture',
      powerRequirement: 'Power requirement',
      workplaceType: 'Workplace',
      entrepreneurName: 'Vendor / entrepreneur name',
      entrepreneurAge: 'Age',
    };
    return pretty[field] || field;
  };

  const schemeCode = isIndividualDPR ? data?.matchedSchemeCode || null : null;
  const budget = isIndividualDPR ? data?.ventureMatchAnswers?.budget : undefined;
  const stepCatalogFields = isIndividualDPR
    ? getIndividualDocFields(currentStep, schemeCode, budget).filter(
        (f) => !excludeFields.includes(f.name)
      )
    : [];

  const previousStepsData = React.useMemo(() => {
    const previousData: Record<string, any> = {};
    if (isIndividualDPR) {
      const catalog = getSchemeSteps(schemeCode);
      const currentLocal = catalog.find((s) => s.contentStep === currentStep)?.n ?? currentStep;
      for (const def of catalog) {
        if (def.n >= currentLocal) continue;
        const stepKey = `step${def.contentStep}`;
        if (data[stepKey as keyof typeof data]) {
          previousData[stepKey] = data[stepKey as keyof typeof data];
        }
      }
      if (data.step1 && !previousData.step1) previousData.step1 = data.step1;
      previousData._isIndividualDPR = true;
      if (schemeCode) previousData._schemeCode = schemeCode;
      if (budget) previousData._budget = budget;
      return previousData;
    }
    for (let i = 1; i < currentStep; i++) {
      const stepKey = `step${i}`;
      if (data[stepKey as keyof typeof data]) {
        previousData[stepKey] = data[stepKey as keyof typeof data];
      }
    }
    return previousData;
  }, [currentStep, data, isIndividualDPR, schemeCode, budget]);

  const hasPreviousData = Boolean(
    (previousStepsData.step1 && Object.keys(previousStepsData.step1).length > 0) ||
      (isIndividualDPR && getUnitName(data?.step1))
  );

  useEffect(() => {
    setSuggestions([]);
    setHasGenerated(false);
    setFillProgress(null);
  }, [currentStep]);

  const handleFillThisStep = async () => {
    if (!aiAllowed) {
      toast.error(t('privacy.aiOffWarning'));
      return;
    }
    if (currentStep > 1 && !hasPreviousData) return;
    if (!stepCatalogFields.length) {
      toast.error(tf('No questions to fill on this step.'));
      return;
    }

    setLoading(true);
    setFillProgress(null);
    try {
      const result = await fillCurrentStepWithAi({
        contentStep: currentStep,
        data,
        setStepData,
        getStepData,
        setSchemeExtras: setSchemeExtrasProp,
        schemeCode,
        answers: data?.ventureMatchAnswers,
        excludeFields,
        onProgress: setFillProgress,
      });

      if (result.filled.length === 0) {
        toast.error(tf('Could not fill any fields for this step. Try again.'));
        return;
      }
      if (result.failed.length) {
        toast.success(
          tf('Filled {filled} of {total} questions on this step.')
            .replace('{filled}', String(result.filled.length))
            .replace('{total}', String(result.filled.length + result.failed.length))
        );
      } else {
        toast.success(
          tf('Filled {n} questions on this step.').replace('{n}', String(result.filled.length))
        );
      }
    } catch (error) {
      console.error('Error filling step with AI:', error);
      toast.error(tf('Failed to fill this step with AI'));
    } finally {
      setLoading(false);
      setFillProgress(null);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!aiAllowed) {
      toast.error(t('privacy.aiOffWarning'));
      return;
    }
    if (currentStep > 1 && !hasPreviousData) {
      return;
    }

    setLoading(true);
    try {
      const aiSuggestions = await AISuggestionsService.getSuggestionsForStep(
        currentStep,
        currentStepData,
        {
          ...previousStepsData,
          ...(contextHint ? { _promptContext: contextHint } : {}),
        },
        excludeFields
      );

      const filteredSuggestions = (aiSuggestions || []).filter((suggestion) => {
        if (excludeFields.includes(suggestion.field)) return false;
        return true;
      });
      setSuggestions(filteredSuggestions);
      setHasGenerated(true);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const parseAndTransformFieldContent = (field: string, content: string) => {
    let parsedContent: any = content;
    try {
      parsedContent = JSON.parse(content);

      if (typeof parsedContent === 'object' && !Array.isArray(parsedContent)) {
        if (field === 'connectivity') {
          parsedContent = {
            road: parsedContent.road || parsedContent.Road || '',
            rail: parsedContent.rail || parsedContent.Rail || '',
            port: parsedContent.port || parsedContent.Port || '',
          };
        }
      }

      if (Array.isArray(parsedContent)) {
        if (field === 'valueAdditionStages') {
          if (parsedContent.length > 0 && typeof parsedContent[0] === 'string') {
            parsedContent = parsedContent.map((stage: string) => ({
              stage,
              sellingPrice: 0,
            }));
          }
        } else if (field === 'rawMaterials') {
          if (parsedContent.length > 0 && typeof parsedContent[0] === 'string') {
            parsedContent = parsedContent.map((material: string) => ({
              name: material,
              source: '',
            }));
          }
        } else if (field === 'boardOfDirectors') {
          if (parsedContent.length > 0 && typeof parsedContent[0] === 'string') {
            parsedContent = parsedContent.map((director: string) => ({
              name: director,
              designation: '',
            }));
          }
        } else if (field === 'shareholdingPattern') {
          if (parsedContent.length > 0 && typeof parsedContent[0] === 'string') {
            parsedContent = parsedContent.map((stakeholder: string) => ({
              stakeholder,
              percentage: 0,
            }));
          }
        } else if (field === 'memberUnits') {
          if (parsedContent.length > 0 && typeof parsedContent[0] === 'string') {
            parsedContent = parsedContent.map((unit: string) => ({
              name: unit,
              registration: '',
            }));
          }
        } else if (field === 'milestones') {
          parsedContent = normalizeMilestones(parsedContent);
        }
      }
    } catch {
      parsedContent = content;
    }

    if (field === 'startDate' || field === 'endDate') {
      const dateValue = toDateInputValue(parsedContent);
      return dateValue || null;
    }

    if (field === 'milestones') {
      const rows = normalizeMilestones(parsedContent);
      return rows.length ? rows : null;
    }

    if (
      parsedContent === null ||
      parsedContent === undefined ||
      (Array.isArray(parsedContent) && parsedContent.length === 0) ||
      (typeof parsedContent === 'string' && parsedContent.trim() === '')
    ) {
      return null;
    }

    return parsedContent;
  };

  const extractValueFromSuggestion = (field: string, suggestionText: string): any => {
    if (!suggestionText) return null;

    if (field === 'startDate' || field === 'endDate') {
      return toDateInputValue(suggestionText) || null;
    }

    if (field === 'milestones') {
      try {
        const arrayMatch = suggestionText.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          const parsed = JSON.parse(arrayMatch[0]);
          const rows = normalizeMilestones(parsed);
          if (rows.length) return rows;
        }
      } catch {
        /* fall through */
      }
    }

    try {
      let braceCount = 0;
      let startIndex = -1;
      for (let i = 0; i < suggestionText.length; i++) {
        if (suggestionText[i] === '{') {
          if (startIndex === -1) startIndex = i;
          braceCount++;
        } else if (suggestionText[i] === '}') {
          braceCount--;
          if (braceCount === 0 && startIndex !== -1) {
            const jsonStr = suggestionText.substring(startIndex, i + 1);
            try {
              const parsed = JSON.parse(jsonStr);
              if (field === 'enterpriseCount' && parsed.micro !== undefined && parsed.small !== undefined && parsed.medium !== undefined) {
                return parsed;
              }
              if (field === 'ageOfEnterprises' && parsed.lessThan5 !== undefined && parsed.between5And10 !== undefined && parsed.moreThan10 !== undefined) {
                return parsed;
              }
              if (field === 'employmentPerUnit' && parsed.lessThan5 !== undefined && parsed.between5And10 !== undefined && parsed.moreThan10 !== undefined) {
                return parsed;
              }
              if (field === 'marketServed' && parsed.domestic !== undefined && parsed.export !== undefined) {
                return parsed;
              }
              if (field === 'connectivity' && parsed.road !== undefined && parsed.rail !== undefined && parsed.port !== undefined) {
                return parsed;
              }
            } catch (e) {
              // Continue searching
            }
            startIndex = -1;
          }
        }
      }

      const jsonArrayMatch = suggestionText.match(/\[[^\]]*\]/);
      if (jsonArrayMatch) {
        const parsed = JSON.parse(jsonArrayMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }

      if (field === 'investmentPerUnit' || field === 'turnoverPerUnit') {
        const numberMatch = suggestionText.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|₹|rupees?)?/i);
        if (numberMatch) {
          let num = parseFloat(numberMatch[1]);
          if (suggestionText.toLowerCase().includes('lakh')) {
            num = num * 100000;
          }
          return num;
        }
      }
    } catch (e) {
      // fall back to API
    }

    return null;
  };

  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    if (!suggestion.field) {
      toast.error('Field name is missing');
      return;
    }

    setApplyingFields(prev => new Set(prev).add(suggestion.field));

    try {
      const suggestionText = typeof suggestion.suggestion === 'string'
        ? suggestion.suggestion
        : JSON.stringify(suggestion.suggestion);

      let parsedContent = extractValueFromSuggestion(suggestion.field, suggestionText);

      if (parsedContent === null) {
        const content = await AISuggestionsService.generateFieldContent(
          suggestion.field,
          currentStep,
          currentStepData,
          previousStepsData,
          suggestion.suggestion
        );

        if (content) {
          parsedContent = parseAndTransformFieldContent(suggestion.field, content);
        }
      } else {
        parsedContent = parseAndTransformFieldContent(suggestion.field, JSON.stringify(parsedContent));
      }

      if (parsedContent === null) {
        toast.error(`Could not extract value for ${suggestion.field}. Please try again.`);
        return;
      }

      let finalContent = parsedContent;
      if (suggestion.field === 'connectivity') {
        if (typeof parsedContent === 'object' && !Array.isArray(parsedContent)) {
          finalContent = {
            road: parsedContent.road || '',
            rail: parsedContent.rail || '',
            port: parsedContent.port || '',
          };
        } else {
          toast.error('Connectivity data format is invalid. Please try again.');
          return;
        }
      }

      if (schemeExtraFields.includes(suggestion.field)) {
        if (onApplySuggestion) onApplySuggestion(suggestion.field, finalContent);
        toast.success(`Applied AI suggestion to ${suggestion.field}`);
        return;
      }

      const latestStepData = getStepData(currentStep) || {};

      const updatedStepData = {
        ...latestStepData,
        [suggestion.field]: finalContent,
      };
      setStepData(currentStep, updatedStepData);

      if (onApplySuggestion) {
        onApplySuggestion(suggestion.field, finalContent);
      }

      toast.success(`Applied AI suggestion to ${suggestion.field}`);
    } catch (error) {
      console.error('Error applying suggestion:', error);
      toast.error('Failed to apply suggestion');
    } finally {
      setApplyingFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(suggestion.field);
        return newSet;
      });
    }
  };

  const handleApplyAllSuggestions = async () => {
    if (!suggestions || suggestions.length === 0) return;
    if (applyingAll) return;

    const validSuggestions = suggestions.filter((s) => !!s.field);
    if (validSuggestions.length === 0) {
      toast.error('No applicable suggestions found.');
      return;
    }

    setApplyingAll(true);
    setApplyingFields(new Set(validSuggestions.map((s) => s.field)));

    try {
      const latestStepData = getStepData(currentStep) || {};
      let updatedStepData = { ...latestStepData };
      let appliedCount = 0;
      const fieldsNeedingAPI: typeof validSuggestions = [];

      for (const suggestion of validSuggestions) {
        try {
          const suggestionText = typeof suggestion.suggestion === 'string'
            ? suggestion.suggestion
            : JSON.stringify(suggestion.suggestion);

          let parsedContent = extractValueFromSuggestion(suggestion.field, suggestionText);

          if (parsedContent === null) {
            fieldsNeedingAPI.push(suggestion);
            continue;
          }

          parsedContent = parseAndTransformFieldContent(suggestion.field, JSON.stringify(parsedContent));

          if (parsedContent === null) {
            fieldsNeedingAPI.push(suggestion);
            continue;
          }

          if (schemeExtraFields.includes(suggestion.field)) {
            if (onApplySuggestion) onApplySuggestion(suggestion.field, parsedContent);
            appliedCount += 1;
            continue;
          }

          updatedStepData = {
            ...updatedStepData,
            [suggestion.field]: parsedContent,
          };

          if (onApplySuggestion) {
            onApplySuggestion(suggestion.field, parsedContent);
          }

          appliedCount += 1;
        } catch (e) {
          console.error(`Error extracting value for ${suggestion.field}:`, e);
          fieldsNeedingAPI.push(suggestion);
        }
      }

      if (fieldsNeedingAPI.length > 0) {
        const apiPromises = fieldsNeedingAPI.map(async (suggestion) => {
          try {
            const content = await AISuggestionsService.generateFieldContent(
              suggestion.field,
              currentStep,
              updatedStepData,
              previousStepsData,
              suggestion.suggestion
            );

            if (!content) return null;

            const parsedContent = parseAndTransformFieldContent(suggestion.field, content);
            if (parsedContent === null) return null;

            return { field: suggestion.field, content: parsedContent };
          } catch (e) {
            console.error(`Error applying suggestion for ${suggestion.field}:`, e);
            return null;
          }
        });

        const results = await Promise.all(apiPromises);

        for (const result of results) {
          if (result) {
            if (schemeExtraFields.includes(result.field)) {
              if (onApplySuggestion) onApplySuggestion(result.field, result.content);
              appliedCount += 1;
              continue;
            }

            updatedStepData = {
              ...updatedStepData,
              [result.field]: result.content,
            };

            if (onApplySuggestion) {
              onApplySuggestion(result.field, result.content);
            }

            appliedCount += 1;
          }
        }
      }

      if (appliedCount === 0) {
        toast.error('Could not apply any suggestions. Try again.');
        return;
      }

      setStepData(currentStep, updatedStepData);
      toast.success(`Applied ${appliedCount} suggestion${appliedCount !== 1 ? 's' : ''}`);
    } finally {
      setApplyingAll(false);
      setApplyingFields(new Set());
    }
  };

  if (!aiAllowed) {
    return (
      <div className="mb-4 p-3 bg-muted/50 border border-muted rounded-lg">
        <p className="text-xs text-muted-foreground">{t('privacy.aiOffWarning')}</p>
      </div>
    );
  }

  // Latest DPR: fill only this step's catalog questions, one field at a time
  if (isIndividualDPR) {
    if (currentStep > 1 && !hasPreviousData) {
      return (
        <div className="mb-4 p-3 bg-muted/50 border border-muted rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">{tf('Complete Step 1 first to get AI suggestions for this step.')}</span>
          </div>
        </div>
      );
    }

    if (!stepCatalogFields.length) {
      return null;
    }

    return (
      <div className="mb-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">{tf('Fill this step with AI')}</p>
              <p className="text-xs text-muted-foreground">
                {loading && fillProgress
                  ? tf('Filling {index}/{total}: {label}')
                      .replace('{index}', String(fillProgress.index))
                      .replace('{total}', String(fillProgress.total))
                      .replace('{label}', fillProgress.label)
                  : tf('Asks only this step’s questions ({n}), one at a time.').replace(
                      '{n}',
                      String(stepCatalogFields.length)
                    )}
              </p>
            </div>
          </div>
          <button
            onClick={handleFillThisStep}
            disabled={loading || (currentStep > 1 && !hasPreviousData)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? tf('Filling…') : tf('Fill this step')}
          </button>
        </div>
        {!loading && (
          <ul className="mt-3 text-xs text-muted-foreground list-disc pl-5 space-y-0.5">
            {stepCatalogFields.slice(0, 12).map((f) => (
              <li key={f.name}>{f.label}</li>
            ))}
            {stepCatalogFields.length > 12 && (
              <li>+{stepCatalogFields.length - 12} more</li>
            )}
          </ul>
        )}
      </div>
    );
  }

  if (!hasGenerated && !loading) {
    if (currentStep > 1 && !hasPreviousData) {
      return (
        <div className="mb-4 p-3 bg-muted/50 border border-muted rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">{tf('Complete Step 1 first to get AI suggestions for this step.')}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{tf('Get AI Suggestions')}</p>
              <p className="text-xs text-muted-foreground">
                {tf('Get contextual recommendations based on your previous step data')}
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerateSuggestions}
            disabled={loading || (currentStep > 1 && !hasPreviousData)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            {tf('Generate Suggestions')}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">{tf('Generating AI suggestions based on previous steps...')}</span>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0 && hasGenerated) {
    return (
      <div className="mb-4 p-3 bg-muted/50 border border-muted rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">{tf('No suggestions available. Try generating again or fill in more fields.')}</span>
          </div>
          <button
            onClick={handleGenerateSuggestions}
            disabled={loading}
            className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {tf('Retry')}
          </button>
        </div>
      </div>
    );
  }

  if (suggestions.length > 0 && hasGenerated) {
    return (
      <div className="mb-4 border border-primary/20 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 flex items-center justify-between hover:bg-primary/10 transition-colors rounded-lg p-2 -m-2"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">{tf('AI Suggestions')}</span>
              <span className="text-xs text-muted-foreground">
                ({suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''})
              </span>
            </div>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={handleGenerateSuggestions}
            disabled={loading}
            className="ml-2 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 transition-colors flex items-center gap-1"
            title="Regenerate suggestions"
          >
            <Sparkles className="h-3 w-3" />
            {tf('Regenerate')}
          </button>
          <button
            onClick={handleApplyAllSuggestions}
            disabled={loading || applyingAll}
            className="ml-2 px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            title="Apply all suggestions"
          >
            {applyingAll ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                {tf('Applying...')}
              </>
            ) : (
              <>
                <Check className="h-3 w-3" />
                {tf('Apply All')}
              </>
            )}
          </button>
        </div>

        {expanded && (
          <div className="px-4 pb-4 space-y-3">
            {suggestions.map((suggestion, index) => {
              const isApplying = suggestion.field && applyingFields.has(suggestion.field);
              return (
                <div
                  key={index}
                  className="p-3 bg-white/50 rounded-lg border border-primary/10"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      {suggestion.field && (
                        <p className="text-xs font-semibold text-primary mb-1">
                          {fieldLabel(suggestion.field)}:
                        </p>
                      )}
                      <p className="text-sm text-gray-700">
                        {typeof suggestion.suggestion === 'string'
                          ? suggestion.suggestion
                          : typeof suggestion.suggestion === 'object'
                            ? JSON.stringify(suggestion.suggestion, null, 2)
                            : String(suggestion.suggestion || '')}
                      </p>
                      {suggestion.reasoning && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          {typeof suggestion.reasoning === 'string'
                            ? suggestion.reasoning
                            : typeof suggestion.reasoning === 'object'
                              ? JSON.stringify(suggestion.reasoning, null, 2)
                              : String(suggestion.reasoning || '')}
                        </p>
                      )}
                    </div>
                    {suggestion.field && (
                      <button
                        onClick={() => handleApplySuggestion(suggestion)}
                        disabled={isApplying}
                        className="ml-2 px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 flex-shrink-0"
                        title={`Apply suggestion to ${suggestion.field}`}
                      >
                        {isApplying ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {tf('Applying...')}
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3" />
                            {tf('Apply')}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return null;
};
