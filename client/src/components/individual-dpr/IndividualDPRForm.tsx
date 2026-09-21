// @ts-nocheck
import React from 'react';
import { useIndividualDPRStore } from '@/store/individualDPRStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AISuggestions } from '@/components/cluster-dpr/AISuggestions';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { FIELD_DESCRIPTIONS } from '@/data/fieldDescriptions';
import {
  extraFieldsForScheme,
  hideComplexCapex,
  getStep18Uploads,
  showPmegpEducationGate,
  nayakWorkingCapital,
  showDscr,
  isMudraShishuKishore,
  getContentStep,
} from '@/lib/individualDpr/schemeFormConfig';
import {
  VISHWAKARMA_CRAFTS,
  VISHWAKARMA_INTEREST_PERCENT,
  VISHWAKARMA_TOOLKIT_LAKHS,
  VISHWAKARMA_TRAINING_OPTIONS,
  VISHWAKARMA_TRANCHE_OPTIONS,
  VISHWAKARMA_WORKPLACE_OPTIONS,
  VISHWAKARMA_YES_NO_OPTIONS,
  vishwakarmaTrancheCapLakhs,
} from '@/lib/individualDpr/vishwakarmaQuestions';
import {
  SVANIDHI_INTEREST_SUBSIDY_PERCENT,
  SVANIDHI_PROOF_OPTIONS,
  SVANIDHI_TRANCHE_OPTIONS,
  SVANIDHI_VENDING_OPTIONS,
  svanidhiTrancheCapLakhs,
  svanidhiTrancheTenorMonths,
} from '@/lib/individualDpr/svanidhiQuestions';
import {
  PMEGP_AGENCY_OPTIONS,
  PMEGP_AREA_OPTIONS,
  PMEGP_CATEGORY_OPTIONS,
  PMEGP_EDUCATION_OPTIONS,
  pmegpOwnPercent,
  pmegpSubsidyPercent,
} from '@/lib/individualDpr/pmegpQuestions';
import {
  MUDRA_CATEGORY_OPTIONS,
  MUDRA_LOAN_PURPOSE_OPTIONS,
  MUDRA_PREMISES_OPTIONS,
} from '@/lib/individualDpr/mudraQuestions';
import {
  STANDUP_CATEGORY_OPTIONS,
  STANDUP_MIN_OWN_PERCENT,
  STANDUP_PREMISES_OPTIONS,
} from '@/lib/individualDpr/standupQuestions';
import {
  PMFME_FSSAI_OPTIONS,
  PMFME_MIN_OWN_PERCENT,
  PMFME_ODOP_OPTIONS,
  PMFME_PREMISES_OPTIONS,
  PMFME_SUBSIDY_CAP_LAKHS,
  PMFME_SUBSIDY_PERCENT,
  PMFME_UNIT_STAGE_OPTIONS,
  pmfmeIndicativeGrantLakhs,
} from '@/lib/individualDpr/pmfmeQuestions';
import {
  PMEGP_2ND_AGENCY_OPTIONS,
  PMEGP_2ND_OWN_PERCENT,
  PMEGP_2ND_PRIOR_SCHEME_OPTIONS,
  PMEGP_2ND_SECTOR_BAND_OPTIONS,
  PMEGP_2ND_YES_NO_OPTIONS,
  pmegp2ndIndicativeMmLakhs,
  pmegp2ndSubsidyPercent,
} from '@/lib/individualDpr/pmegp2ndQuestions';
import {
  SCLCSS_CATEGORY_OPTIONS,
  SCLCSS_MIN_STAKE_PERCENT,
  SCLCSS_PREMISES_OPTIONS,
  SCLCSS_SUBSIDY_CAP_LAKHS,
  SCLCSS_SUBSIDY_PERCENT,
  SCLCSS_UNIT_STAGE_OPTIONS,
  sclcssIndicativeGrantLakhs,
} from '@/lib/individualDpr/sclcssQuestions';
import {
  AP_TECH_PREMISES_OPTIONS,
  AP_TECH_SIZE_OPTIONS,
  AP_TECH_YES_NO_OPTIONS,
  apTechIndicativeGrantLakhs,
  apTechSubsidyCapLakhs,
  apTechSubsidyPercent,
} from '@/lib/individualDpr/apTechUpgradeQuestions';
import {
  AP_EDP_LAND_REBATE_CAP_LAKHS,
  AP_EDP_LAND_REBATE_PERCENT,
  AP_EDP_PREMISES_OPTIONS,
  AP_EDP_SIZE_OPTIONS,
  AP_EDP_YES_NO_OPTIONS,
  apEdpIndicativeGrantLakhs,
  apEdpIndicativeLandRebateLakhs,
  apEdpLandRebateEligible,
  apEdpSubsidyCapLakhs,
  apEdpSubsidyPercent,
} from '@/lib/individualDpr/apEdpQuestions';
import {
  ECLGS_ACCOUNT_STATUS_OPTIONS,
  ECLGS_INTEREST_CAP_PERCENT,
  ECLGS_QUANTUM_PERCENT,
  ECLGS_TENOR_YEARS,
  eclgsIndicativeQuantumLakhs,
} from '@/lib/individualDpr/eclgsQuestions';
import { ZED_LEVEL_OPTIONS } from '@/lib/individualDpr/zedQuestions';
import { MSME_IPR_STAGE_OPTIONS, MSME_IPR_TYPE_OPTIONS } from '@/lib/individualDpr/msmeIprQuestions';
import { SCST_HUB_CATEGORY_OPTIONS, SCST_HUB_GEM_OPTIONS } from '@/lib/individualDpr/scstHubQuestions';
import { ASPIRE_PREMISES_OPTIONS } from '@/lib/individualDpr/aspireQuestions';
import { NHDP_LOOM_OPTIONS, NHDP_PREMISES_OPTIONS } from '@/lib/individualDpr/nhdpQuestions';
import { CVY_BOARD_STATUS_OPTIONS, CVY_PREMISES_OPTIONS } from '@/lib/individualDpr/cvyQuestions';
import { PTUAS_GMP_OPTIONS } from '@/lib/individualDpr/ptuasQuestions';
import { PMPDS_FOCUS_OPTIONS } from '@/lib/individualDpr/pmpdsQuestions';
import { CGTMSE_PURPOSE_OPTIONS, CGTMSE_WOMEN_OPTIONS } from '@/lib/individualDpr/cgtmseQuestions';
import {
  AP_FPP_PREMISES_OPTIONS,
  AP_FPP_SIZE_OPTIONS,
  AP_FPP_YES_NO,
} from '@/lib/individualDpr/apFppQuestions';
import {
  AP_CMEP_ACTIVITY_OPTIONS,
  AP_CMEP_BOOSTER_OPTIONS,
  AP_CMEP_YES_NO,
} from '@/lib/individualDpr/apCmepQuestions';
import { OBMMS_CORP_OPTIONS, OBMMS_YES_NO } from '@/lib/individualDpr/obmmsQuestions';
import { MSE_SPICE_SECTOR_OPTIONS } from '@/lib/individualDpr/mseSpiceQuestions';
import { AP_PARKS_REBATE_OPTIONS, AP_PARKS_YES_NO } from '@/lib/individualDpr/apParksQuestions';
import { RAMP_TEAM_ONDC_OPTIONS } from '@/lib/individualDpr/rampTeamQuestions';
import { EPM_NIRYAT_CREDIT_OPTIONS } from '@/lib/individualDpr/epmNiryatQuestions';
import { fillAllStepsWithAi, FillAllProgress, normalizeExtraValue } from '@/lib/individualDpr/fillAllStepsWithAi';
import { suggestUnitTitle } from '@/lib/individualDpr/coverTitle';
import { getUnitName, withSyncedUnitName } from '@/lib/individualDpr/toIndividualPayload';
import { individualDprApi } from '@/lib/individualDpr/individualDprApi';
import { normalizeMilestones, toDateInputValue } from '@/lib/dprAiFieldNormalize';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import { useTranslation } from 'react-i18next';
interface IndividualDPRFormProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const IndividualDPRForm: React.FC<IndividualDPRFormProps> = ({
  currentStep,
  onNext,
  onPrevious,
}) => {
  const { data, setStepData, getStepData, setSchemeExtras, setCurrentStep } = useIndividualDPRStore();
  const tf = useClusterFormText();
  const { t } = useTranslation();
  const schemeCode = data.matchedSchemeCode || null;
  const isPmegp = schemeCode === 'PMEGP';
  const isPmegp2nd = schemeCode === 'PMEGP_2ND';
  const isMudra = schemeCode === 'MUDRA';
  const isStandup = schemeCode === 'STANDUP';
  const isPmfme = schemeCode === 'PMFME';
  const isSclcss = schemeCode === 'SCLCSS';
  const isApTech = schemeCode === 'AP_TECH_UPGRADE';
  const isApEdp = schemeCode === 'AP_EDP';
  const isVishwakarma = schemeCode === 'VISHWAKARMA';
  const isSvanidhi = schemeCode === 'SVANIDHI';
  const isEclgs = schemeCode === 'ECLGS';
  const isZed = schemeCode === 'ZED';
  const isLean = schemeCode === 'LEAN';
  const isMsmeIpr = schemeCode === 'MSME_IPR';
  const isPms = schemeCode === 'PMS';
  const isScstHub = schemeCode === 'SCST_HUB';
  const isAspire = schemeCode === 'ASPIRE';
  const isNhdp = schemeCode === 'NHDP';
  const isCvy = schemeCode === 'CVY';
  const isMseGift = schemeCode === 'MSE_GIFT';
  const isPtuas = schemeCode === 'PTUAS';
  const isPmpds = schemeCode === 'PMPDS';
  const isCgtmse = schemeCode === 'CGTMSE';
  const isApFpp = schemeCode === 'AP_FPP';
  const isApCmep = schemeCode === 'AP_CMEP';
  const isObmms = schemeCode === 'OBMMS';
  const isMseSpice = schemeCode === 'MSE_SPICE';
  const isApParks = schemeCode === 'AP_PARKS';
  const isRampTeam = schemeCode === 'RAMP_TEAM';
  const isEpmNiryat = schemeCode === 'EPM_NIRYAT';
  const isLeanUnit =
    isPmegp ||
    isPmegp2nd ||
    isMudra ||
    isStandup ||
    isPmfme ||
    isSclcss ||
    isApTech ||
    isApEdp ||
    isVishwakarma ||
    isSvanidhi ||
    isEclgs ||
    isZed ||
    isLean ||
    isMsmeIpr ||
    isPms ||
    isScstHub ||
    isAspire ||
    isNhdp ||
    isCvy ||
    isMseGift ||
    isPtuas ||
    isPmpds ||
    isCgtmse ||
    isApFpp ||
    isApCmep ||
    isObmms ||
    isMseSpice ||
    isApParks ||
    isRampTeam ||
    isEpmNiryat;
  const extraFieldNames = extraFieldsForScheme(schemeCode);
  /** Store / AI / PDF bucket for this scheme's local step. */
  const contentStep = getContentStep(currentStep, schemeCode);
  const extras = data.schemeExtras || {};
  const updateExtras = (patch: Record<string, any>) => {
    const current = useIndividualDPRStore.getState().data.schemeExtras || {};
    setSchemeExtras({ ...current, ...patch });
  };
  const aiStore = {
    data,
    setStepData,
    getStepData,
    isIndividualDPR: true,
    contextHint: 'This is an individual entrepreneur unit (one firm), not a multi-unit CFC / SPV report.',
  };
  const aiExclude =
    contentStep === 1
      ? ['clusterName', 'unitName', 'location', 'district']
      : hideComplexCapex(schemeCode, data.ventureMatchAnswers?.budget) && contentStep === 12
        ? ['land', 'building', 'utilitiesAndInfrastructure', 'preliminaryAndPreOperative']
        : [];
  // Read step data from the content bucket (scheme-local UI step may differ)
  const stepDataKey = `step${contentStep}` as keyof typeof data;
  const stepData = (data[stepDataKey] as any) || {};

  // State for Step 18 file uploads (must be at top level due to React hooks rules)
  const [uploadingFiles, setUploadingFiles] = React.useState<Record<string, boolean>>({});
  const [isFillingAll, setIsFillingAll] = React.useState(false);
  const [fillProgress, setFillProgress] = React.useState<FillAllProgress | null>(null);

  // Debug: Log when step data changes (reduced frequency)
  // React.useEffect(() => {
  //   console.log(`📋 Step ${currentStep} data loaded:`, {
  //     stepData,
  //     hasData: Object.keys(stepData).length > 0,
  //     keys: Object.keys(stepData),
  //     // For step 1, log all nested fields to debug
  //     ...(currentStep === 1 ? {
  //       enterpriseCount: stepData.enterpriseCount,
  //       ageOfEnterprises: stepData.ageOfEnterprises,
  //       employmentPerUnit: stepData.employmentPerUnit,
  //       investmentPerUnit: stepData.investmentPerUnit,
  //       turnoverPerUnit: stepData.turnoverPerUnit,
  //       marketServed: stepData.marketServed,
  //     } : {}),
  //   });
  // }, [currentStep, stepData, data]);

  // Helper function to render label with info icon
  const renderLabel = (fieldName: string, label: string, required: boolean = false) => {
    const stepKey = `step${contentStep}`;
    const stepDescriptions = FIELD_DESCRIPTIONS[stepKey] || {};
    const description = stepDescriptions[fieldName];

    return (
      <label className={`block text-sm font-medium mb-2 ${required ? '' : ''} flex items-center gap-2`}>
        {tf(label)}
        {required && <span className="text-red-500">*</span>}
        {description && (
          <InfoTooltip content={tf(description)} />
        )}
      </label>
    );
  };

  // Helper function to normalize array/string to array
  const normalizeToArray = (value: any): any[] => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      // Split by comma and clean up
      return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    return [];
  };

  // Helper function to normalize array/string to comma-separated string for display
  const normalizeToString = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'string') {
      return value;
    }
    return '';
  };

  const handleInputChange = (field: string, value: any) => {
    if (extraFieldNames.includes(field) || ['craft', 'currentTools', 'newTools', 'covOrLor', 'upiQr', 'fssai', 'apiicPark'].includes(field)) {
      updateExtras({ [field]: normalizeExtraValue(field, value) });
      return;
    }
    const latestStepData = getStepData(contentStep) || {};
    let nextValue = value;
    if (field === 'startDate' || field === 'endDate') nextValue = toDateInputValue(value) || value;
    if (field === 'milestones') nextValue = normalizeMilestones(value);
    if (field === 'unitName' || field === 'clusterName') {
      setStepData(contentStep, withSyncedUnitName(latestStepData, String(nextValue ?? '')));
      return;
    }
    setStepData(contentStep, {
      ...latestStepData,
      [field]: nextValue,
    });
  };

  const handleGenerateAllSteps = async () => {
    if (!getUnitName(data.step1)) {
      toast.error(t('individualDpr.toasts.needNameForAi'));
      return;
    }
    setIsFillingAll(true);
    setFillProgress({ step: 1, index: 1, total: 1 });
    try {
      const result = await fillAllStepsWithAi({
        data,
        setStepData,
        getStepData,
        setSchemeExtras,
        schemeCode,
        answers: data.ventureMatchAnswers,
        onProgress: setFillProgress,
      });
      if (result.filledSteps.length === 0) {
        toast.error(t('individualDpr.toasts.fillNone'));
        return;
      }
      if (result.failedSteps.length) {
        toast.error(t('individualDpr.toasts.fillPartial', { filled: result.filledSteps.length, failed: result.failedSteps.join(', ') }));
      } else {
        toast.success(t('individualDpr.toasts.fillSuccess', { filled: result.filledSteps.length }));
      }
      if (!['VISHWAKARMA', 'SVANIDHI', 'PMFME', 'AP_EDP'].includes(schemeCode || '')) {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error(error);
      toast.error(t('individualDpr.toasts.generateAllFailed'));
    } finally {
      setIsFillingAll(false);
      setFillProgress(null);
    }
  };

  // Handle comma-separated input fields (for array fields)
  const handleCommaSeparatedChange = (field: string, value: string) => {
    // Convert comma-separated string to array
    const arrayValue = normalizeToArray(value);
    setStepData(contentStep, {
      ...stepData,
      [field]: arrayValue,
    });
  };

  const handleArrayAdd = (field: string, newItem: any) => {
    const currentArray = Array.isArray(stepData[field]) ? stepData[field] : [];
    setStepData(contentStep, {
      ...stepData,
      [field]: [...currentArray, newItem],
    });
  };

  const handleArrayRemove = (field: string, index: number) => {
    const currentArray = Array.isArray(stepData[field]) ? stepData[field] : [];
    setStepData(contentStep, {
      ...stepData,
      [field]: currentArray.filter((_: any, i: number) => i !== index),
    });
  };

  const handleArrayUpdate = (field: string, index: number, updatedItem: any) => {
    const currentArray = Array.isArray(stepData[field]) ? stepData[field] : [];
    setStepData(contentStep, {
      ...stepData,
      [field]: currentArray.map((item: any, i: number) =>
        i === index ? { ...item, ...updatedItem } : item
      ),
    });
  };

  // Step 1: Unit basics
  if (contentStep === 1) {
    const stepDescriptions = FIELD_DESCRIPTIONS.step1 || {};

    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              {tf('Unit / Project Name *')}
              {stepDescriptions.unitName && (
                <InfoTooltip content={tf(stepDescriptions.unitName)} />
              )}
              {!stepDescriptions.unitName && stepDescriptions.clusterName && (
                <InfoTooltip content={tf(stepDescriptions.clusterName)} />
              )}
            </label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                value={getUnitName(stepData)}
                onChange={(e) => handleInputChange('unitName', e.target.value)}
                placeholder={tf('Enter unit or project name')}
              />
              <Button
                type="button"
                variant="outline"
                className="gap-1.5 shrink-0"
                onClick={() => {
                  const nature = String(stepData.natureOfBusiness || '').trim();
                  const products = String(stepData.majorProducts || '').trim();
                  if (!nature || !products) {
                    toast.error(
                      tf(
                        'Fill Nature of Business and Major Products first, then suggest a title'
                      )
                    );
                    return;
                  }
                  const suggested = suggestUnitTitle(stepData, data.schemeExtras);
                  handleInputChange('unitName', suggested);
                  toast.success(tf('Title suggested'));
                }}
              >
                <Wand2 className="h-4 w-4" />
                {tf('Suggest title')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {tf(
                'This name appears in green on the DPR cover. Suggest title needs Nature of Business and Major Products.'
              )}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              {tf('District *')}
              {stepDescriptions.district && (
                <InfoTooltip content={tf(stepDescriptions.district)} />
              )}
            </label>
            <Input
              value={stepData.district || ''}
              onChange={(e) => handleInputChange('district', e.target.value)}
              placeholder={tf("Enter district")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            {tf('Location *')}
            {stepDescriptions.location && (
              <InfoTooltip content={tf(stepDescriptions.location)} />
            )}
          </label>
          <Input
            value={stepData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder={tf("Village / town / industrial park")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              {tf('Nature of Business')}
              {stepDescriptions.natureOfBusiness && (
                <InfoTooltip content={tf(stepDescriptions.natureOfBusiness)} />
              )}
            </label>
            <Input
              value={stepData.natureOfBusiness || ''}
              onChange={(e) => handleInputChange('natureOfBusiness', e.target.value)}
              placeholder={tf("Enter nature of business")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              {tf('Major Products')}
              {stepDescriptions.majorProducts && (
                <InfoTooltip content={tf(stepDescriptions.majorProducts)} />
              )}
            </label>
            <Input
              value={stepData.majorProducts || ''}
              onChange={(e) => handleInputChange('majorProducts', e.target.value)}
              placeholder={tf("Enter major products")}
            />
          </div>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
          <p className="text-sm font-medium">{tf("Generate the rest of this DPR with AI")}</p>
          <p className="text-sm text-muted-foreground">
            {tf('Uses the unit name, district, and location to fill every visible step except document uploads. You can edit anything afterwards.')}
          </p>
          <Button
            type="button"
            onClick={handleGenerateAllSteps}
            disabled={isFillingAll}
            className="gap-2"
          >
            {isFillingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isFillingAll && fillProgress
              ? t('individualDpr.toasts.fillingStep', {
                  step: fillProgress.step,
                  index: fillProgress.index,
                  total: fillProgress.total,
                })
              : tf('Generate all steps with AI')}
          </Button>
        </div>

        {isVishwakarma && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('PM Vishwakarma — craft & eligibility')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf(
                'Spec: docs/schemes/VISHWAKARMA/vishwakarma.md — 18 trades; toolkit ₹15,000; loan ₹1 L then ₹2 L at 5%'
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Craft / trade (18 notified)')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.craft || ''}
                  onChange={(e) => updateExtras({ craft: e.target.value })}
                >
                  <option value="">{tf('Select your craft')}</option>
                  {VISHWAKARMA_CRAFTS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Training stage')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.trainingStage || ''}
                  onChange={(e) => updateExtras({ trainingStage: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {VISHWAKARMA_TRAINING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Enterprise loan tranche')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.loanTranche || ''}
                  onChange={(e) => updateExtras({ loanTranche: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {VISHWAKARMA_TRANCHE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('Similar self-employment loan in last 5 years?')}
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.priorSelfEmploymentLoan || ''}
                  onChange={(e) => updateExtras({ priorSelfEmploymentLoan: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {VISHWAKARMA_YES_NO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur full name')}</label>
                <Input
                  value={extras.entrepreneurName || ''}
                  onChange={(e) => updateExtras({ entrepreneurName: e.target.value })}
                  placeholder={tf('Full name as in Aadhaar')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Age (≥ 18)')}</label>
                <Input
                  type="number"
                  value={extras.entrepreneurAge || ''}
                  onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })}
                  placeholder={tf('e.g. 32')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Years practising this craft')}</label>
                <Input
                  type="number"
                  value={extras.experienceYears || ''}
                  onChange={(e) => updateExtras({ experienceYears: e.target.value })}
                  placeholder={tf('e.g. 8')}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Current tools')}</label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={extras.currentTools || ''}
                onChange={(e) => updateExtras({ currentTools: e.target.value })}
                placeholder={tf('Tools you use today')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {tf('New tools needed (₹15,000 toolkit voucher)')}
              </label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={extras.newTools || ''}
                onChange={(e) => updateExtras({ newTools: e.target.value })}
                placeholder={tf('Tools to buy with the e-voucher at a designated centre')}
              />
            </div>
            <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {tf('Indicative support')}: {tf('toolkit')} ₹
              {(VISHWAKARMA_TOOLKIT_LAKHS * 100000).toLocaleString('en-IN')} · {tf('loan cap')} ₹
              {(vishwakarmaTrancheCapLakhs(extras.loanTranche) * 100000 || 0).toLocaleString('en-IN')}{' '}
              · {VISHWAKARMA_INTEREST_PERCENT}% {tf('interest')} · {extras.craft || '—'} /{' '}
              {extras.trainingStage || '—'}
            </p>
          </div>
        )}

        {isSvanidhi && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('PM SVANidhi — vending & eligibility')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf(
                'Spec: docs/schemes/SVANIDHI/svanidhi.md — WC tranches ₹15k / ₹25k / ₹50k; 7% interest subsidy; UPI mandatory'
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Vending proof')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.covOrLor || ''}
                  onChange={(e) => updateExtras({ covOrLor: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {SVANIDHI_PROOF_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Loan tranche')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.loanTranche || ''}
                  onChange={(e) => updateExtras({ loanTranche: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {SVANIDHI_TRANCHE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Vending type / pitch')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.vendingType || extras.workplaceType || ''}
                  onChange={(e) =>
                    updateExtras({ vendingType: e.target.value, workplaceType: e.target.value })
                  }
                >
                  <option value="">{tf('Select')}</option>
                  {SVANIDHI_VENDING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('UPI ID (linked to bank account) — mandatory')}
                </label>
                <Input
                  value={extras.upiQr || ''}
                  onChange={(e) => updateExtras({ upiQr: e.target.value })}
                  placeholder={tf('e.g. vendor@upi')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Vendor full name')}</label>
                <Input
                  value={extras.entrepreneurName || ''}
                  onChange={(e) => updateExtras({ entrepreneurName: e.target.value })}
                  placeholder={tf('Full name as in Aadhaar')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Age (≥ 18)')}</label>
                <Input
                  type="number"
                  value={extras.entrepreneurAge || ''}
                  onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })}
                  placeholder={tf('e.g. 35')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Years in street vending')}</label>
                <Input
                  type="number"
                  value={extras.yearsVending || ''}
                  onChange={(e) => updateExtras({ yearsVending: e.target.value })}
                  placeholder={tf('e.g. 6')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Approx daily sales (₹)')}</label>
                <Input
                  type="number"
                  value={extras.dailySales || ''}
                  onChange={(e) => updateExtras({ dailySales: e.target.value })}
                  placeholder={tf('e.g. 2500')}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {tf('Indicative WC loan')}: ₹
              {Math.round(svanidhiTrancheCapLakhs(extras.loanTranche) * 100000).toLocaleString(
                'en-IN'
              )}{' '}
              · {svanidhiTrancheTenorMonths(extras.loanTranche)} {tf('months')} ·{' '}
              {SVANIDHI_INTEREST_SUBSIDY_PERCENT}% {tf('interest subsidy')} ·{' '}
              {extras.covOrLor || '—'} / {extras.loanTranche || '—'}.
            </p>
          </div>
        )}

        {isPmfme && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('PMFME — formalisation & eligibility')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf(
                'Spec: docs/schemes/PMFME/pmfme.md — NIFTEM model DPRs; 35% grant capped ₹10 L; own ≥10%'
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Unit stage')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.unitStage || ''}
                  onChange={(e) => updateExtras({ unitStage: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {PMFME_UNIT_STAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('ODOP aligned?')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.odopAligned || ''}
                  onChange={(e) => updateExtras({ odopAligned: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {PMFME_ODOP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('FSSAI')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.fssai || stepData.fssai || ''}
                  onChange={(e) => updateExtras({ fssai: e.target.value })}
                >
                  <option value="">{tf('FSSAI status')}</option>
                  {PMFME_FSSAI_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur full name')}</label>
                <Input
                  value={extras.entrepreneurName || ''}
                  onChange={(e) => updateExtras({ entrepreneurName: e.target.value })}
                  placeholder={tf('Full name as in Aadhaar')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur age')}</label>
                <Input
                  type="number"
                  value={extras.entrepreneurAge || ''}
                  onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })}
                  placeholder={tf('e.g. 32')}
                />
              </div>
              {extras.unitStage === 'existing' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {tf('Existing annual turnover (₹ Lakhs)')}
                  </label>
                  <Input
                    type="number"
                    value={extras.existingTurnover || ''}
                    onChange={(e) => updateExtras({ existingTurnover: e.target.value })}
                    placeholder={tf('e.g. 8')}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {isApEdp && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('AP MSME-EDP 4.0 — new-unit eligibility')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf(
                'Spec: docs/schemes/AP_EDP/apEdp.md — greenfield FCI capital subsidy; mutually exclusive with tech-upgrade'
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Enterprise size')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.enterpriseSize || ''}
                  onChange={(e) => updateExtras({ enterpriseSize: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {AP_EDP_SIZE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('Special category (wholly owned, AP domicile)?')}
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.specialCategory || ''}
                  onChange={(e) => updateExtras({ specialCategory: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {AP_EDP_YES_NO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('SC/ST wholly owned?')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.scStOwned || ''}
                  onChange={(e) => updateExtras({ scStOwned: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {AP_EDP_YES_NO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('AP domicile confirmed?')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.apDomicile || ''}
                  onChange={(e) => updateExtras({ apDomicile: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {AP_EDP_YES_NO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('Unit inside an APIIC park / estate?')}
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.apiicPark || ''}
                  onChange={(e) => updateExtras({ apiicPark: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  <option value="yes">{tf('Yes — SC/ST micro/small may get land rebate')}</option>
                  <option value="no">{tf('No')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur full name')}</label>
                <Input
                  value={extras.entrepreneurName || ''}
                  onChange={(e) => updateExtras({ entrepreneurName: e.target.value })}
                  placeholder={tf('Full name as in Aadhaar')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur age')}</label>
                <Input
                  type="number"
                  value={extras.entrepreneurAge || ''}
                  onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })}
                  placeholder={tf('e.g. 35')}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {tf('Indicative capital subsidy')}:{' '}
              {apEdpSubsidyPercent(extras.enterpriseSize, extras.specialCategory)}% {tf('of FCI')},{' '}
              {tf('cap')} ₹
              {apEdpSubsidyCapLakhs(extras.enterpriseSize, extras.specialCategory).toLocaleString(
                'en-IN'
              )}{' '}
              {tf('L')} · {extras.enterpriseSize || '—'} / special {extras.specialCategory || '—'}.
              {apEdpLandRebateEligible(
                extras.apiicPark,
                extras.scStOwned,
                extras.enterpriseSize
              ) && (
                <>
                  {' '}
                  · {tf('APIIC land rebate')} {AP_EDP_LAND_REBATE_PERCENT}% {tf('cap')} ₹
                  {AP_EDP_LAND_REBATE_CAP_LAKHS} {tf('L')}.
                </>
              )}
            </p>
          </div>
        )}

        {isEclgs && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('ECLGS 5.0 — existing WC facility')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf('Spec: docs/schemes/ECLGS/eclgs.md — additional WC up to 20% of peak Q4 outstanding')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Existing fund-based WC limit (₹ Lakhs)')}</label>
                <Input type="number" value={extras.existingLimit || ''} onChange={(e) => updateExtras({ existingLimit: e.target.value })} placeholder={tf('e.g. 50')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Peak Q4 WC outstanding (₹ Lakhs)')}</label>
                <Input type="number" value={extras.peakWcOutstanding || ''} onChange={(e) => updateExtras({ peakWcOutstanding: e.target.value })} placeholder={tf('e.g. 40')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Additional ECLGS WC sought (₹ Lakhs)')}</label>
                <Input type="number" value={extras.additionalWcSought || ''} onChange={(e) => updateExtras({ additionalWcSought: e.target.value })} placeholder={tf('e.g. 8')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Account status')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.accountStatus || ''} onChange={(e) => updateExtras({ accountStatus: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {ECLGS_ACCOUNT_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Authorised signatory')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Why additional liquidity is needed')}</label>
              <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.liquidityReason || ''} onChange={(e) => updateExtras({ liquidityReason: e.target.value })} />
            </div>
            <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {tf('Indicative quantum')} {ECLGS_QUANTUM_PERCENT}% ≈ ₹
              {eclgsIndicativeQuantumLakhs(extras.peakWcOutstanding).toLocaleString('en-IN')} {tf('L')} · ROI cap {ECLGS_INTEREST_CAP_PERCENT}% · tenor {ECLGS_TENOR_YEARS} {tf('yrs')}.
            </p>
          </div>
        )}

        {isZed && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('ZED — certification levels')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/ZED/zed.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Current ZED level')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.zedCurrentLevel || ''} onChange={(e) => updateExtras({ zedCurrentLevel: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {ZED_LEVEL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Target ZED level')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.zedTargetLevel || ''} onChange={(e) => updateExtras({ zedTargetLevel: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {ZED_LEVEL_OPTIONS.filter((o) => o.value !== 'none').map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Quality / sustainability focus')}</label>
              <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.qualityFocus || ''} onChange={(e) => updateExtras({ qualityFocus: e.target.value })} />
            </div>
          </div>
        )}

        {isLean && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('LEAN — process bottleneck')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/LEAN/lean.md')}</p>
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Main process bottleneck')}</label>
              <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.processBottleneck || ''} onChange={(e) => updateExtras({ processBottleneck: e.target.value })} placeholder={tf('e.g. changeover time, scrap, inventory')} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Shop-floor size / lines')}</label>
                <Input value={extras.shopFloorSize || ''} onChange={(e) => updateExtras({ shopFloorSize: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Expected lean gain')}</label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.expectedLeanGain || ''} onChange={(e) => updateExtras({ expectedLeanGain: e.target.value })} />
            </div>
          </div>
        )}

        {isMsmeIpr && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('MSME Innovative — IPR')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/MSME_IPR/msmeIpr.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('IP type')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.ipType || ''} onChange={(e) => updateExtras({ ipType: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {MSME_IPR_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Filing stage')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.filingStage || ''} onChange={(e) => updateExtras({ filingStage: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {MSME_IPR_STAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Invention / mark title')}</label>
                <Input value={extras.inventionTitle || ''} onChange={(e) => updateExtras({ inventionTitle: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isPms && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('PMS — fair / marketing')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/PMS/pms.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Event / fair name')}</label>
                <Input value={extras.eventName || ''} onChange={(e) => updateExtras({ eventName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Stall size')}</label>
                <Input value={extras.stallSize || ''} onChange={(e) => updateExtras({ stallSize: e.target.value })} placeholder={tf('e.g. 9 sqm')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Fair city')}</label>
                <Input value={extras.fairCity || ''} onChange={(e) => updateExtras({ fairCity: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Estimated fair cost (₹ Lakhs)')}</label>
                <Input type="number" value={extras.estimatedFairCost || ''} onChange={(e) => updateExtras({ estimatedFairCost: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isScstHub && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('SC/ST Hub — procurement readiness')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/SCST_HUB/scstHub.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Category')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.sclcssCategory || ''} onChange={(e) => updateExtras({ sclcssCategory: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {SCST_HUB_CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('GeM experience')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.gemExperience || ''} onChange={(e) => updateExtras({ gemExperience: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {SCST_HUB_GEM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Procurement focus')}</label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.procurementFocus || ''} onChange={(e) => updateExtras({ procurementFocus: e.target.value })} />
            </div>
          </div>
        )}

        {isAspire && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('ASPIRE — incubator & livelihood')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/ASPIRE/aspire.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Incubator / LBI name')}</label>
                <Input value={extras.incubatorName || ''} onChange={(e) => updateExtras({ incubatorName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Premises type')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.premisesType || ''} onChange={(e) => updateExtras({ premisesType: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {ASPIRE_PREMISES_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Age')}</label>
                <Input type="number" value={extras.entrepreneurAge || ''} onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Innovation / livelihood brief')}</label>
              <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.innovationBrief || extras.livelihoodFocus || ''} onChange={(e) => updateExtras({ innovationBrief: e.target.value, livelihoodFocus: e.target.value })} />
            </div>
          </div>
        )}

        {isNhdp && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('NHDP — loom & weaver')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/NHDP/nhdp.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Loom type')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.loomType || ''} onChange={(e) => updateExtras({ loomType: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {NHDP_LOOM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Weaver ID / corp membership')}</label>
                <Input value={extras.weaverId || ''} onChange={(e) => updateExtras({ weaverId: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Workplace')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.premisesType || ''} onChange={(e) => updateExtras({ premisesType: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {NHDP_PREMISES_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Product line')}</label>
                <Input value={extras.productLine || ''} onChange={(e) => updateExtras({ productLine: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Yarn source')}</label>
                <Input value={extras.yarnSource || ''} onChange={(e) => updateExtras({ yarnSource: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Weaver name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        
        {isCvy && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('CVY — coir unit')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/CVY/cvy.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Coir product line')}</label>
                <Input value={extras.coirProductLine || ''} onChange={(e) => updateExtras({ coirProductLine: e.target.value })} placeholder={tf('e.g. coir fibre, pith, mats')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Coir Board status')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.coirBoardStatus || ''} onChange={(e) => updateExtras({ coirBoardStatus: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {CVY_BOARD_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Premises')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.premisesType || ''} onChange={(e) => updateExtras({ premisesType: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {CVY_PREMISES_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isMseGift && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('MSE-GIFT — green / EE')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/MSE_GIFT/mseGift.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Energy baseline (kWh / month)')}</label>
                <Input type="number" value={extras.energyBaselineKwh || ''} onChange={(e) => updateExtras({ energyBaselineKwh: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Expected saving (%)')}</label>
                <Input type="number" value={extras.expectedSaving || ''} onChange={(e) => updateExtras({ expectedSaving: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('EE equipment focus')}</label>
                <Input value={extras.eeEquipment || ''} onChange={(e) => updateExtras({ eeEquipment: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isPtuas && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('PTUAS — pharma upgrade')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/PTUAS/ptuas.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('GMP status')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.gmpStatus || ''} onChange={(e) => updateExtras({ gmpStatus: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {PTUAS_GMP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Product licence')}</label>
                <Input value={extras.productLicence || ''} onChange={(e) => updateExtras({ productLicence: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Existing tech')}</label>
                <Input value={extras.existingTech || ''} onChange={(e) => updateExtras({ existingTech: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Proposed tech')}</label>
                <Input value={extras.proposedTech || ''} onChange={(e) => updateExtras({ proposedTech: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isPmpds && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('PMPDS — promotion')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/PMPDS/pmpds.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Focus')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.deviceOrFormulation || ''} onChange={(e) => updateExtras({ deviceOrFormulation: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {PMPDS_FOCUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Promotion / development need')}</label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.promotionNeed || ''} onChange={(e) => updateExtras({ promotionNeed: e.target.value })} />
            </div>
          </div>
        )}

        {isCgtmse && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('CGTMSE — credit guarantee (MUDRA-adjacent)')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/CGTMSE/cgtmse.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Loan purpose')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.loanPurpose || ''} onChange={(e) => updateExtras({ loanPurpose: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {CGTMSE_PURPOSE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Women-owned')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.womenOwned || ''} onChange={(e) => updateExtras({ womenOwned: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {CGTMSE_WOMEN_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Proposed limit (₹ Lakhs)')}</label>
                <Input type="number" value={extras.proposedLimit || ''} onChange={(e) => updateExtras({ proposedLimit: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isApFpp && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('AP FPP 4.0 — food processing')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/AP_FPP/apFpp.md — do not double-claim with AP_EDP')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Enterprise size')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.enterpriseSize || ''} onChange={(e) => updateExtras({ enterpriseSize: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {AP_FPP_SIZE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Special category')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.specialCategory || ''} onChange={(e) => updateExtras({ specialCategory: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {AP_FPP_YES_NO.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('FPO / SHG')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.fpoShg || ''} onChange={(e) => updateExtras({ fpoShg: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {AP_FPP_YES_NO.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('AP domicile')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.apDomicile || ''} onChange={(e) => updateExtras({ apDomicile: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {AP_FPP_YES_NO.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Premises')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.premisesType || ''} onChange={(e) => updateExtras({ premisesType: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {AP_FPP_PREMISES_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isApCmep && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('AP CMEP — credit-linked')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/AP_CMEP/apCmep.md — bank loan required')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Activity band')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.activityBand || ''} onChange={(e) => updateExtras({ activityBand: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {AP_CMEP_ACTIVITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Booster category')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.boosterCategory || ''} onChange={(e) => updateExtras({ boosterCategory: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {AP_CMEP_BOOSTER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('AP domicile')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.apDomicile || ''} onChange={(e) => updateExtras({ apDomicile: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {AP_CMEP_YES_NO.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isObmms && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('OBMMS — welfare self-employment')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/OBMMS/obmms.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Welfare corporation')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.welfareCorporation || ''} onChange={(e) => updateExtras({ welfareCorporation: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {OBMMS_CORP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('White rice card')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.whiteRiceCard || ''} onChange={(e) => updateExtras({ whiteRiceCard: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {OBMMS_YES_NO.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Activity / trade')}</label>
                <Input value={extras.activityTrade || ''} onChange={(e) => updateExtras({ activityTrade: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Age')}</label>
                <Input type="number" value={extras.entrepreneurAge || ''} onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isMseSpice && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('MSE-SPICE — circular economy')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/MSE_SPICE/mseSpice.md — 25% P&M cap ₹12.5 L')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Circular sector')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.circularSector || ''} onChange={(e) => updateExtras({ circularSector: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {MSE_SPICE_SECTOR_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Existing unit years')}</label>
                <Input type="number" value={extras.existingUnitYears || ''} onChange={(e) => updateExtras({ existingUnitYears: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Proposed P&M cost (₹ Lakhs)')}</label>
                <Input type="number" value={extras.proposedPmCost || ''} onChange={(e) => updateExtras({ proposedPmCost: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isApParks && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('AP MSME-PARKS — land rebate')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/AP_PARKS/apParks.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('APIIC / park name')}</label>
                <Input value={extras.apiicParkName || ''} onChange={(e) => updateExtras({ apiicParkName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Plot area')}</label>
                <Input value={extras.plotArea || ''} onChange={(e) => updateExtras({ plotArea: e.target.value })} placeholder={tf('e.g. 500 sq.yd')} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Land rebate claim')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.landRebateClaim || ''} onChange={(e) => updateExtras({ landRebateClaim: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {AP_PARKS_REBATE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('AP domicile')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.apDomicile || ''} onChange={(e) => updateExtras({ apDomicile: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {AP_PARKS_YES_NO.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {isRampTeam && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('RAMP TEAM — ONDC')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/RAMP_TEAM/rampTeam.md')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('ONDC readiness')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.ondcReady || ''} onChange={(e) => updateExtras({ ondcReady: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {RAMP_TEAM_ONDC_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Catalogue SKUs (approx)')}</label>
                <Input type="number" value={extras.catalogueSkus || ''} onChange={(e) => updateExtras({ catalogueSkus: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Product list note')}</label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.productListNote || ''} onChange={(e) => updateExtras({ productListNote: e.target.value })} />
            </div>
          </div>
        )}

        {isEpmNiryat && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('EPM Niryat — export credit')}</h3>
            <p className="text-xs text-muted-foreground">{tf('Spec: docs/schemes/EPM_NIRYAT/epmNiryat.md — 2.75% interest subvention')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Export markets')}</label>
                <Input value={extras.exportMarkets || ''} onChange={(e) => updateExtras({ exportMarkets: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('HSN lines')}</label>
                <Input value={extras.hsnLines || ''} onChange={(e) => updateExtras({ hsnLines: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Pre / post shipment')}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={extras.prePostShipment || ''} onChange={(e) => updateExtras({ prePostShipment: e.target.value })}>
                  <option value="">{tf('Select')}</option>
                  {EPM_NIRYAT_CREDIT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{tf(o.label)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Export credit sought (₹ Lakhs)')}</label>
                <Input type="number" value={extras.exportCreditSought || ''} onChange={(e) => updateExtras({ exportCreditSought: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur name')}</label>
                <Input value={extras.entrepreneurName || ''} onChange={(e) => updateExtras({ entrepreneurName: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {schemeCode === 'PMEGP' && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('PMEGP — entrepreneur & subsidy inputs')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf(
                'These fields drive margin-money % (category × rural/urban). Spec: docs/schemes/PMEGP/pmegp.md'
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Category')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.pmegpCategory || ''}
                  onChange={(e) => {
                    const pmegpCategory = e.target.value;
                    updateExtras({
                      pmegpCategory,
                      pmegpSubsidyPercent: String(
                        pmegpSubsidyPercent(pmegpCategory, extras.pmegpArea)
                      ),
                      pmegpOwnPercent: String(pmegpOwnPercent(pmegpCategory)),
                    });
                  }}
                >
                  <option value="">{tf('Select category')}</option>
                  {PMEGP_CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Area (rural / urban)')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.pmegpArea || ''}
                  onChange={(e) => {
                    const pmegpArea = e.target.value;
                    updateExtras({
                      pmegpArea,
                      pmegpSubsidyPercent: String(
                        pmegpSubsidyPercent(extras.pmegpCategory, pmegpArea)
                      ),
                    });
                  }}
                >
                  <option value="">{tf('Select area')}</option>
                  {PMEGP_AREA_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Implementing agency')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.pmegpAgency || ''}
                  onChange={(e) => updateExtras({ pmegpAgency: e.target.value })}
                >
                  <option value="">{tf('Select agency')}</option>
                  {PMEGP_AGENCY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Education')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.educationStatus || ''}
                  onChange={(e) => updateExtras({ educationStatus: e.target.value })}
                >
                  <option value="">{tf('Select education')}</option>
                  {PMEGP_EDUCATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur full name')}</label>
                <Input
                  value={extras.entrepreneurName || ''}
                  onChange={(e) => updateExtras({ entrepreneurName: e.target.value })}
                  placeholder={tf('Full name as in Aadhaar')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur age')}</label>
                <Input
                  type="number"
                  value={extras.entrepreneurAge || ''}
                  onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })}
                  placeholder={tf('Must be 18 or older')}
                />
              </div>
            </div>
            {(extras.pmegpCategory || extras.pmegpArea) && (
              <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                {tf('Indicative margin money')}:{' '}
                {pmegpSubsidyPercent(extras.pmegpCategory, extras.pmegpArea)}% · {tf('Own contribution')}:{' '}
                {pmegpOwnPercent(extras.pmegpCategory)}%
              </p>
            )}
          </div>
        )}

        {isPmegp2nd && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('PMEGP 2nd loan — prior assistance')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf(
                'Spec: docs/schemes/PMEGP_2ND/pmegp2nd.md — brownfield only; uniform 15% MM (20% NER/Hill); own 10%'
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Prior scheme')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.priorScheme || ''}
                  onChange={(e) => updateExtras({ priorScheme: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {PMEGP_2ND_PRIOR_SCHEME_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('First sanction / project cost (₹ Lakhs)')}
                </label>
                <Input
                  type="number"
                  value={extras.priorSanctionAmount || ''}
                  onChange={(e) => updateExtras({ priorSanctionAmount: e.target.value })}
                  placeholder={tf('e.g. 12')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Year of first subsidy')}</label>
                <Input
                  value={extras.firstSubsidyYear || ''}
                  onChange={(e) => updateExtras({ firstSubsidyYear: e.target.value })}
                  placeholder={tf('e.g. 2019')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Implementing agency')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.pmegpAgency || ''}
                  onChange={(e) => updateExtras({ pmegpAgency: e.target.value })}
                >
                  <option value="">{tf('Select agency')}</option>
                  {PMEGP_2ND_AGENCY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Sector band')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.sectorBand || ''}
                  onChange={(e) => updateExtras({ sectorBand: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {PMEGP_2ND_SECTOR_BAND_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('NER / Hill State?')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.nerHill || ''}
                  onChange={(e) => updateExtras({ nerHill: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {PMEGP_2ND_YES_NO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('First margin money adjusted?')}
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.marginMoneyAdjusted || ''}
                  onChange={(e) => updateExtras({ marginMoneyAdjusted: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {PMEGP_2ND_YES_NO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('First loan repaid in time?')}
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.firstLoanRepaid || ''}
                  onChange={(e) => updateExtras({ firstLoanRepaid: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {PMEGP_2ND_YES_NO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('Years of continuous profit')}
                </label>
                <Input
                  type="number"
                  value={extras.yearsProfitable || ''}
                  onChange={(e) => updateExtras({ yearsProfitable: e.target.value })}
                  placeholder={tf('Expect ≥ 3')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('Latest annual turnover (₹ Lakhs)')}
                </label>
                <Input
                  type="number"
                  value={extras.existingTurnover || ''}
                  onChange={(e) => updateExtras({ existingTurnover: e.target.value })}
                  placeholder={tf('e.g. 28')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur full name')}</label>
                <Input
                  value={extras.entrepreneurName || ''}
                  onChange={(e) => updateExtras({ entrepreneurName: e.target.value })}
                  placeholder={tf('Full name as in Aadhaar')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur age')}</label>
                <Input
                  type="number"
                  value={extras.entrepreneurAge || ''}
                  onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })}
                  placeholder={tf('Must be 18 or older')}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {tf('Indicative upgrade MM')}: {pmegp2ndSubsidyPercent(extras.nerHill)}% · {tf('Own')}:{' '}
              {PMEGP_2ND_OWN_PERCENT}% · {extras.priorScheme || '—'} / {extras.sectorBand || '—'}
            </p>
          </div>
        )}

        {isSclcss && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('SCLCSS — SC/ST capital subsidy')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf(
                'Spec: docs/schemes/SCLCSS/sclcss.md — 25% on new P&M, cap ₹25 L; SC/ST ≥51%; not general CLCSS'
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('SC / ST category')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.sclcssCategory || ''}
                  onChange={(e) => updateExtras({ sclcssCategory: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {SCLCSS_CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Unit stage')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.unitStage || ''}
                  onChange={(e) => updateExtras({ unitStage: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {SCLCSS_UNIT_STAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('SC/ST controlling stake % (if not sole prop)')}
                </label>
                <Input
                  type="number"
                  value={extras.controllingStakePercent || ''}
                  onChange={(e) => updateExtras({ controllingStakePercent: e.target.value })}
                  placeholder={tf(`Must be ≥ ${SCLCSS_MIN_STAKE_PERCENT} for firms`)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Udyam status / number')}</label>
                <Input
                  value={extras.udyamStatus || ''}
                  onChange={(e) => updateExtras({ udyamStatus: e.target.value })}
                  placeholder={tf('Udyam number or “applied / ready”')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur full name')}</label>
                <Input
                  value={extras.entrepreneurName || ''}
                  onChange={(e) => updateExtras({ entrepreneurName: e.target.value })}
                  placeholder={tf('Full name as in Aadhaar')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur age')}</label>
                <Input
                  type="number"
                  value={extras.entrepreneurAge || ''}
                  onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })}
                  placeholder={tf('e.g. 35')}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {tf('Indicative capital subsidy')}: {SCLCSS_SUBSIDY_PERCENT}% {tf('capped at')} ₹
              {SCLCSS_SUBSIDY_CAP_LAKHS} {tf('L')} · {extras.sclcssCategory || '—'} /{' '}
              {extras.unitStage || '—'}
            </p>
          </div>
        )}

        {isApTech && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('AP Technology Upgradation — eligibility')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf(
                'Spec: docs/schemes/AP_TECH_UPGRADE/apTechUpgrade.md — brownfield FCI; mutually exclusive with new-unit EDP capital subsidy'
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Enterprise size')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.enterpriseSize || ''}
                  onChange={(e) => updateExtras({ enterpriseSize: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {AP_TECH_SIZE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('Special category (wholly owned, AP domicile)?')}
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.specialCategory || ''}
                  onChange={(e) => updateExtras({ specialCategory: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {AP_TECH_YES_NO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('AP domicile confirmed?')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.apDomicile || ''}
                  onChange={(e) => updateExtras({ apDomicile: e.target.value })}
                >
                  <option value="">{tf('Select')}</option>
                  {AP_TECH_YES_NO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Years in operation')}</label>
                <Input
                  type="number"
                  value={extras.yearsInOperation || ''}
                  onChange={(e) => updateExtras({ yearsInOperation: e.target.value })}
                  placeholder={tf('e.g. 5')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('Latest annual turnover (₹ Lakhs)')}
                </label>
                <Input
                  type="number"
                  value={extras.existingTurnover || ''}
                  onChange={(e) => updateExtras({ existingTurnover: e.target.value })}
                  placeholder={tf('e.g. 45')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur full name')}</label>
                <Input
                  value={extras.entrepreneurName || ''}
                  onChange={(e) => updateExtras({ entrepreneurName: e.target.value })}
                  placeholder={tf('Full name as in Aadhaar')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur age')}</label>
                <Input
                  type="number"
                  value={extras.entrepreneurAge || ''}
                  onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })}
                  placeholder={tf('e.g. 38')}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
              {tf('Indicative tech-upgrade subsidy')}:{' '}
              {apTechSubsidyPercent(extras.enterpriseSize, extras.specialCategory)}% {tf('of FCI')},{' '}
              {tf('cap')} ₹
              {apTechSubsidyCapLakhs(extras.enterpriseSize, extras.specialCategory).toLocaleString(
                'en-IN'
              )}{' '}
              {tf('L')} · {extras.enterpriseSize || '—'} / special {extras.specialCategory || '—'}.
            </p>
          </div>
        )}

        {isMudra && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('MUDRA — PMMY category & applicant')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf('Spec: docs/schemes/MUDRA/mudra.md — Shishu / Kishore / Tarun / Tarun Plus')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('PMMY category')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.mudraCategory || ''}
                  onChange={(e) => updateExtras({ mudraCategory: e.target.value })}
                >
                  <option value="">{tf('Select category')}</option>
                  {MUDRA_CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Loan purpose')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.loanPurpose || ''}
                  onChange={(e) => updateExtras({ loanPurpose: e.target.value })}
                >
                  <option value="">{tf('Select purpose')}</option>
                  {MUDRA_LOAN_PURPOSE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur full name')}</label>
                <Input
                  value={extras.entrepreneurName || ''}
                  onChange={(e) => updateExtras({ entrepreneurName: e.target.value })}
                  placeholder={tf('Full name as in Aadhaar')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur age')}</label>
                <Input
                  type="number"
                  value={extras.entrepreneurAge || ''}
                  onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })}
                  placeholder={tf('Must be 18 or older')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('Experience in this line (years)')}
                </label>
                <Input
                  type="number"
                  value={extras.experienceYears || ''}
                  onChange={(e) => updateExtras({ experienceYears: e.target.value })}
                  placeholder={tf('e.g. 3')}
                />
              </div>
            </div>
          </div>
        )}

        {isStandup && (
          <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
            <h3 className="text-lg font-semibold">{tf('Stand-Up India — eligibility')}</h3>
            <p className="text-xs text-muted-foreground">
              {tf(
                'Spec: docs/schemes/STANDUP/standup.md — woman / SC / ST, greenfield, ≥10% own, ₹10 L–₹1 Cr'
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Eligible category')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={extras.standupCategory || ''}
                  onChange={(e) => updateExtras({ standupCategory: e.target.value })}
                >
                  <option value="">{tf('Select category')}</option>
                  {STANDUP_CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('Composite loan sought (₹ Lakhs)')}
                </label>
                <Input
                  type="number"
                  value={extras.loanAmountSought || ''}
                  onChange={(e) => updateExtras({ loanAmountSought: e.target.value })}
                  placeholder={tf('Above 10 and up to 100')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur full name')}</label>
                <Input
                  value={extras.entrepreneurName || ''}
                  onChange={(e) => updateExtras({ entrepreneurName: e.target.value })}
                  placeholder={tf('Full name as in Aadhaar')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Entrepreneur age')}</label>
                <Input
                  type="number"
                  value={extras.entrepreneurAge || ''}
                  onChange={(e) => updateExtras({ entrepreneurAge: e.target.value })}
                  placeholder={tf('Must be 18 or older')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {tf('Controlling stake % (if not sole prop)')}
                </label>
                <Input
                  type="number"
                  value={extras.controllingStakePercent || ''}
                  onChange={(e) => updateExtras({ controllingStakePercent: e.target.value })}
                  placeholder={tf('Must be ≥ 51 for firms')}
                />
              </div>
            </div>
          </div>
        )}

        {extraFieldNames.length > 0 &&
          !['VISHWAKARMA', 'SVANIDHI', 'PMFME', 'AP_EDP', 'PMEGP', 'PMEGP_2ND', 'MUDRA', 'STANDUP', 'SCLCSS', 'AP_TECH_UPGRADE', 'ECLGS', 'ZED', 'LEAN', 'MSME_IPR', 'PMS', 'SCST_HUB', 'ASPIRE', 'NHDP', 'CVY', 'MSE_GIFT', 'PTUAS', 'PMPDS', 'CGTMSE', 'AP_FPP', 'AP_CMEP', 'OBMMS', 'MSE_SPICE', 'AP_PARKS', 'RAMP_TEAM', 'EPM_NIRYAT'].includes(
            schemeCode || ''
          ) && (
            <div className="border rounded-lg p-4 space-y-4 bg-amber-50/50">
              <h3 className="text-lg font-semibold">{tf('Scheme-specific details')}</h3>
              {extraFieldNames.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-2">{tf(field)}</label>
                  <Input
                    value={String(extras[field] ?? stepData[field] ?? '')}
                    onChange={(e) => updateExtras({ [field]: e.target.value })}
                    placeholder={tf(field)}
                  />
                </div>
              ))}
            </div>
          )}

      </div>
    );
  }

  // Step 2: Introduction & Sector Overview
  if (contentStep === 2) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div>
          {renderLabel('sectorType', isLeanUnit ? 'Sector / industry type' : 'Sector / Industry Type', true)}
          <Input
            value={stepData.sectorType || ''}
            onChange={(e) => handleInputChange('sectorType', e.target.value)}
            placeholder={tf("Enter sector type")}
          />
        </div>

        <div>
          {renderLabel('sectorDescription', isLeanUnit ? 'Short intro — what the unit does' : 'Sector Description', true)}
          <textarea
            className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.sectorDescription || ''}
            onChange={(e) => handleInputChange('sectorDescription', e.target.value)}
            placeholder={
              isLeanUnit
                ? tf('Short intro: product, customers, what the unit does')
                : tf('Describe the sector in detail')
            }
          />
        </div>

        {(isPmegp ||
          isPmegp2nd ||
          isStandup ||
          isPmfme ||
          isSclcss ||
          isApTech ||
          isApEdp ||
          isVishwakarma ||
          isSvanidhi) && (
          <div>
            <label className="block text-sm font-medium mb-2">{tf('Process of manufacture')}</label>
            <textarea
              className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={extras.processOfManufacture || ''}
              onChange={(e) => updateExtras({ processOfManufacture: e.target.value })}
              placeholder={
                isApEdp
                  ? tf('Process of manufacture for the new greenfield unit')
                  : isSvanidhi
                  ? tf('How you source, prepare (if food), and sell — daily routine')
                  : isVishwakarma
                  ? tf('How you make / deliver the craft product or service (step by step)')
                  : isApTech || isSclcss
                  ? tf('Process after new plant & machinery (manufacturing)')
                  : isPmegp2nd
                    ? tf('Process after upgrade / modernisation')
                    : isPmfme
                      ? tf('Food processing / value-addition steps (as in NIFTEM model DPRs)')
                      : isStandup
                        ? tf('Process of manufacture / service delivery (bank checklist)')
                        : tf('Step-by-step process (as in KVIC bakery / curd profiles)')
              }
            />
          </div>
        )}
        {(isPmegp2nd || isSclcss || isApTech) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Existing technology')}</label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={extras.existingTech || ''}
                onChange={(e) => updateExtras({ existingTech: e.target.value })}
                placeholder={tf('What the unit uses today')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{tf('Proposed technology / upgrade')}</label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={extras.proposedTech || ''}
                onChange={(e) => updateExtras({ proposedTech: e.target.value })}
                placeholder={
                  isApTech
                    ? tf('New / upgraded P&M with tech specs (FCI base)')
                    : isSclcss
                      ? tf('New P&M / equipment with tech specs (subsidy base)')
                      : tf('Machinery / process being added')
                }
              />
            </div>
          </div>
        )}
        {isApTech && (
          <div>
            <label className="block text-sm font-medium mb-2">
              {tf('Expected productivity / quality / cost gain')}
            </label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={extras.productivityGain || ''}
              onChange={(e) => updateExtras({ productivityGain: e.target.value })}
              placeholder={tf('Why DIC should support this upgrade')}
            />
          </div>
        )}

        {!isLeanUnit && (
          <>
        <div>
          {renderLabel('nationalImportance', 'National Importance')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.nationalImportance || ''}
            onChange={(e) => handleInputChange('nationalImportance', e.target.value)}
            placeholder={tf("Describe national importance")}
          />
        </div>

        <div>
          {renderLabel('stateLevelImportance', 'State-level Importance')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.stateLevelImportance || ''}
            onChange={(e) => handleInputChange('stateLevelImportance', e.target.value)}
            placeholder={tf("Describe state-level importance")}
          />
        </div>

        <div>
          {renderLabel('keyProducts', 'Key Products')}
          <div className="space-y-2">
            {(Array.isArray(stepData.keyProducts) ? stepData.keyProducts : []).map((product: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={product}
                  onChange={(e) => {
                    const updated = [...(stepData.keyProducts || [])];
                    updated[index] = e.target.value;
                    handleInputChange('keyProducts', updated);
                  }}
                  placeholder={tf("Enter product name")}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleArrayRemove('keyProducts', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd('keyProducts', '')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
          </>
        )}
      </div>
    );
  }

  // Step 3: District & Regional Profile
  if (contentStep === 3) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div>
          {renderLabel(
            'geography',
            isLeanUnit ? 'Brief location / market catchment' : 'Geography'
          )}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.geography || ''}
            onChange={(e) => handleInputChange('geography', e.target.value)}
            placeholder={
              isLeanUnit
                ? tf('Site, roads, nearby markets — brief feasibility note')
                : tf('Describe geography')
            }
          />
        </div>
        {!isLeanUnit && (
          <>
        <div>
          {renderLabel('climate', 'Climate')}
          <Input
            value={stepData.climate || ''}
            onChange={(e) => handleInputChange('climate', e.target.value)}
            placeholder={tf("Enter climate details")}
          />
        </div>
        <div>
          {renderLabel('infrastructure', 'Infrastructure')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.infrastructure || ''}
            onChange={(e) => handleInputChange('infrastructure', e.target.value)}
            placeholder={tf("Describe infrastructure")}
          />
        </div>
        <div>
          {renderLabel('keyEconomicActivities', 'Key Economic Activities')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.keyEconomicActivities || ''}
            onChange={(e) => handleInputChange('keyEconomicActivities', e.target.value)}
            placeholder={tf("Describe key economic activities")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {renderLabel('rawMaterialAvailability', 'Raw Material Availability')}
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={stepData.rawMaterialAvailability || ''}
              onChange={(e) => handleInputChange('rawMaterialAvailability', e.target.value)}
              placeholder={tf("Describe raw material availability")}
            />
          </div>
          <div>
            {renderLabel('rawMaterialQuantity', 'Raw Material Quantity')}
            <Input
              value={stepData.rawMaterialQuantity || ''}
              onChange={(e) => handleInputChange('rawMaterialQuantity', e.target.value)}
              placeholder={tf("Enter quantity")}
            />
          </div>
        </div>
        <div>
          {renderLabel('industrialInfrastructure', 'Industrial Infrastructure')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.industrialInfrastructure || ''}
            onChange={(e) => handleInputChange('industrialInfrastructure', e.target.value)}
            placeholder={tf("Describe industrial infrastructure")}
          />
        </div>
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">{tf("Connectivity")}</h3>
          <div className="space-y-4">
            <div>
              {renderLabel('connectivity', 'Road')}
              <Input
                value={stepData.connectivity?.road || ''}
                onChange={(e) => handleInputChange('connectivity', {
                  ...stepData.connectivity,
                  road: e.target.value,
                })}
                placeholder={tf("Enter road connectivity details")}
              />
            </div>
            <div>
              {renderLabel('connectivity', 'Rail')}
              <Input
                value={stepData.connectivity?.rail || ''}
                onChange={(e) => handleInputChange('connectivity', {
                  ...stepData.connectivity,
                  rail: e.target.value,
                })}
                placeholder={tf("Enter rail connectivity details")}
              />
            </div>
            <div>
              {renderLabel('connectivity', 'Port')}
              <Input
                value={stepData.connectivity?.port || ''}
                onChange={(e) => handleInputChange('connectivity', {
                  ...stepData.connectivity,
                  port: e.target.value,
                })}
                placeholder={tf("Enter port connectivity details")}
              />
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    );
  }

  // Step 4: Unit profile
  if (contentStep === 4) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div>
          {renderLabel(
            'presentActivities',
            isLeanUnit ? 'Present / proposed activity summary' : 'Present Activities'
          )}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.presentActivities || ''}
            onChange={(e) => handleInputChange('presentActivities', e.target.value)}
            placeholder={
              isLeanUnit
                ? tf('Present or proposed activity summary')
                : tf('Describe present activities')
            }
          />
        </div>
        <div>
          {renderLabel(
            'yearOfEstablishment',
            isLeanUnit ? 'Start / commencement (existing or proposed)' : 'Year of Establishment'
          )}
          <Input
            type={isLeanUnit ? 'text' : 'number'}
            value={stepData.yearOfEstablishment || ''}
            onChange={(e) =>
              handleInputChange(
                'yearOfEstablishment',
                isLeanUnit ? e.target.value : parseInt(e.target.value) || 0
              )
            }
            placeholder={isLeanUnit ? tf('e.g. Apr 2026') : tf('YYYY')}
          />
        </div>
        <div>
          {renderLabel(
            'technologyLevel',
            isLeanUnit ? 'Tools / process level' : 'Technology Level'
          )}
          <Input
            value={stepData.technologyLevel || ''}
            onChange={(e) => handleInputChange('technologyLevel', e.target.value)}
            placeholder={tf('Enter technology level')}
          />
        </div>
        <div>
          {renderLabel(
            'productionCapacity',
            isLeanUnit ? 'Capacity / throughput (if applicable)' : 'Production Capacity'
          )}
          <Input
            value={stepData.productionCapacity || extras.installedCapacity || ''}
            onChange={(e) => {
              handleInputChange('productionCapacity', e.target.value);
              if (isPmegp || isPmegp2nd || isStandup || isPmfme || isSclcss || isApTech || isApEdp)
                updateExtras({ installedCapacity: e.target.value });
            }}
            placeholder={
              isLeanUnit
                ? tf('e.g. 50 kg/hour or 1000 units/month')
                : tf('Enter production capacity')
            }
          />
        </div>
        {(isPmegp2nd || isApTech) && (
          <div>
            <label className="block text-sm font-medium mb-2">
              {tf('Existing capacity (before upgrade)')}
            </label>
            <Input
              value={extras.existingCapacity || ''}
              onChange={(e) => updateExtras({ existingCapacity: e.target.value })}
              placeholder={tf('e.g. 200 units/day')}
            />
          </div>
        )}
        {(isPmegp || isPmegp2nd || isStandup || isPmfme || isSclcss || isApTech || isApEdp) && (
          <div>
            <label className="block text-sm font-medium mb-2">
              {tf('Capacity utilisation Year 1 (%)')}
            </label>
            <Input
              type="number"
              value={extras.capacityUtilisationY1 || ''}
              onChange={(e) => updateExtras({ capacityUtilisationY1: e.target.value })}
              placeholder={isPmfme ? tf('e.g. 60 (NIFTEM models ramp 60→70→80)') : tf('e.g. 60')}
            />
          </div>
        )}
        {isPmfme && (
          <div>
            <label className="block text-sm font-medium mb-2">{tf('Proposed workers (nos.)')}</label>
            <Input
              type="number"
              value={extras.proposedWorkers || ''}
              onChange={(e) => updateExtras({ proposedWorkers: e.target.value })}
              placeholder={tf('e.g. 6')}
            />
          </div>
        )}
        {!isLeanUnit && (
          <>
        <div>
          {renderLabel('clusterEvolution', 'How your unit evolved')}
          <textarea
            className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.clusterEvolution || ''}
            onChange={(e) => handleInputChange('clusterEvolution', e.target.value)}
            placeholder={tf("Describe how the unit evolved")}
          />
        </div>
        <div>
          {renderLabel('typeOfUnits', 'Type of unit')}
          <Input
            value={stepData.typeOfUnits || ''}
            onChange={(e) => handleInputChange('typeOfUnits', e.target.value)}
            placeholder={tf("Enter type of units")}
          />
        </div>
        <div>
          {renderLabel('stakeholders', 'Stakeholders')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={normalizeToString(stepData.stakeholders)}
            onChange={(e) => handleCommaSeparatedChange('stakeholders', e.target.value)}
            placeholder={tf("Enter stakeholders separated by commas (e.g., Stakeholder 1, Stakeholder 2, Stakeholder 3)")}
          />
          <p className="text-xs text-muted-foreground mt-1">{tf("Separate multiple stakeholders with commas")}</p>
        </div>
          </>
        )}
      </div>
    );
  }

  // Step 5: Value Chain Details
  if (contentStep === 5) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div>
          {renderLabel('rawMaterials', 'Raw Materials')}
          <div className="space-y-4">
            {(Array.isArray(stepData.rawMaterials) ? stepData.rawMaterials : []).map((material: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Raw Material {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArrayRemove('rawMaterials', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={material.name || ''}
                    onChange={(e) => handleArrayUpdate('rawMaterials', index, { name: e.target.value })}
                    placeholder={tf("Material name")}
                  />
                  <Input
                    value={material.source || ''}
                    onChange={(e) => handleArrayUpdate('rawMaterials', index, { source: e.target.value })}
                    placeholder={tf("Source")}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd('rawMaterials', { name: '', source: '' })}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Raw Material
            </Button>
          </div>
        </div>

        <div>
          {renderLabel('intermediateProducts', 'Intermediate Products')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={normalizeToString(stepData.intermediateProducts)}
            onChange={(e) => handleCommaSeparatedChange('intermediateProducts', e.target.value)}
            placeholder={tf("Enter intermediate products separated by commas (e.g., Semi-finished Product 1, Semi-finished Product 2)")}
          />
          <p className="text-xs text-muted-foreground mt-1">{tf("Separate multiple products with commas")}</p>
        </div>

        <div>
          {renderLabel('finalProducts', 'Final Products')}
          <div className="space-y-2">
            {(Array.isArray(stepData.finalProducts) ? stepData.finalProducts : []).map((product: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={product}
                  onChange={(e) => {
                    const updated = [...(stepData.finalProducts || [])];
                    updated[index] = e.target.value;
                    handleInputChange('finalProducts', updated);
                  }}
                  placeholder={tf("Enter final product")}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleArrayRemove('finalProducts', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd('finalProducts', '')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Final Product
            </Button>
          </div>
        </div>

        <div>
          {renderLabel('valueAdditionStages', 'Value Addition Stages')}
          <div className="space-y-4">
            {(Array.isArray(stepData.valueAdditionStages) ? stepData.valueAdditionStages : []).map((stage: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Stage {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArrayRemove('valueAdditionStages', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={stage.stage || ''}
                    onChange={(e) => handleArrayUpdate('valueAdditionStages', index, { stage: e.target.value })}
                    placeholder={tf("Stage name")}
                  />
                  <Input
                    type="number"
                    value={stage.sellingPrice || ''}
                    onChange={(e) => handleArrayUpdate('valueAdditionStages', index, { sellingPrice: parseFloat(e.target.value) || 0 })}
                    placeholder={tf("Selling price (₹ Lakhs)")}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd('valueAdditionStages', { stage: '', sellingPrice: 0 })}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Value Addition Stage
            </Button>
          </div>
        </div>

        <div>
          {renderLabel('majorBuyers', 'Major Buyers')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={normalizeToString(stepData.majorBuyers)}
            onChange={(e) => handleCommaSeparatedChange('majorBuyers', e.target.value)}
            placeholder={tf("Enter major buyers separated by commas (e.g., Buyer 1, Buyer 2, Buyer 3)")}
          />
          <p className="text-xs text-muted-foreground mt-1">{tf("Separate multiple buyers with commas")}</p>
        </div>
      </div>
    );
  }

  // Step 6: Market Assessment
  if (contentStep === 6) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div>
          {renderLabel(
            'targetMarket',
            isLeanUnit ? 'Target customers / market' : 'Target Market'
          )}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.targetMarket || ''}
            onChange={(e) => handleInputChange('targetMarket', e.target.value)}
            placeholder={tf('Describe target market')}
          />
        </div>
        <div>
          {renderLabel('existingDemand', isLeanUnit ? 'Demand / footfall note' : 'Existing Demand')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.existingDemand || ''}
            onChange={(e) => handleInputChange('existingDemand', e.target.value)}
            placeholder={tf('Describe existing demand')}
          />
        </div>
        {isPmfme && (
          <div>
            <label className="block text-sm font-medium mb-2">
              {tf('Sources of raw material')}
            </label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={extras.rawMaterialSources || ''}
              onChange={(e) => updateExtras({ rawMaterialSources: e.target.value })}
              placeholder={tf('Farmers / mandi / contract sourcing — MoFPI DPR requirement')}
            />
          </div>
        )}
        {isStandup && (
          <div>
            {renderLabel(
              'competitorAnalysis',
              'Major competitors + your strengths / weaknesses'
            )}
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={stepData.competitorAnalysis || ''}
              onChange={(e) => handleInputChange('competitorAnalysis', e.target.value)}
              placeholder={tf('Bank checklist — competitors and how you win')}
            />
          </div>
        )}
        {!isLeanUnit && (
          <>
        <div>
          {renderLabel('demandSupplyGap', 'Demand-Supply Gap')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.demandSupplyGap || ''}
            onChange={(e) => handleInputChange('demandSupplyGap', e.target.value)}
            placeholder={tf("Describe demand-supply gap")}
          />
        </div>
        <div>
          {renderLabel('competitorAnalysis', 'Competitor Analysis')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.competitorAnalysis || ''}
            onChange={(e) => handleInputChange('competitorAnalysis', e.target.value)}
            placeholder={tf("Describe competitor analysis")}
          />
        </div>
        <div>
          {renderLabel('priceTrends', 'Price Trends')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.priceTrends || ''}
            onChange={(e) => handleInputChange('priceTrends', e.target.value)}
            placeholder={tf("Describe price trends")}
          />
        </div>
        <div>
          {renderLabel('exportPotential', 'Export Potential')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.exportPotential || ''}
            onChange={(e) => handleInputChange('exportPotential', e.target.value)}
            placeholder={tf("Describe export potential")}
          />
        </div>
          </>
        )}
      </div>
    );
  }

  // Step 7: Gap Analysis
  if (contentStep === 7) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div>
          {renderLabel('technologyGaps', 'Technology Gaps')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.technologyGaps || ''}
            onChange={(e) => handleInputChange('technologyGaps', e.target.value)}
            placeholder={tf("Describe technology gaps")}
          />
        </div>
        <div>
          {renderLabel('infrastructureGaps', 'Infrastructure Gaps')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.infrastructureGaps || ''}
            onChange={(e) => handleInputChange('infrastructureGaps', e.target.value)}
            placeholder={tf("Describe infrastructure gaps")}
          />
        </div>
        <div>
          {renderLabel('skillGaps', 'Skill Gaps')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.skillGaps || ''}
            onChange={(e) => handleInputChange('skillGaps', e.target.value)}
            placeholder={tf("Describe skill gaps")}
          />
        </div>
        <div>
          {renderLabel('marketingGaps', 'Marketing Gaps')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.marketingGaps || ''}
            onChange={(e) => handleInputChange('marketingGaps', e.target.value)}
            placeholder={tf("Describe marketing gaps")}
          />
        </div>
        <div>
          {renderLabel('financialGaps', 'Financial Gaps')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.financialGaps || ''}
            onChange={(e) => handleInputChange('financialGaps', e.target.value)}
            placeholder={tf("Describe financial gaps")}
          />
        </div>
        <div>
          {renderLabel('justificationForIntervention', 'Justification for Intervention')}
          <textarea
            className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.justificationForIntervention || ''}
            onChange={(e) => handleInputChange('justificationForIntervention', e.target.value)}
            placeholder={tf("Provide justification for intervention")}
          />
        </div>
      </div>
    );
  }

  // Step 8: SWOT Analysis
  if (contentStep === 8) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div>
          {renderLabel('strengths', 'Strengths')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={normalizeToString(stepData.strengths)}
            onChange={(e) => handleCommaSeparatedChange('strengths', e.target.value)}
            placeholder={tf("Enter strengths separated by commas (e.g., Strong market presence, Skilled workforce, Good infrastructure)")}
          />
          <p className="text-xs text-muted-foreground mt-1">{tf("Separate multiple strengths with commas")}</p>
        </div>
        <div>
          {renderLabel('weaknesses', 'Weaknesses')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={normalizeToString(stepData.weaknesses)}
            onChange={(e) => handleCommaSeparatedChange('weaknesses', e.target.value)}
            placeholder={tf("Enter weaknesses separated by commas (e.g., Limited technology, Lack of skilled workers, Poor infrastructure)")}
          />
          <p className="text-xs text-muted-foreground mt-1">{tf("Separate multiple weaknesses with commas")}</p>
        </div>
        <div>
          {renderLabel('opportunities', 'Opportunities')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={normalizeToString(stepData.opportunities)}
            onChange={(e) => handleCommaSeparatedChange('opportunities', e.target.value)}
            placeholder={tf("Enter opportunities separated by commas (e.g., Growing market demand, Government support, Export potential)")}
          />
          <p className="text-xs text-muted-foreground mt-1">{tf("Separate multiple opportunities with commas")}</p>
        </div>
        <div>
          {renderLabel('threats', 'Threats')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={normalizeToString(stepData.threats)}
            onChange={(e) => handleCommaSeparatedChange('threats', e.target.value)}
            placeholder={tf("Enter threats separated by commas (e.g., Market competition, Price fluctuations, Regulatory changes)")}
          />
          <p className="text-xs text-muted-foreground mt-1">{tf("Separate multiple threats with commas")}</p>
        </div>
      </div>
    );
  }

  // Step 9: Proposed Interventions
  if (contentStep === 9) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div>
          {renderLabel('interventionType', 'Intervention Type', true)}
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.interventionType || ''}
            onChange={(e) => handleInputChange('interventionType', e.target.value)}
          >
            <option value="">{tf("Select type")}</option>
            <option value="Hard">{tf("Hard")}</option>
            <option value="Soft">{tf("Soft")}</option>
            <option value="Both">{tf("Both")}</option>
          </select>
        </div>
        <div>
          {renderLabel('description', 'Description')}
          <textarea
            className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder={tf("Describe the intervention")}
          />
        </div>
        <div>
          {renderLabel('objectives', 'Objectives')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={normalizeToString(stepData.objectives)}
            onChange={(e) => handleCommaSeparatedChange('objectives', e.target.value)}
            placeholder={tf("Enter objectives separated by commas (e.g., Objective 1, Objective 2, Objective 3)")}
          />
          <p className="text-xs text-muted-foreground mt-1">{tf("Separate multiple objectives with commas")}</p>
        </div>
        <div>
          {renderLabel('expectedBenefits', 'Expected Benefits')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={normalizeToString(stepData.expectedBenefits)}
            onChange={(e) => handleCommaSeparatedChange('expectedBenefits', e.target.value)}
            placeholder={tf("Enter expected benefits separated by commas (e.g., Benefit 1, Benefit 2, Benefit 3)")}
          />
          <p className="text-xs text-muted-foreground mt-1">{tf("Separate multiple benefits with commas")}</p>
        </div>
      </div>
    );
  }

  // Step 10: Common Facility Centre (CFC) Details
  if (contentStep === 10) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {renderLabel(
              'name',
              isLeanUnit ? 'Shop / shed / workplace' : 'Unit / shed / workplace name',
              true
            )}
            <Input
              value={stepData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={
                isLeanUnit
                  ? tf('Shop or shed name / brief description')
                  : tf('Enter workplace or shed name')
              }
            />
          </div>
          {!isLeanUnit && (
          <div>
            {renderLabel('location', 'Location', true)}
            <Input
              value={stepData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder={tf("Enter location")}
            />
          </div>
          )}
        </div>
        <div>
          {renderLabel(
            'landDetails',
            isLeanUnit ? 'Premises note (own / lease / rent)' : 'Land Details'
          )}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.landDetails || ''}
            onChange={(e) => handleInputChange('landDetails', e.target.value)}
            placeholder={
              isLeanUnit
                ? tf('Own / lease / rent — how premises are held')
                : tf('Enter land details')
            }
          />
        </div>
        {isLeanUnit ? (
          <div className="space-y-4">
            {(isMudra ||
              isStandup ||
              isPmfme ||
              isSclcss ||
              isApTech ||
              isApEdp ||
              isVishwakarma ||
              isSvanidhi) && (
              <div>
                <label className="block text-sm font-medium mb-2">{tf('Premises — owned / rented')}</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={
                    isSvanidhi
                      ? extras.vendingType || extras.workplaceType || ''
                      : extras.workplaceType || extras.premisesType || ''
                  }
                  onChange={(e) =>
                    updateExtras(
                      isSvanidhi
                        ? { vendingType: e.target.value, workplaceType: e.target.value }
                        : isVishwakarma
                          ? { workplaceType: e.target.value }
                          : { premisesType: e.target.value }
                    )
                  }
                >
                  <option value="">{tf('Select')}</option>
                  {(isSvanidhi
                    ? SVANIDHI_VENDING_OPTIONS
                    : isVishwakarma
                    ? VISHWAKARMA_WORKPLACE_OPTIONS
                    : isApEdp
                    ? AP_EDP_PREMISES_OPTIONS
                    : isApTech
                    ? AP_TECH_PREMISES_OPTIONS
                    : isSclcss
                      ? SCLCSS_PREMISES_OPTIONS
                      : isPmfme
                        ? PMFME_PREMISES_OPTIONS
                        : isStandup
                          ? STANDUP_PREMISES_OPTIONS
                          : MUDRA_PREMISES_OPTIONS
                  ).map((o) => (
                    <option key={o.value} value={o.value}>
                      {tf(o.label)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">
                {tf('Power requirement (HP / kW) — optional')}
              </label>
              <Input
                value={extras.powerRequirement || stepData.powerRequirements || ''}
                onChange={(e) => {
                  if (
                    isPmegp ||
                    isPmegp2nd ||
                    isPmfme ||
                    isSclcss ||
                    isApTech ||
                    isApEdp ||
                    isVishwakarma ||
                    isSvanidhi
                  )
                    updateExtras({ powerRequirement: e.target.value });
                  handleInputChange('powerRequirements', e.target.value);
                }}
                placeholder={tf('e.g. 8 kW')}
              />
            </div>
          </div>
        ) : (
          <>
        <div>
          {renderLabel('civilWorks', 'Civil Works')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.civilWorks || ''}
            onChange={(e) => handleInputChange('civilWorks', e.target.value)}
            placeholder={tf("Describe civil works")}
          />
        </div>
        <div>
          {renderLabel('manufacturingProcess', 'Manufacturing Process')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.manufacturingProcess || ''}
            onChange={(e) => handleInputChange('manufacturingProcess', e.target.value)}
            placeholder={tf("Describe manufacturing process")}
          />
        </div>
        <div>
          {renderLabel('plantAndMachinery', 'Plant & Machinery')}
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={stepData.plantAndMachinery || ''}
            onChange={(e) => handleInputChange('plantAndMachinery', e.target.value)}
            placeholder={tf("Describe plant & machinery")}
          />
        </div>
        <div>
          {renderLabel('capacity', 'Capacity')}
          <Input
            value={stepData.capacity || ''}
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            placeholder={tf("Enter capacity")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            {renderLabel('powerRequirements', 'Power Requirements')}
            <Input
              value={stepData.powerRequirements || ''}
              onChange={(e) => handleInputChange('powerRequirements', e.target.value)}
              placeholder={tf("Enter power requirements")}
            />
          </div>
          <div>
            {renderLabel('waterRequirements', 'Water Requirements')}
            <Input
              value={stepData.waterRequirements || ''}
              onChange={(e) => handleInputChange('waterRequirements', e.target.value)}
              placeholder={tf("Enter water requirements")}
            />
          </div>
          <div>
            {renderLabel('manpowerRequirements', 'Manpower Requirements')}
            <Input
              value={stepData.manpowerRequirements || ''}
              onChange={(e) => handleInputChange('manpowerRequirements', e.target.value)}
              placeholder={tf("Enter manpower requirements")}
            />
          </div>
        </div>
          </>
        )}
      </div>
    );
  }

  // Step 11: SPV Details
  if (contentStep === 11) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {renderLabel(
              'spvName',
              isLeanUnit ? 'Firm / proprietor name' : 'Applicant / firm name',
              true
            )}
            <Input
              value={stepData.spvName || ''}
              onChange={(e) => handleInputChange('spvName', e.target.value)}
              placeholder={tf('Enter applicant or firm name')}
            />
          </div>
          <div>
            {renderLabel(
              'legalStatus',
              isLeanUnit ? 'Legal status (sole / partnership / company)' : 'Legal Status'
            )}
            <Input
              value={stepData.legalStatus || ''}
              onChange={(e) => handleInputChange('legalStatus', e.target.value)}
              placeholder={
                isLeanUnit
                  ? tf('Sole proprietorship / partnership / company')
                  : tf('Enter legal status')
              }
            />
          </div>
        </div>
        {isLeanUnit ? (
          <div>
            {renderLabel('address', 'Correspondence address')}
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={stepData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder={tf('Full correspondence address for KYC')}
            />
          </div>
        ) : (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {renderLabel('yearOfIncorporation', 'Year of establishment')}
            <Input
              type="number"
              value={stepData.yearOfIncorporation || ''}
              onChange={(e) => handleInputChange('yearOfIncorporation', parseInt(e.target.value) || 0)}
              placeholder={tf("YYYY")}
            />
          </div>
          <div>
            {renderLabel('submittedTo', 'Submitted To')}
            <Input
              value={stepData.submittedTo || ''}
              onChange={(e) => handleInputChange('submittedTo', e.target.value)}
              placeholder={tf("e.g., DIC, District")}
            />
          </div>
        </div>
        <div>
          {renderLabel('objectives', 'Objectives')}
          <div className="space-y-2">
            {(Array.isArray(stepData.objectives) ? stepData.objectives : []).map((objective: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={objective}
                  onChange={(e) => {
                    const updated = [...(stepData.objectives || [])];
                    updated[index] = e.target.value;
                    handleInputChange('objectives', updated);
                  }}
                  placeholder={tf("Enter objective")}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleArrayRemove('objectives', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd('objectives', '')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Objective
            </Button>
          </div>
        </div>
        <div>
          {renderLabel('boardOfDirectors', 'Owner(s)')}
          <textarea
            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={
              Array.isArray(stepData.boardOfDirectors)
                ? stepData.boardOfDirectors.map((d: any) => d?.name).filter(Boolean).join(', ')
                : (stepData.owners || '')
            }
            onChange={(e) => {
              const names = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
              const latest = getStepData(contentStep) || {};
              setStepData(contentStep, {
                ...latest,
                owners: e.target.value,
                boardOfDirectors: names.map((name) => ({ name, designation: 'Owner' })),
              });
            }}
            placeholder={tf("Owner names, separated by commas")}
          />
        </div>
          </>
        )}
      </div>
    );
  }

  // Step 12: Project Cost Details
  if (contentStep === 12) {
    const simpleCapex = hideComplexCapex(schemeCode, data.ventureMatchAnswers?.budget);
    const keepFci = schemeCode === 'AP_EDP';
    const showHeavy = keepFci || !simpleCapex;
    const totalCost = (stepData.land || 0) +
      (stepData.building || 0) +
      (stepData.machinery || 0) +
      (stepData.utilitiesAndInfrastructure || 0) +
      (stepData.preliminaryAndPreOperative || 0) +
      (stepData.workingCapitalMargin || 0);

    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        {simpleCapex && (
          <p className="text-sm text-muted-foreground">
            Heavy capex tables are hidden for Mudra Shishu / Kishore. Enter machinery and working-capital margin only.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showHeavy && (
            <>
              <div>
                {renderLabel(
                  'land',
                  isLeanUnit ? 'Land / building / workshed — land (₹ Lakhs)' : 'Land / FCI land (₹ Lakhs)'
                )}
                <Input
                  type="number"
                  value={stepData.land || ''}
                  onChange={(e) => handleInputChange('land', parseFloat(e.target.value) || 0)}
                  placeholder={tf("0")}
                />
              </div>
              <div>
                {renderLabel(
                  'building',
                  isLeanUnit ? 'Land / building / workshed — building (₹ Lakhs)' : 'Building / shed (₹ Lakhs)'
                )}
                <Input
                  type="number"
                  value={stepData.building || ''}
                  onChange={(e) => handleInputChange('building', parseFloat(e.target.value) || 0)}
                  placeholder={tf("0")}
                />
              </div>
            </>
          )}
          <div>
            {renderLabel('machinery', 'Plant & machinery (₹ Lakhs)')}
            <Input
              type="number"
              value={stepData.machinery || ''}
              onChange={(e) => handleInputChange('machinery', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          {showHeavy && (
            <>
              <div>
                {renderLabel(
                  'utilitiesAndInfrastructure',
                  isLeanUnit ? 'Furniture & fixtures (₹ Lakhs)' : 'Utilities & Infrastructure (₹ Lakhs)'
                )}
                <Input
                  type="number"
                  value={stepData.utilitiesAndInfrastructure || ''}
                  onChange={(e) =>
                    handleInputChange('utilitiesAndInfrastructure', parseFloat(e.target.value) || 0)
                  }
                  placeholder={tf("0")}
                />
              </div>
              <div>
                {renderLabel(
                  'preliminaryAndPreOperative',
                  isPmegp
                    ? 'Preliminary & pre-operative (₹ Lakhs)'
                    : 'Preliminary & Pre-operative (₹ Lakhs)'
                )}
                <Input
                  type="number"
                  value={stepData.preliminaryAndPreOperative || ''}
                  onChange={(e) =>
                    handleInputChange('preliminaryAndPreOperative', parseFloat(e.target.value) || 0)
                  }
                  placeholder={tf("0")}
                />
              </div>
            </>
          )}
          <div>
            {renderLabel(
              'workingCapitalMargin',
              isLeanUnit ? 'Working capital (₹ Lakhs)' : 'Working Capital Margin (₹ Lakhs)'
            )}
            <Input
              type="number"
              value={stepData.workingCapitalMargin || ''}
              onChange={(e) => handleInputChange('workingCapitalMargin', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{tf("Total Project Cost")}</span>
              <span className="text-2xl font-bold text-primary">₹ {totalCost.toLocaleString('en-IN')} {tf("Lakhs")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 13: Means of Finance
  if (contentStep === 13) {
    const total = (stepData.spvContribution || 0) +
      (stepData.governmentGrant || 0) +
      (stepData.bankLoan || 0) +
      (stepData.otherSources || 0);

    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {renderLabel(
              'spvContribution',
              isPmegp
                ? 'Own contribution (₹ Lakhs) — typically 10% general / 5% special'
                : isPmegp2nd
                  ? 'Own contribution (₹ Lakhs) — 10% for all categories'
                  : isMudra ||
                      isStandup ||
                      isPmfme ||
                      isSclcss ||
                      isApTech ||
                      isApEdp ||
                      isVishwakarma ||
                      isSvanidhi
                    ? 'Own contribution (₹ Lakhs)'
                    : 'Promoter contribution / equity (₹ Lakhs)'
            )}
            <Input
              type="number"
              value={stepData.spvContribution || ''}
              onChange={(e) => handleInputChange('spvContribution', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          <div>
            {renderLabel(
              'governmentGrant',
              isPmegp
                ? 'PMEGP margin money / subsidy (₹ Lakhs)'
                : isPmegp2nd
                  ? 'PMEGP 2nd-loan margin money (₹ Lakhs) — 15% / 20% NER-Hill'
                  : isMudra
                    ? 'Government grant (₹ Lakhs) — usually 0 for MUDRA'
                    : isStandup
                      ? 'Other subsidy / grant if converging (₹ Lakhs) — else 0'
                      : isPmfme
                        ? 'PMFME capital grant (₹ Lakhs) — 35%, cap ₹10 L'
                        : isSclcss
                          ? 'SCLCSS capital subsidy (₹ Lakhs) — 25%, cap ₹25 L'
                          : isApTech
                            ? 'AP tech-upgrade subsidy (₹ Lakhs) — % of FCI by size'
                            : isApEdp
                              ? 'AP EDP capital subsidy (₹ Lakhs) — % of FCI by size'
                              : isVishwakarma
                                ? 'Toolkit e-voucher (₹ Lakhs) — usually 0.15'
                                : isSvanidhi || isEclgs
                                  ? 'Government grant (₹ Lakhs) — usually 0 (guarantee ≠ capital)'
                                  : 'Government Grant (₹ Lakhs)'
            )}
            <Input
              type="number"
              value={stepData.governmentGrant || ''}
              onChange={(e) => handleInputChange('governmentGrant', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          <div>
            {renderLabel(
              'bankLoan',
              isPmegp || isPmegp2nd || isMudra || isPmfme
                ? 'Bank term loan + / or WC (₹ Lakhs)'
                : isStandup
                  ? 'Bank composite loan TL + WC (₹ Lakhs)'
                  : isSclcss || isApTech || isApEdp
                    ? 'Bank term loan for P&M (₹ Lakhs)'
                    : isVishwakarma
                      ? 'Enterprise development loan tranche (₹ Lakhs)'
                      : isSvanidhi
                        ? 'WC term loan tranche (₹ Lakhs)'
                        : isEclgs
                          ? 'ECLGS working-capital term loan (₹ Lakhs)'
                          : 'Bank Loan (₹ Lakhs)'
            )}
            <Input
              type="number"
              value={stepData.bankLoan || ''}
              onChange={(e) => handleInputChange('bankLoan', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          <div>
            {renderLabel('otherSources', 'Other Sources (₹ Lakhs)')}
            <Input
              type="number"
              value={stepData.otherSources || ''}
              onChange={(e) => handleInputChange('otherSources', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
        </div>
        {isPmegp && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'Own + margin money + bank (+ other) must equal total project cost. Indicative subsidy'
            )}
            : {pmegpSubsidyPercent(extras.pmegpCategory, extras.pmegpArea)}% (
            {extras.pmegpCategory || '—'} / {extras.pmegpArea || '—'}).
          </p>
        )}
        {isPmegp2nd && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'Upgrade MoF: own 10% + uniform MM 15% (20% NER/Hill) + bank. Not first-PMEGP category rates. Indicative MM'
            )}{' '}
            ≈ ₹
            {pmegp2ndIndicativeMmLakhs(
              (getStepData(12)?.land || 0) +
                (getStepData(12)?.building || 0) +
                (getStepData(12)?.machinery || 0) +
                (getStepData(12)?.utilitiesAndInfrastructure || 0) +
                (getStepData(12)?.preliminaryAndPreOperative || 0) +
                (getStepData(12)?.workingCapitalMargin || 0),
              extras.sectorBand,
              extras.nerHill
            ).toLocaleString('en-IN')}{' '}
            {tf('Lakhs')} · {extras.priorScheme || '—'} / {extras.sectorBand || '—'}.
          </p>
        )}
        {isMudra && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'MUDRA is not a subsidy scheme. Own + bank (+ other) should equal total project cost. Category'
            )}
            : {extras.mudraCategory || '—'}.
          </p>
        )}
        {isStandup && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'Own contribution must be at least 10% of project cost. Own + bank (+ grant/other) = total. Category'
            )}
            : {extras.standupCategory || '—'} · {tf('Min own')} {STANDUP_MIN_OWN_PERCENT}%.
          </p>
        )}
        {isPmfme && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf('Credit-linked grant')} {PMFME_SUBSIDY_PERCENT}% {tf('capped at')} ₹
            {PMFME_SUBSIDY_CAP_LAKHS} {tf('L')}. {tf('Min own')} {PMFME_MIN_OWN_PERCENT}%.{' '}
            {tf('Indicative grant for current project cost fields')} ≈ ₹
            {pmfmeIndicativeGrantLakhs(
              (getStepData(12)?.land || 0) +
                (getStepData(12)?.building || 0) +
                (getStepData(12)?.machinery || 0) +
                (getStepData(12)?.utilitiesAndInfrastructure || 0) +
                (getStepData(12)?.preliminaryAndPreOperative || 0) +
                (getStepData(12)?.workingCapitalMargin || 0)
            ).toLocaleString('en-IN')}{' '}
            {tf('Lakhs')} · {extras.unitStage || '—'} / ODOP {extras.odopAligned || '—'}.
          </p>
        )}
        {isSclcss && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'SCLCSS is 25% capital subsidy on eligible new P&M (cap ₹25 L), not PMEGP margin money. Indicative on machinery field'
            )}{' '}
            ≈ ₹
            {sclcssIndicativeGrantLakhs(getStepData(12)?.machinery || 0).toLocaleString('en-IN')}{' '}
            {tf('Lakhs')} · {extras.sclcssCategory || '—'} / stake {extras.controllingStakePercent || '—'}%.
          </p>
        )}
        {isApTech && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'AP tech-upgrade subsidy on upgrade FCI — mutually exclusive with new-unit EDP capital subsidy; total incentives ≤ 75% FCI. Indicative'
            )}{' '}
            ≈ ₹
            {apTechIndicativeGrantLakhs(
              (getStepData(12)?.land || 0) +
                (getStepData(12)?.building || 0) +
                (getStepData(12)?.machinery || 0) +
                (getStepData(12)?.utilitiesAndInfrastructure || 0) +
                (getStepData(12)?.preliminaryAndPreOperative || 0) +
                (getStepData(12)?.workingCapitalMargin || 0),
              extras.enterpriseSize,
              extras.specialCategory
            ).toLocaleString('en-IN')}{' '}
            {tf('Lakhs')} (
            {apTechSubsidyPercent(extras.enterpriseSize, extras.specialCategory)}% / {tf('cap')} ₹
            {apTechSubsidyCapLakhs(extras.enterpriseSize, extras.specialCategory).toLocaleString(
              'en-IN'
            )}{' '}
            {tf('L')}).
          </p>
        )}
        {isApEdp && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'AP EDP capital subsidy on new-unit FCI — mutually exclusive with tech-upgrade; total incentives ≤ 75% FCI. Indicative'
            )}{' '}
            ≈ ₹
            {apEdpIndicativeGrantLakhs(
              (getStepData(12)?.land || 0) +
                (getStepData(12)?.building || 0) +
                (getStepData(12)?.machinery || 0) +
                (getStepData(12)?.utilitiesAndInfrastructure || 0) +
                (getStepData(12)?.preliminaryAndPreOperative || 0) +
                (getStepData(12)?.workingCapitalMargin || 0),
              extras.enterpriseSize,
              extras.specialCategory
            ).toLocaleString('en-IN')}{' '}
            {tf('Lakhs')} (
            {apEdpSubsidyPercent(extras.enterpriseSize, extras.specialCategory)}% / {tf('cap')} ₹
            {apEdpSubsidyCapLakhs(extras.enterpriseSize, extras.specialCategory).toLocaleString(
              'en-IN'
            )}{' '}
            {tf('L')})
            {apEdpLandRebateEligible(
              extras.apiicPark,
              extras.scStOwned,
              extras.enterpriseSize
            )
              ? ` · ${tf('APIIC land rebate')} ≈ ₹${apEdpIndicativeLandRebateLakhs(
                  getStepData(12)?.land || 0,
                  extras.apiicPark,
                  extras.scStOwned,
                  extras.enterpriseSize
                ).toLocaleString('en-IN')} ${tf('L')}.`
              : '.'}
          </p>
        )}
        {isVishwakarma && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'Own + toolkit voucher (usually 0.15 L) + enterprise loan tranche (+ other) = total. Interest'
            )}{' '}
            {VISHWAKARMA_INTEREST_PERCENT}% · {tf('tranche cap')} ₹
            {vishwakarmaTrancheCapLakhs(extras.loanTranche).toLocaleString('en-IN')} {tf('L')} ·{' '}
            {extras.craft || '—'} / {extras.loanTranche || '—'}.
          </p>
        )}
        {isSvanidhi && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'Own + bank WC tranche (+ other) = total. Cap'
            )}{' '}
            ₹
            {Math.round(svanidhiTrancheCapLakhs(extras.loanTranche) * 100000).toLocaleString(
              'en-IN'
            )}{' '}
            · {svanidhiTrancheTenorMonths(extras.loanTranche)} {tf('months')} ·{' '}
            {SVANIDHI_INTEREST_SUBSIDY_PERCENT}% {tf('interest subsidy (quarterly, not capital grant)')}{' '}
            · {extras.covOrLor || '—'} / {extras.loanTranche || '—'}.
          </p>
        )}
        {isEclgs && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'ECLGS is a guaranteed WCTL — governmentGrant usually 0. Bank loan ≈ additional WC sought. Indicative 20% of peak'
            )}{' '}
            ≈ ₹{eclgsIndicativeQuantumLakhs(extras.peakWcOutstanding).toLocaleString('en-IN')}{' '}
            {tf('L')} · sought {extras.additionalWcSought || '—'} · ROI cap {ECLGS_INTEREST_CAP_PERCENT}%.
          </p>
        )}
        {isCgtmse && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'CGTMSE is a bank-side guarantee (MUDRA-adjacent) — governmentGrant usually 0. Own + bank = project cost. Women-owned may get higher cover %.'
            )}{' '}
            · {extras.loanPurpose || '—'} · {extras.womenOwned === 'yes' ? tf('women-owned') : tf('general')} ·{' '}
            {tf('proposed')} {extras.proposedLimit || '—'} {tf('L')}.
          </p>
        )}
        {isEpmNiryat && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'EPM Niryat is 2.75% interest subvention on eligible export credit — not a capital grant. Keep governmentGrant at 0; bank loan ≈ export credit sought.'
            )}{' '}
            · {extras.prePostShipment || '—'} · {extras.exportCreditSought || '—'} {tf('L')}.
          </p>
        )}
        {isMseSpice && (
          <p className="text-sm text-muted-foreground border rounded-md px-3 py-2 bg-muted/40">
            {tf(
              'MSE-SPICE: governmentGrant ≈ 25% of new P&M (cap ₹12.5 L). Second-hand machinery ineligible. Brownfield only.'
            )}{' '}
            · {extras.circularSector || '—'} · P&M {extras.proposedPmCost || '—'} {tf('L')}.
          </p>
        )}
        <div className="border-t pt-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{tf("Total Finance")}</span>
              <span className="text-2xl font-bold text-primary">₹ {total.toLocaleString('en-IN')} {tf("Lakhs")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 14: Operating Cost & Revenue
  if (contentStep === 14) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {renderLabel('rawMaterialCost', 'Raw Material Cost (₹ Lakhs)')}
            <Input
              type="number"
              value={stepData.rawMaterialCost || ''}
              onChange={(e) => handleInputChange('rawMaterialCost', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          <div>
            {renderLabel('powerCost', 'Power Cost (₹ Lakhs)')}
            <Input
              type="number"
              value={stepData.powerCost || ''}
              onChange={(e) => handleInputChange('powerCost', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          <div>
            {renderLabel('wages', 'Wages (₹ Lakhs)')}
            <Input
              type="number"
              value={stepData.wages || ''}
              onChange={(e) => handleInputChange('wages', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          <div>
            {renderLabel('maintenance', 'Maintenance (₹ Lakhs)')}
            <Input
              type="number"
              value={stepData.maintenance || ''}
              onChange={(e) => handleInputChange('maintenance', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          <div>
            {renderLabel('administrativeExpenses', 'Administrative Expenses (₹ Lakhs)')}
            <Input
              type="number"
              value={stepData.administrativeExpenses || ''}
              onChange={(e) => handleInputChange('administrativeExpenses', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          <div>
            {renderLabel('marketingExpenses', 'Marketing Expenses (₹ Lakhs)')}
            <Input
              type="number"
              value={stepData.marketingExpenses || ''}
              onChange={(e) => handleInputChange('marketingExpenses', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          <div>
            {renderLabel('annualProductionVolume', 'Annual Production Volume')}
            <Input
              type="number"
              value={stepData.annualProductionVolume || ''}
              onChange={(e) => handleInputChange('annualProductionVolume', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
          <div>
            {renderLabel('annualSalesRealization', 'Annual Sales Realization (₹ Lakhs)')}
            <Input
              type="number"
              value={stepData.annualSalesRealization || ''}
              onChange={(e) => handleInputChange('annualSalesRealization', parseFloat(e.target.value) || 0)}
              placeholder={tf("0")}
            />
          </div>
        </div>
      </div>
    );
  }

  // Step 15: Financial Viability
  if (contentStep === 15) {
    const step12 = data.step12 || {};
    const step13 = data.step13 || {};
    const step14 = data.step14 || {};
    const cost = (step12.land || 0) + (step12.building || 0) + (step12.machinery || 0) +
      (step12.utilitiesAndInfrastructure || 0) + (step12.preliminaryAndPreOperative || 0) +
      (step12.workingCapitalMargin || 0);
    const finance = (step13.spvContribution || 0) + (step13.governmentGrant || 0) +
      (step13.bankLoan || 0) + (step13.otherSources || 0);
    const loan = step13.bankLoan || 0;
    const years = stepData.yearProjections?.length
      ? stepData.yearProjections
      : [1, 2, 3, 4, 5].map((year) => ({
          year,
          sales: year === 1 ? (step14.annualSalesRealization || 0) : 0,
          rm: year === 1 ? (step14.rawMaterialCost || 0) : 0,
          wages: year === 1 ? (step14.wages || 0) : 0,
          power: year === 1 ? (step14.powerCost || 0) : 0,
          netProfit: 0,
        }));
    const updateYear = (index: number, field: string, value: number) => {
      const next = years.map((row: any, i: number) => (i === index ? { ...row, [field]: value } : row));
      handleInputChange('yearProjections', next);
    };
    const annualEmi = loan > 0
      ? (loan * 0.12 * Math.pow(1.12, 7)) / (Math.pow(1.12, 7) - 1)
      : 0;
    const dep = ((step12.machinery || 0) + (step12.building || 0)) * 0.1;
    const dscrs = years.map((row: any) => {
      const np = row.netProfit || 0;
      return annualEmi > 0 ? (np + dep) / annualEmi : 0;
    });
    const avgDscr = dscrs.length ? dscrs.reduce((a: number, b: number) => a + b, 0) / dscrs.length : 0;
    const turnover = extras.projectedTurnover || step14.annualSalesRealization || 0;
    const nayak = nayakWorkingCapital(turnover);
    const mudraSimple = isMudraShishuKishore(schemeCode, data.ventureMatchAnswers?.budget);

    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Project cost</p>
            <p className="text-xl font-semibold">₹ {cost.toLocaleString('en-IN')} Lakhs</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Equity + loan + other</p>
            <p className="text-xl font-semibold">₹ {finance.toLocaleString('en-IN')} Lakhs</p>
          </div>
        </div>
        {mudraSimple && (
          <div className="border rounded-lg p-4 space-y-3">
            <h4 className="font-semibold">{tf("Mudra Nayak working capital")}</h4>
            <label className="block text-sm font-medium">Projected annual turnover (₹ Lakhs)</label>
            <Input
              type="number"
              value={turnover || ''}
              onChange={(e) => updateExtras({ projectedTurnover: parseFloat(e.target.value) || 0 })}
            />
            <p className="text-sm">WC limit (20%): <strong>₹ {nayak.limit.toFixed(2)} Lakhs</strong></p>
            <p className="text-sm">Promoter margin (5% of WC): <strong>₹ {nayak.margin.toFixed(2)} Lakhs</strong></p>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Year</th>
                <th className="p-2">Sales</th>
                <th className="p-2">RM</th>
                <th className="p-2">Wages</th>
                <th className="p-2">Power</th>
                <th className="p-2">Net profit</th>
              </tr>
            </thead>
            <tbody>
              {years.map((row: any, index: number) => (
                <tr key={row.year} className="border-t">
                  <td className="p-2">{row.year}</td>
                  {['sales', 'rm', 'wages', 'power', 'netProfit'].map((field) => (
                    <td key={field} className="p-1">
                      <Input
                        type="number"
                        value={row[field] || ''}
                        onChange={(e) => updateYear(index, field, parseFloat(e.target.value) || 0)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {renderLabel('breakEvenPoint', 'Break-even (capacity %)')}
          <Input
            type="number"
            value={stepData.breakEvenPoint || ''}
            onChange={(e) => handleInputChange('breakEvenPoint', parseFloat(e.target.value) || 0)}
            placeholder={tf("e.g. 55")}
          />
        </div>
        {showDscr(loan) && (
          <div className={`p-4 rounded-lg border ${avgDscr < 1.5 ? 'border-amber-400 bg-amber-50' : 'border-border'}`}>
            <p className="font-semibold">{tf("DSCR (profit + depreciation vs EMI)")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Assumed 7-year term at 12%. Average DSCR: <strong>{avgDscr.toFixed(2)}</strong>
              {avgDscr < 1.5 ? ' — below 1.5; lenders may query this.' : ''}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Step 16: Implementation
  if (contentStep === 16) {
    const milestoneRows = normalizeMilestones(stepData.milestones).length
      ? normalizeMilestones(stepData.milestones)
      : [
          { activity: 'Machinery order / installation', timeRequired: '', startDate: '', endDate: '' },
          { activity: 'Power connection', timeRequired: '', startDate: '', endDate: '' },
          { activity: 'Trial run', timeRequired: '', startDate: '', endDate: '' },
        ];

    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div>
          {renderLabel('startDate', 'Commercial production date (CoD)')}
          <Input
            type="date"
            value={toDateInputValue(stepData.startDate)}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
          />
        </div>
        <div>
          {renderLabel('milestones', 'Milestones')}
          <div className="space-y-4">
            {milestoneRows.map((milestone: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <Input
                  value={milestone.activity || ''}
                  onChange={(e) => {
                    const next = milestoneRows.map((m: any, i: number) =>
                      i === index ? { ...m, activity: e.target.value } : m
                    );
                    handleInputChange('milestones', next);
                  }}
                  placeholder={tf("Activity")}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={toDateInputValue(milestone.startDate)}
                    onChange={(e) => {
                      const next = milestoneRows.map((m: any, i: number) =>
                        i === index ? { ...m, startDate: e.target.value } : m
                      );
                      handleInputChange('milestones', next);
                    }}
                  />
                  <Input
                    type="date"
                    value={toDateInputValue(milestone.endDate)}
                    onChange={(e) => {
                      const next = milestoneRows.map((m: any, i: number) =>
                        i === index ? { ...m, endDate: e.target.value } : m
                      );
                      handleInputChange('milestones', next);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 17: Expected impact
  if (contentStep === 17) {
    return (
      <div className="space-y-6">
        <AISuggestions
          {...aiStore}
          excludeFields={aiExclude}
          currentStep={contentStep}
          currentStepData={stepData}
          onApplySuggestion={(field, content) => {
            handleInputChange(field, content);
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {renderLabel('employmentGeneration', 'Direct employment (count)')}
            <Input
              type="number"
              value={stepData.employmentGeneration || extras.directEmployment || ''}
              onChange={(e) => {
                const v = parseInt(e.target.value) || 0;
                handleInputChange('employmentGeneration', v);
                if (isPmegp || isPmegp2nd || isPmfme) updateExtras({ directEmployment: String(v) });
              }}
            />
          </div>
          <div>
            {isPmegp || isPmegp2nd || isPmfme ? (
              <>
                <label className="block text-sm font-medium mb-2">{tf('Indirect employment (count)')}</label>
                <Input
                  type="number"
                  value={extras.indirectEmployment || ''}
                  onChange={(e) => updateExtras({ indirectEmployment: e.target.value })}
                />
              </>
            ) : (
              <>
                {renderLabel('turnoverGrowth', 'Expected annual turnover (₹ Lakhs)')}
                <Input
                  type="number"
                  value={stepData.turnoverGrowth || ''}
                  onChange={(e) => handleInputChange('turnoverGrowth', parseFloat(e.target.value) || 0)}
                />
              </>
            )}
          </div>
        </div>
        {(isPmegp || isPmegp2nd || isPmfme) && (
          <div>
            <label className="block text-sm font-medium mb-2">{tf('Short impact note (optional)')}</label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={extras.impactNote || stepData.impactNote || ''}
              onChange={(e) => {
                updateExtras({ impactNote: e.target.value });
                handleInputChange('impactNote', e.target.value);
              }}
              placeholder={
                isPmegp2nd
                  ? tf('Modernisation / turnover growth from upgrade — short note')
                  : isPmfme
                    ? tf('Formalisation / local offtake / farmer linkage — short note')
                    : tf('Keep light — employment / local benefit in one short note')
              }
            />
          </div>
        )}
      </div>
    );
  }

  // Step 18: Uploads
  if (contentStep === 18) {
    const handleFileChange = async (field: string, file: File | null) => {
      if (file) {
        setUploadingFiles((prev) => ({ ...prev, [field]: true }));
        try {
          const uploadResult = await individualDprApi.uploadDocument(file);
          if (uploadResult.success && uploadResult.data?.documentUrl) {
            handleInputChange(field, uploadResult.data.documentUrl);
            toast.success(`${file.name} uploaded successfully!`);
          } else {
            toast.error(uploadResult.message || 'Failed to upload document');
            handleInputChange(field, file.name);
          }
        } catch (error: any) {
          toast.error(error.message || 'Failed to upload document');
          handleInputChange(field, file.name);
        } finally {
          setUploadingFiles((prev) => ({ ...prev, [field]: false }));
        }
      }
    };

    const getDisplayName = (urlOrName: string): string => {
      if (urlOrName.startsWith('http://') || urlOrName.startsWith('https://')) {
        const urlParts = urlOrName.split('/');
        return urlParts[urlParts.length - 1] || urlOrName;
      }
      return urlOrName;
    };

    const step12 = data.step12 || {};
    const totalCost = (step12.land || 0) + (step12.building || 0) + (step12.machinery || 0) +
      (step12.utilitiesAndInfrastructure || 0) + (step12.preliminaryAndPreOperative || 0) +
      (step12.workingCapitalMargin || 0);
    const uploads = getStep18Uploads(schemeCode, data.ventureMatchAnswers, extras);
    const needEdu = showPmegpEducationGate(schemeCode, data.ventureMatchAnswers?.activity, totalCost);

    return (
      <div className="space-y-6">
        {uploads.map((item) => (
          <div key={item.id}>
            {renderLabel(item.id, item.label)}
            <div className="relative">
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(item.id, e.target.files?.[0] || null)}
                disabled={uploadingFiles[item.id]}
              />
              {uploadingFiles[item.id] && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}
            </div>
            {stepData[item.id] && (
              <p className="text-sm text-green-600 mt-1">✓ {tf("Uploaded")}: {getDisplayName(stepData[item.id])}</p>
            )}
          </div>
        ))}
        {needEdu && (
          <div>
            {renderLabel('educationCertificate', '8th-pass / education certificate')}
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange('educationCertificate', e.target.files?.[0] || null)}
            />
            {stepData.educationCertificate && (
              <p className="text-sm text-green-600 mt-1">✓ {tf("Uploaded")}: {getDisplayName(stepData.educationCertificate)}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Step {currentStep} form implementation in progress. Please check back soon.
      </p>
    </div>
  );
};
