/**
 * Scheme Q&A document for Create New Latest DPR.
 * Used by PDF / DOCX / XLS downloads and quality analysis so they match
 * IndividualDPRDocumentView — not the cluster chapter template.
 */

import fs from 'fs';
import path from 'path';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, HeadingLevel, AlignmentType } from 'docx';
import catalogs from './individualDprCatalog.json';

export type SchemeStepDef = {
  n: number;
  id: string;
  title: string;
  contentStep: number;
};

export type DocField = {
  name: string;
  label: string;
  source: 'step' | 'extras';
  path: string;
};

export type DocRow = { label: string; value: string; path: string; filled: boolean };

export type DocSection = {
  n: number;
  id: string;
  title: string;
  contentStep: number;
  rows: DocRow[];
};

export type IndividualDocument = {
  schemeCode: string | null;
  unitName: string;
  district: string;
  location: string;
  entrepreneurName: string;
  actionLine: string;
  underLine: string;
  sections: DocSection[];
  askedCount: number;
  filledCount: number;
};

const LEAN_UNIT_CODES = new Set([
  'PMEGP', 'PMEGP_2ND', 'MUDRA', 'STANDUP', 'PMFME', 'SCLCSS', 'AP_TECH_UPGRADE',
  'AP_EDP', 'VISHWAKARMA', 'SVANIDHI', 'ECLGS', 'ZED', 'LEAN', 'MSME_IPR', 'PMS',
  'SCST_HUB', 'ASPIRE', 'NHDP', 'CVY', 'MSE_GIFT', 'PTUAS', 'PMPDS', 'CGTMSE',
  'AP_FPP', 'AP_CMEP', 'OBMMS', 'MSE_SPICE', 'AP_PARKS', 'RAMP_TEAM', 'EPM_NIRYAT',
]);

const HIDE_COMPLEX_CAPEX = new Set([
  'VISHWAKARMA', 'SVANIDHI', 'ECLGS', 'NHDP', 'ASPIRE', 'ZED', 'LEAN', 'MSME_IPR',
  'PMS', 'SCST_HUB', 'PMPDS', 'RAMP_TEAM', 'EPM_NIRYAT', 'OBMMS',
]);

const UPGRADE_SCHEMES = new Set([
  'PMEGP_2ND', 'SCLCSS', 'AP_TECH_UPGRADE', 'MSE_GIFT', 'PTUAS', 'MSE_SPICE',
]);

const SCHEME_LABELS: Record<string, string> = {
  PMEGP: 'PMEGP',
  PMEGP_2ND: '2nd PMEGP Upgrade Loan',
  MUDRA: 'PM MUDRA Yojana',
  STANDUP: 'Stand-Up India',
  CGTMSE: 'CGTMSE',
  VISHWAKARMA: 'PM Vishwakarma',
  PMFME: 'PMFME',
  SVANIDHI: 'PM SVANidhi',
  SCLCSS: 'SCLCSS (SC/ST)',
  AP_TECH_UPGRADE: 'AP Technology Upgradation Subsidy',
  AP_EDP: 'AP MSME-EDP 4.0',
  AP_CMEP: 'AP CMEP',
  AP_FPP: 'AP Food Processing Policy 4.0',
  ECLGS: 'ECLGS',
  ZED: 'ZED Certification',
  LEAN: 'Competitive LEAN',
  MSME_IPR: 'MSME Innovative (IPR)',
  PMS: 'Procurement & Marketing Scheme',
  MSE_GIFT: 'MSE-GIFT',
  CVY: 'Coir Vikas Yojana',
  NHDP: 'National Handloom Development Programme',
  PTUAS: 'PTUAS',
  PMPDS: 'PMPDS',
  MSE_SPICE: 'RAMP MSE-SPICE',
  RAMP_TEAM: 'RAMP TEAM (ONDC)',
  EPM_NIRYAT: 'EPM Niryat Protsahan',
  ASPIRE: 'ASPIRE',
  SCST_HUB: 'National SC/ST Hub',
  OBMMS: 'AP OBMMS Welfare Loans',
  AP_PARKS: 'AP MSME-PARKS',
};

const SCHEME_EXTRA_FIELDS: Record<string, string[]> = {
  VISHWAKARMA: ['craft', 'currentTools', 'newTools', 'entrepreneurName', 'entrepreneurAge', 'experienceYears', 'trainingStage', 'loanTranche', 'priorSelfEmploymentLoan', 'processOfManufacture', 'workplaceType', 'powerRequirement'],
  SVANIDHI: ['covOrLor', 'upiQr', 'entrepreneurName', 'entrepreneurAge', 'yearsVending', 'loanTranche', 'vendingType', 'dailySales', 'processOfManufacture', 'workplaceType', 'powerRequirement'],
  PMFME: ['fssai', 'unitStage', 'odopAligned', 'entrepreneurName', 'entrepreneurAge', 'existingTurnover', 'processOfManufacture', 'installedCapacity', 'capacityUtilisationY1', 'proposedWorkers', 'rawMaterialSources', 'premisesType', 'powerRequirement', 'directEmployment', 'indirectEmployment', 'impactNote'],
  AP_EDP: ['enterpriseSize', 'specialCategory', 'scStOwned', 'apDomicile', 'apiicPark', 'entrepreneurName', 'entrepreneurAge', 'processOfManufacture', 'installedCapacity', 'capacityUtilisationY1', 'premisesType', 'powerRequirement'],
  PMEGP: ['pmegpCategory', 'pmegpArea', 'pmegpAgency', 'entrepreneurName', 'entrepreneurAge', 'educationStatus', 'processOfManufacture', 'installedCapacity', 'capacityUtilisationY1', 'powerRequirement', 'pmegpSubsidyPercent', 'pmegpOwnPercent', 'directEmployment', 'indirectEmployment', 'impactNote'],
  MUDRA: ['mudraCategory', 'entrepreneurName', 'entrepreneurAge', 'experienceYears', 'premisesType', 'loanPurpose'],
  STANDUP: ['standupCategory', 'entrepreneurName', 'entrepreneurAge', 'controllingStakePercent', 'loanAmountSought', 'processOfManufacture', 'installedCapacity', 'capacityUtilisationY1', 'premisesType'],
  PMEGP_2ND: ['priorScheme', 'priorSanctionAmount', 'firstSubsidyYear', 'marginMoneyAdjusted', 'firstLoanRepaid', 'yearsProfitable', 'existingTurnover', 'pmegpAgency', 'nerHill', 'sectorBand', 'entrepreneurName', 'entrepreneurAge', 'processOfManufacture', 'existingCapacity', 'installedCapacity', 'capacityUtilisationY1', 'powerRequirement', 'existingTech', 'proposedTech', 'directEmployment', 'indirectEmployment', 'impactNote'],
  SCLCSS: ['sclcssCategory', 'controllingStakePercent', 'unitStage', 'entrepreneurName', 'entrepreneurAge', 'udyamStatus', 'existingTech', 'proposedTech', 'processOfManufacture', 'installedCapacity', 'capacityUtilisationY1', 'premisesType', 'powerRequirement'],
  AP_TECH_UPGRADE: ['enterpriseSize', 'specialCategory', 'apDomicile', 'entrepreneurName', 'entrepreneurAge', 'yearsInOperation', 'existingTurnover', 'existingTech', 'proposedTech', 'processOfManufacture', 'productivityGain', 'existingCapacity', 'installedCapacity', 'capacityUtilisationY1', 'premisesType', 'powerRequirement'],
  MSE_GIFT: ['energyBaselineKwh', 'expectedSaving', 'entrepreneurName', 'eeEquipment'],
  ZED: ['zedCurrentLevel', 'zedTargetLevel', 'entrepreneurName', 'qualityFocus'],
  LEAN: ['processBottleneck', 'entrepreneurName', 'shopFloorSize', 'expectedLeanGain'],
  MSME_IPR: ['ipType', 'filingStage', 'entrepreneurName', 'inventionTitle'],
  PMS: ['eventName', 'stallSize', 'entrepreneurName', 'fairCity', 'estimatedFairCost'],
  CVY: ['coirProductLine', 'coirBoardStatus', 'entrepreneurName', 'premisesType'],
  NHDP: ['loomType', 'weaverId', 'entrepreneurName', 'entrepreneurAge', 'yarnSource', 'productLine', 'premisesType'],
  PTUAS: ['gmpStatus', 'productLicence', 'entrepreneurName', 'existingTech', 'proposedTech', 'processOfManufacture'],
  PMPDS: ['deviceOrFormulation', 'entrepreneurName', 'promotionNeed'],
  SCST_HUB: ['gemExperience', 'entrepreneurName', 'sclcssCategory', 'procurementFocus'],
  ASPIRE: ['incubatorName', 'entrepreneurName', 'entrepreneurAge', 'innovationBrief', 'livelihoodFocus', 'premisesType'],
  ECLGS: ['existingLimit', 'peakWcOutstanding', 'additionalWcSought', 'accountStatus', 'entrepreneurName', 'liquidityReason'],
  CGTMSE: ['loanPurpose', 'womenOwned', 'entrepreneurName', 'proposedLimit'],
  AP_FPP: ['enterpriseSize', 'specialCategory', 'apDomicile', 'fpoShg', 'entrepreneurName', 'processOfManufacture', 'installedCapacity', 'premisesType'],
  AP_CMEP: ['activityBand', 'boosterCategory', 'apDomicile', 'entrepreneurName', 'processOfManufacture', 'premisesType'],
  OBMMS: ['welfareCorporation', 'whiteRiceCard', 'entrepreneurName', 'entrepreneurAge', 'activityTrade'],
  MSE_SPICE: ['circularSector', 'existingUnitYears', 'entrepreneurName', 'proposedPmCost', 'processOfManufacture'],
  AP_PARKS: ['apiicParkName', 'plotArea', 'landRebateClaim', 'scStOrWomen', 'entrepreneurName', 'apDomicile'],
  RAMP_TEAM: ['ondcReady', 'catalogueSkus', 'entrepreneurName', 'productListNote'],
  EPM_NIRYAT: ['exportMarkets', 'hsnLines', 'prePostShipment', 'entrepreneurName', 'exportCreditSought'],
};

const EXTRA_FIELD_LABELS: Record<string, string> = {
  entrepreneurName: 'Entrepreneur name',
  entrepreneurAge: 'Age',
  premisesType: 'Premises type',
  processOfManufacture: 'Process of manufacture',
  installedCapacity: 'Installed / proposed capacity',
  existingCapacity: 'Existing capacity (before upgrade)',
  capacityUtilisationY1: 'Capacity utilisation Year 1 (%)',
  proposedWorkers: 'Proposed workers (nos.)',
  existingTech: 'Existing technology',
  proposedTech: 'Proposed technology / upgrade',
  productivityGain: 'Expected productivity / quality / cost gain',
  craft: 'Craft / trade',
  currentTools: 'Current tools',
  newTools: 'New tools needed',
  trainingStage: 'Training stage',
  loanTranche: 'Loan tranche',
  priorSelfEmploymentLoan: 'Similar self-employment loan in last 5 years?',
  yearsPractising: 'Years practising this craft',
  workplaceType: 'Workplace',
  covOrLor: 'Vending proof',
  upiQr: 'UPI ID',
  vendingType: 'Vending type / pitch',
  yearsVending: 'Years in street vending',
  dailySales: 'Approx daily sales (₹)',
  fssai: 'FSSAI status',
  unitStage: 'Unit stage',
  odopAligned: 'ODOP aligned?',
  enterpriseSize: 'Enterprise size',
  specialCategory: 'Special category',
  scStOwned: 'SC/ST wholly owned?',
  apDomicile: 'AP domicile',
  apiicPark: 'Unit inside an APIIC park?',
  fpoShg: 'FPO / SHG',
  pmegpCategory: 'Category',
  pmegpArea: 'Area (rural / urban)',
  implementingAgency: 'Implementing agency',
  pmegpAgency: 'Implementing agency',
  education: 'Education',
  educationStatus: 'Education',
  priorScheme: 'Prior scheme',
  firstSubsidyYear: 'Year of first subsidy',
  firstProjectCost: 'First sanction / project cost (₹ Lakhs)',
  priorSanctionAmount: 'Prior sanction amount (₹ Lakhs)',
  firstLoanRepaid: 'First loan repaid in time?',
  firstMmAdjusted: 'First margin money adjusted?',
  marginMoneyAdjusted: 'First margin money adjusted?',
  nerHill: 'NER / Hill State?',
  mudraCategory: 'PMMY category',
  loanPurpose: 'Loan purpose',
  standupCategory: 'Eligible category',
  controllingStakePercent: 'Controlling stake %',
  compositeLoan: 'Composite loan sought (₹ Lakhs)',
  loanAmountSought: 'Loan amount sought (₹ Lakhs)',
  sclcssCategory: 'SC / ST category',
  existingUnitYears: 'Existing unit years',
  proposedPmCost: 'Proposed P&M cost (₹ Lakhs)',
  energyBaselineKwh: 'Energy baseline (kWh / month)',
  expectedSaving: 'Expected saving (%)',
  eeEquipment: 'EE equipment focus',
  gmpStatus: 'GMP status',
  productLicence: 'Product licence',
  deviceOrFormulation: 'Focus',
  promotionNeed: 'Promotion / development need',
  womenOwned: 'Women-owned',
  proposedLimit: 'Proposed limit (₹ Lakhs)',
  activityBand: 'Activity band',
  boosterCategory: 'Booster category',
  welfareCorporation: 'Welfare corporation',
  whiteRiceCard: 'White rice card',
  activityTrade: 'Activity / trade',
  circularSector: 'Circular sector',
  apiicParkName: 'APIIC / park name',
  plotArea: 'Plot area',
  landRebateClaim: 'Land rebate claim',
  scStOrWomen: 'SC/ST or women category',
  ondcReady: 'ONDC readiness',
  catalogueSkus: 'Catalogue SKUs (approx)',
  productListNote: 'Product list note',
  exportMarkets: 'Export markets',
  hsnLines: 'HSN lines',
  prePostShipment: 'Pre / post shipment',
  exportCreditSought: 'Export credit sought (₹ Lakhs)',
  peakWcOutstanding: 'Peak Q4 WC outstanding (₹ Lakhs)',
  additionalWcSought: 'Additional ECLGS WC sought (₹ Lakhs)',
  accountStatus: 'Account status',
  liquidityReason: 'Why additional liquidity is needed',
  existingWcLimit: 'Existing fund-based WC limit (₹ Lakhs)',
  existingLimit: 'Existing fund-based WC limit (₹ Lakhs)',
  zedCurrentLevel: 'Current ZED level',
  zedTargetLevel: 'Target ZED level',
  qualityFocus: 'Quality / sustainability focus',
  processBottleneck: 'Main process bottleneck',
  shopFloorSize: 'Shop-floor size / lines',
  expectedLeanGain: 'Expected lean gain',
  ipType: 'IP type',
  filingStage: 'Filing stage',
  inventionTitle: 'Invention / mark title',
  eventName: 'Event / fair name',
  stallSize: 'Stall size',
  fairCity: 'Fair city',
  estimatedFairCost: 'Estimated fair cost (₹ Lakhs)',
  gemExperience: 'GeM experience',
  procurementFocus: 'Procurement focus',
  incubatorName: 'Incubator / LBI name',
  innovationBrief: 'Innovation / livelihood brief',
  livelihoodFocus: 'Innovation / livelihood brief',
  loomType: 'Loom type',
  weaverId: 'Weaver ID / corp membership',
  productLine: 'Product line',
  yarnSource: 'Yarn source',
  coirProductLine: 'Coir product line',
  coirBoardStatus: 'Coir Board status',
  experienceYears: 'Experience (years)',
  yearsInOperation: 'Years in operation',
  existingTurnover: 'Existing turnover (₹ Lakhs)',
  powerRequirement: 'Power requirement',
  directEmployment: 'Direct employment',
  indirectEmployment: 'Indirect employment',
  impactNote: 'Impact note',
  rawMaterialSources: 'Raw material sources',
  udyamStatus: 'Udyam status',
  yearsProfitable: 'Years profitable',
  sectorBand: 'Sector band',
  pmegpSubsidyPercent: 'PMEGP subsidy %',
  pmegpOwnPercent: 'Own contribution %',
};

const CATALOG_BY_CODE: Record<string, SchemeStepDef[]> = {
  PMEGP: catalogs.PMEGP_STEPS,
  MUDRA: catalogs.MUDRA_STEPS,
  STANDUP: catalogs.STANDUP_STEPS,
  PMFME: catalogs.PMFME_STEPS,
  PMEGP_2ND: catalogs.PMEGP_2ND_STEPS,
  SCLCSS: catalogs.SCLCSS_STEPS,
  AP_TECH_UPGRADE: catalogs.AP_TECH_UPGRADE_STEPS,
  AP_EDP: catalogs.AP_EDP_STEPS,
  VISHWAKARMA: catalogs.VISHWAKARMA_STEPS,
  SVANIDHI: catalogs.SVANIDHI_STEPS,
  ECLGS: catalogs.ECLGS_STEPS,
  ZED: catalogs.ZED_STEPS,
  LEAN: catalogs.LEAN_STEPS,
  MSME_IPR: catalogs.MSME_IPR_STEPS,
  PMS: catalogs.PMS_STEPS,
  SCST_HUB: catalogs.SCST_HUB_STEPS,
  ASPIRE: catalogs.ASPIRE_STEPS,
  NHDP: catalogs.NHDP_STEPS,
  CVY: catalogs.CVY_STEPS,
  MSE_GIFT: catalogs.MSE_GIFT_STEPS,
  PTUAS: catalogs.PTUAS_STEPS,
  PMPDS: catalogs.PMPDS_STEPS,
  CGTMSE: catalogs.CGTMSE_STEPS,
  AP_FPP: catalogs.AP_FPP_STEPS,
  AP_CMEP: catalogs.AP_CMEP_STEPS,
  OBMMS: catalogs.OBMMS_STEPS,
  MSE_SPICE: catalogs.MSE_SPICE_STEPS,
  AP_PARKS: catalogs.AP_PARKS_STEPS,
  RAMP_TEAM: catalogs.RAMP_TEAM_STEPS,
  EPM_NIRYAT: catalogs.EPM_NIRYAT_STEPS,
};

function extraFieldsForScheme(schemeCode?: string | null): string[] {
  if (!schemeCode) return [];
  return SCHEME_EXTRA_FIELDS[schemeCode] || [];
}

function hideComplexCapex(code: string | null, budget?: string): boolean {
  if (HIDE_COMPLEX_CAPEX.has(code || '')) return true;
  return code === 'MUDRA' && (budget === 'under2L' || budget === '2to5L');
}

function stepField(name: string, label: string, contentStep: number): DocField {
  return { name, label, source: 'step', path: `step${contentStep}.${name}` };
}

function extraField(name: string): DocField {
  return {
    name,
    label: EXTRA_FIELD_LABELS[name] || name,
    source: 'extras',
    path: `schemeExtras.${name}`,
  };
}

function getSchemeSteps(schemeCode?: string | null): SchemeStepDef[] {
  if (!schemeCode) return catalogs.VANILLA_STEPS as SchemeStepDef[];
  return (CATALOG_BY_CODE[schemeCode] || catalogs.VANILLA_STEPS) as SchemeStepDef[];
}

function getIndividualDocFields(
  contentStep: number,
  schemeCode?: string | null,
  budget?: string
): DocField[] {
  const lean = !!schemeCode && LEAN_UNIT_CODES.has(schemeCode);
  const hideCapex = hideComplexCapex(schemeCode || null, budget);

  if (contentStep === 1) {
    const fields: DocField[] = [
      stepField('unitName', 'Unit / Project Name', 1),
      stepField('district', 'District', 1),
      stepField('location', 'Location', 1),
      stepField('natureOfBusiness', 'Nature of Business', 1),
      stepField('majorProducts', 'Major Products', 1),
    ];
    extraFieldsForScheme(schemeCode).forEach((name) => fields.push(extraField(name)));
    return fields;
  }

  if (contentStep === 2) {
    const fields: DocField[] = [
      stepField('sectorType', lean ? 'Sector / industry type' : 'Sector / Industry Type', 2),
      stepField('sectorDescription', lean ? 'Short intro — what the unit does' : 'Sector Description', 2),
    ];
    if (!lean) {
      fields.push(
        stepField('nationalImportance', 'National Importance', 2),
        stepField('stateLevelImportance', 'State-level Importance', 2),
        stepField('keyProducts', 'Key Products', 2)
      );
    }
    if (
      schemeCode &&
      ['PMEGP', 'PMEGP_2ND', 'STANDUP', 'PMFME', 'SCLCSS', 'AP_TECH_UPGRADE', 'AP_EDP', 'VISHWAKARMA', 'SVANIDHI'].includes(
        schemeCode
      )
    ) {
      fields.push(extraField('processOfManufacture'));
    }
    if (schemeCode === 'PMEGP_2ND' || schemeCode === 'SCLCSS' || schemeCode === 'AP_TECH_UPGRADE') {
      fields.push(extraField('existingTech'), extraField('proposedTech'));
    }
    if (schemeCode === 'AP_TECH_UPGRADE') fields.push(extraField('productivityGain'));
    return fields;
  }

  if (contentStep === 3) {
    if (lean) return [stepField('geography', 'Brief location / market catchment', 3)];
    return [
      stepField('geography', 'Geography', 3),
      stepField('climate', 'Climate', 3),
      stepField('infrastructure', 'Infrastructure', 3),
      stepField('keyEconomicActivities', 'Key Economic Activities', 3),
      stepField('rawMaterialAvailability', 'Raw Material Availability', 3),
      stepField('rawMaterialQuantity', 'Raw Material Quantity', 3),
      stepField('industrialInfrastructure', 'Industrial Infrastructure', 3),
      stepField('connectivity', 'Connectivity', 3),
    ];
  }

  if (contentStep === 4) {
    const fields: DocField[] = [
      stepField('presentActivities', lean ? 'Present / proposed activity summary' : 'Present Activities', 4),
      stepField('yearOfEstablishment', lean ? 'Start / commencement' : 'Year of Establishment', 4),
      stepField('technologyLevel', lean ? 'Tools / process level' : 'Technology Level', 4),
      stepField('productionCapacity', lean ? 'Capacity / throughput' : 'Production Capacity', 4),
    ];
    if (!lean) {
      fields.push(
        stepField('clusterEvolution', 'How the unit evolved', 4),
        stepField('typeOfUnits', 'Type of unit', 4),
        stepField('stakeholders', 'Stakeholders', 4)
      );
    }
    if (schemeCode === 'PMEGP_2ND' || schemeCode === 'AP_TECH_UPGRADE') {
      fields.push(extraField('existingCapacity'));
    }
    if (schemeCode && ['PMEGP', 'PMEGP_2ND', 'STANDUP', 'PMFME', 'SCLCSS', 'AP_TECH_UPGRADE', 'AP_EDP'].includes(schemeCode)) {
      fields.push(extraField('capacityUtilisationY1'));
    }
    if (schemeCode === 'PMFME') fields.push(extraField('proposedWorkers'));
    return fields;
  }

  if (contentStep === 5) {
    return [
      stepField('rawMaterials', 'Raw Materials', 5),
      stepField('intermediateProducts', 'Intermediate Products', 5),
      stepField('finalProducts', 'Final Products', 5),
      stepField('valueAdditionStages', 'Value Addition Stages', 5),
      stepField('majorBuyers', 'Major Buyers', 5),
    ];
  }

  if (contentStep === 6) {
    const fields: DocField[] = [
      stepField('targetMarket', lean ? 'Target customers / market' : 'Target Market', 6),
      stepField('existingDemand', lean ? 'Demand / footfall note' : 'Existing Demand', 6),
    ];
    if (!lean) {
      fields.push(
        stepField('demandSupplyGap', 'Demand-Supply Gap', 6),
        stepField('competitorAnalysis', 'Competitor Analysis', 6),
        stepField('priceTrends', 'Price Trends', 6),
        stepField('exportPotential', 'Export Potential', 6)
      );
    }
    return fields;
  }

  if (contentStep === 7) {
    return [
      stepField('technologyGaps', 'Technology Gaps', 7),
      stepField('infrastructureGaps', 'Infrastructure Gaps', 7),
      stepField('skillGaps', 'Skill Gaps', 7),
      stepField('marketingGaps', 'Marketing Gaps', 7),
      stepField('financialGaps', 'Financial Gaps', 7),
      stepField('justificationForIntervention', 'Justification for Intervention', 7),
    ];
  }

  if (contentStep === 8) {
    return [
      stepField('strengths', 'Strengths', 8),
      stepField('weaknesses', 'Weaknesses', 8),
      stepField('opportunities', 'Opportunities', 8),
      stepField('threats', 'Threats', 8),
    ];
  }

  if (contentStep === 9) {
    return [
      stepField('interventionType', 'Activity type', 9),
      stepField('description', 'Description', 9),
      stepField('objectives', 'Objectives', 9),
      stepField('expectedBenefits', 'Expected Benefits', 9),
    ];
  }

  if (contentStep === 10) {
    if (lean) {
      return [
        stepField('name', 'Shop / shed / workplace name', 10),
        stepField('landDetails', 'Premises note (own / lease / rent)', 10),
      ];
    }
    return [
      stepField('name', 'Unit / shed / workplace name', 10),
      stepField('location', 'Location', 10),
      stepField('landDetails', 'Land Details', 10),
      stepField('civilWorks', 'Civil Works', 10),
      stepField('manufacturingProcess', 'Manufacturing Process', 10),
      stepField('plantAndMachinery', 'Plant & Machinery', 10),
      stepField('capacity', 'Capacity', 10),
      stepField('powerRequirements', 'Power Requirements', 10),
      stepField('waterRequirements', 'Water Requirements', 10),
      stepField('manpowerRequirements', 'Manpower Requirements', 10),
    ];
  }

  if (contentStep === 11) {
    if (lean) {
      return [
        stepField('spvName', 'Firm / proprietor name', 11),
        stepField('legalStatus', 'Legal status', 11),
        stepField('address', 'Correspondence address', 11),
      ];
    }
    return [
      stepField('spvName', 'Applicant / firm name', 11),
      stepField('legalStatus', 'Legal Status', 11),
      stepField('yearOfIncorporation', 'Year of establishment', 11),
      stepField('submittedTo', 'Submitted To', 11),
      stepField('objectives', 'Objectives', 11),
      stepField('boardOfDirectors', 'Owner(s)', 11),
    ];
  }

  if (contentStep === 12) {
    const fields: DocField[] = [];
    if (!hideCapex || schemeCode === 'AP_EDP') {
      fields.push(
        stepField('land', 'Land (₹ Lakhs)', 12),
        stepField('building', 'Building / shed (₹ Lakhs)', 12),
        stepField('utilitiesAndInfrastructure', 'Utilities & Infrastructure (₹ Lakhs)', 12),
        stepField('preliminaryAndPreOperative', 'Preliminary & Pre-operative (₹ Lakhs)', 12)
      );
    }
    fields.push(
      stepField('machinery', 'Machinery / equipment (₹ Lakhs)', 12),
      stepField('workingCapitalMargin', 'Working capital (₹ Lakhs)', 12)
    );
    return fields;
  }

  if (contentStep === 13) {
    return [
      stepField('spvContribution', 'Own / promoter contribution (₹ Lakhs)', 13),
      stepField('governmentGrant', 'Government Grant (₹ Lakhs)', 13),
      stepField('bankLoan', 'Bank Loan (₹ Lakhs)', 13),
      stepField('otherSources', 'Other Sources (₹ Lakhs)', 13),
    ];
  }

  if (contentStep === 14) {
    return [
      stepField('rawMaterialCost', 'Raw Material Cost (₹ Lakhs)', 14),
      stepField('powerCost', 'Power Cost (₹ Lakhs)', 14),
      stepField('wages', 'Wages (₹ Lakhs)', 14),
      stepField('maintenance', 'Maintenance (₹ Lakhs)', 14),
      stepField('administrativeExpenses', 'Administrative Expenses (₹ Lakhs)', 14),
      stepField('marketingExpenses', 'Marketing Expenses (₹ Lakhs)', 14),
      stepField('annualProductionVolume', 'Annual Production Volume', 14),
      stepField('annualSalesRealization', 'Annual Sales Realization (₹ Lakhs)', 14),
    ];
  }

  if (contentStep === 15) {
    return [
      stepField('yearProjections', 'Year-wise sales / costs / profit', 15),
      stepField('breakEvenPoint', 'Break-even Point', 15),
      stepField('irr', 'IRR (%)', 15),
      stepField('npv', 'NPV (₹ Lakhs)', 15),
      stepField('sensitivityAnalysis', 'Sensitivity Analysis', 15),
    ];
  }

  if (contentStep === 16) {
    return [
      stepField('startDate', 'Start / commercial production date', 16),
      stepField('totalImplementationPeriod', 'Total Implementation Period', 16),
      stepField('milestones', 'Milestones', 16),
    ];
  }

  if (contentStep === 17) {
    return [
      stepField('employmentGeneration', 'Employment Generation', 17),
      stepField('turnoverGrowth', 'Turnover Growth (%)', 17),
      stepField('exportGrowth', 'Export Growth (%)', 17),
      stepField('incomeEnhancement', 'Income Enhancement (%)', 17),
      stepField('sustainabilityOutcomes', 'Sustainability Outcomes', 17),
    ];
  }

  return [];
}

export function formatDocValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return '—';
    return String(value);
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string') {
    const mapped: Record<string, string> = { yes: 'Yes', no: 'No', cov: 'Certificate of Vending', first: '1st tranche' };
    return mapped[value] || value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    return value
      .map((item) => {
        if (item == null || item === '') return '';
        if (typeof item === 'string' || typeof item === 'number') return String(item);
        if (typeof item === 'object') {
          const o = item as Record<string, unknown>;
          if (o.name && o.source) return `${o.name} (${o.source})`;
          if (o.name && o.designation) return `${o.name} — ${o.designation}`;
          if (o.activity) {
            const when = [o.startDate, o.endDate].filter(Boolean).join(' → ');
            return when ? `${o.activity} (${when})` : String(o.activity);
          }
          if (o.year != null) {
            const bits = [`Y${o.year}`];
            if (o.sales != null) bits.push(`sales ${o.sales}`);
            if (o.revenue != null) bits.push(`rev ${o.revenue}`);
            if (o.netProfit != null) bits.push(`NP ${o.netProfit}`);
            if (o.profit != null) bits.push(`P ${o.profit}`);
            return bits.join(', ');
          }
          if (o.stakeholder && o.percentage != null) return `${o.stakeholder} ${o.percentage}%`;
          return Object.values(o).filter((v) => v !== '' && v != null).join(' — ');
        }
        return String(item);
      })
      .filter(Boolean)
      .join('; ');
  }
  if (typeof value === 'object') {
    const o = value as Record<string, unknown>;
    const parts = Object.entries(o)
      .filter(([, v]) => v !== '' && v != null && v !== 0)
      .map(([k, v]) => `${k}: ${v}`);
    return parts.length ? parts.join(', ') : '—';
  }
  return String(value);
}

function isFilled(formatted: string): boolean {
  return !!formatted && formatted !== '—';
}

export function extractIndividualDocData(dpr: any, project?: any): Record<string, any> {
  return (
    dpr?.content?.english?.clusterData ||
    dpr?.content?.telugu?.clusterData ||
    dpr?.metadata?.clusterData ||
    project?.stepData ||
    {}
  );
}

export function extractSchemeCode(dpr: any, project?: any, data?: Record<string, any>): string | null {
  return (
    data?.matchedSchemeCode ||
    dpr?.metadata?.matchedSchemeCode ||
    data?.metadata?.matchedSchemeCode ||
    project?.matchedSchemeCode ||
    null
  );
}

export function isIndividualDprRecord(dpr: any, project?: any): boolean {
  if (
    dpr?.metadata?.isIndividualDPR ||
    dpr?.content?.english?.isIndividualDPR ||
    dpr?.content?.english?.clusterData?.isIndividualDPR ||
    dpr?.content?.telugu?.isIndividualDPR ||
    project?.projectType === 'individual'
  ) {
    return true;
  }
  const scheme = extractSchemeCode(dpr, project, extractIndividualDocData(dpr, project));
  return !!scheme && project?.projectType !== 'cluster';
}

function readField(field: DocField, data: Record<string, any>): unknown {
  if (field.source === 'extras') {
    return (data.schemeExtras || {})[field.name];
  }
  const step = data[`step${field.path.match(/^step(\d+)/)?.[1]}`] || {};
  if (field.name === 'unitName') return step.unitName || step.clusterName;
  return step[field.name];
}

function actionLine(schemeCode: string | null): string {
  if (schemeCode && UPGRADE_SCHEMES.has(schemeCode)) return 'Upgradation of';
  if (schemeCode === 'ECLGS') return 'Working Capital Proposal for';
  if (schemeCode === 'ZED' || schemeCode === 'LEAN' || schemeCode === 'MSME_IPR') return 'Proposal for';
  if (schemeCode === 'PMS') return 'Marketing Support Proposal for';
  return 'Establishment of';
}

function uploadRows(schemeCode: string | null, data: Record<string, any>): DocRow[] {
  const store = data.step18 || data.uploads || {};
  const labels: Record<string, string> = {
    aadhaarPan: 'Aadhaar / PAN',
    udyamCertificate: 'Udyam Certificate',
    bankPassbook: 'Bank Passbook',
    machineryQuotations: 'Machinery / Equipment Quotations',
    covOrLor: 'Certificate of Vending / Vendor ID or Portal LoR',
    upiProof: 'UPI ID / QR Screenshot',
    rationCard: 'Ration Card',
    pmVishwakarmaId: 'PM Vishwakarma Certificate / ID',
    toolkitQuotation: 'Toolkit List / Quote',
  };
  const ids =
    schemeCode === 'SVANIDHI'
      ? ['covOrLor', 'aadhaarPan', 'bankPassbook', 'upiProof']
      : schemeCode === 'VISHWAKARMA'
        ? ['aadhaarPan', 'bankPassbook', 'rationCard', 'pmVishwakarmaId', 'toolkitQuotation']
        : ['aadhaarPan', 'udyamCertificate', 'bankPassbook', 'machineryQuotations'];
  return ids.map((id) => {
    const present = !!(store[id] || store[labels[id]]);
    return {
      label: labels[id] || id,
      value: present ? 'Uploaded' : 'Pending',
      path: `step18.${id}`,
      filled: present,
    };
  });
}

export function buildIndividualDocument(dpr: any, project?: any): IndividualDocument {
  const data = extractIndividualDocData(dpr, project);
  const schemeCode = extractSchemeCode(dpr, project, data);
  const steps = getSchemeSteps(schemeCode);
  const step1 = data.step1 || {};
  const extras = data.schemeExtras || {};
  const budget = data.ventureMatchAnswers?.budget;
  const unitName = (step1.unitName || step1.clusterName || project?.projectName || 'UNIT NAME').toString();
  const schemeLabel = schemeCode ? (SCHEME_LABELS[schemeCode] || schemeCode) : 'Bank Term Loan';

  const sections: DocSection[] = steps.map((def) => {
    const title = def.title.replace(/^Step \d+:\s*/, '');
    if (def.id === 'uploads' || def.contentStep === 18) {
      return { n: def.n, id: def.id, title, contentStep: def.contentStep, rows: uploadRows(schemeCode, data) };
    }
    const fields = getIndividualDocFields(def.contentStep, schemeCode, budget);
    const seen = new Set<string>();
    const rows: DocRow[] = [];
    for (const field of fields) {
      if (seen.has(field.path)) continue;
      seen.add(field.path);
      const formatted = formatDocValue(readField(field, data));
      rows.push({ label: field.label, value: formatted, path: field.path, filled: isFilled(formatted) });
    }
    return { n: def.n, id: def.id, title, contentStep: def.contentStep, rows };
  });

  let askedCount = 0;
  let filledCount = 0;
  for (const section of sections) {
    for (const row of section.rows) {
      askedCount += 1;
      if (row.filled) filledCount += 1;
    }
  }

  return {
    schemeCode,
    unitName,
    district: step1.district || '',
    location: step1.location || '',
    entrepreneurName: extras.entrepreneurName || '',
    actionLine: actionLine(schemeCode),
    underLine: `under '${schemeLabel}'`,
    sections,
    askedCount,
    filledCount,
  };
}

function escapeHtml(s: string): string {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderIndividualDprHtml(doc: IndividualDocument): string {
  const qaTable = (rows: DocRow[]) => {
    if (!rows.length) return '<p>—</p>';
    const body = rows
      .map(
        (r) =>
          `<tr><td class="q">${escapeHtml(r.label)}</td><td>${escapeHtml(r.value).replace(/\n/g, '<br/>')}</td></tr>`
      )
      .join('');
    return `<table><colgroup><col style="width:36%"/><col style="width:64%"/></colgroup><thead><tr><th>Question</th><th>Answer</th></tr></thead><tbody>${body}</tbody></table>`;
  };

  const toc = doc.sections
    .map((s) => `<tr><td class="num">${s.n}</td><td>${escapeHtml(s.title)}</td></tr>`)
    .join('');

  const sectionsHtml = doc.sections
    .map(
      (s) =>
        `<section class="sec"><h2>${s.n}. ${escapeHtml(s.title)}</h2>${qaTable(s.rows)}</section>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; color: #1F2937; font-family: 'Times New Roman', Times, serif; }
  .cover { text-align: center; border-bottom: 2px solid #1F2937; padding: 4mm 2mm 8mm; margin-bottom: 8mm; }
  .kicker { font-size: 20pt; font-weight: 700; letter-spacing: 0.08em; margin: 0 0 10pt; }
  .on, .action { font-size: 13pt; font-weight: 600; margin: 2pt 0; }
  .unit { color: #059669; font-size: 20pt; font-weight: 700; text-transform: uppercase; margin: 10pt 6mm; line-height: 1.25; }
  .scheme { font-size: 12pt; font-weight: 600; max-width: 150mm; margin: 8pt auto 0; line-height: 1.4; }
  .meta { display: table; margin: 14pt auto 0; text-align: left; font-size: 11pt; }
  .meta div { display: table-row; }
  .meta span { display: table-cell; font-weight: 700; padding: 2pt 10pt 2pt 0; white-space: nowrap; }
  h2 { font-size: 13pt; margin: 0 0 8pt; padding-bottom: 3pt; border-bottom: 1px solid #D1D5DB; }
  table { width: 100%; max-width: 100%; table-layout: fixed; border-collapse: collapse; margin: 0 0 6mm; font-size: 10pt; }
  th, td { border: 1px solid #1F2937; padding: 6pt 7pt; vertical-align: top; text-align: left; overflow-wrap: anywhere; word-break: break-word; }
  thead th { background: #F3F4F6; }
  td.q { font-weight: 600; background: #FAFAFA; }
  td.num { text-align: center; width: 12%; }
  .sec { margin-bottom: 7mm; page-break-inside: avoid; }
</style>
</head>
<body>
  <div class="cover">
    <div class="kicker">DETAILED PROJECT REPORT</div>
    <div class="on">On</div>
    <div class="action">${escapeHtml(doc.actionLine)}</div>
    <div class="unit">${escapeHtml(doc.unitName)}</div>
    <div class="scheme">${escapeHtml(doc.underLine)}</div>
    <div class="meta">
      <div><span>District</span>${escapeHtml(doc.district || '—')}</div>
      <div><span>Location</span>${escapeHtml(doc.location || '—')}</div>
      ${doc.entrepreneurName ? `<div><span>Entrepreneur name</span>${escapeHtml(doc.entrepreneurName)}</div>` : ''}
    </div>
  </div>
  <h2>Table of Contents</h2>
  <table><colgroup><col style="width:12%"/><col style="width:88%"/></colgroup><thead><tr><th>#</th><th>Section</th></tr></thead><tbody>${toc}</tbody></table>
  ${sectionsHtml}
</body>
</html>`;
}

export async function generateIndividualDprDocx(doc: IndividualDocument): Promise<Buffer> {
  const qaTable = (rows: DocRow[]) =>
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: 'Question', bold: true })] })],
            }),
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: 'Answer', bold: true })] })],
            }),
          ],
        }),
        ...rows.map(
          (r) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: r.label })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: r.value })],
                }),
              ],
            })
        ),
      ],
    });

  const children: (Paragraph | Table)[] = [
    new Paragraph({
      text: 'DETAILED PROJECT REPORT',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: 'On', alignment: AlignmentType.CENTER }),
    new Paragraph({ text: doc.actionLine, alignment: AlignmentType.CENTER }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: doc.unitName.toUpperCase(), bold: true, color: '059669', size: 36 })],
    }),
    new Paragraph({ text: doc.underLine, alignment: AlignmentType.CENTER }),
    new Paragraph({ text: `District: ${doc.district || '—'}` }),
    new Paragraph({ text: `Location: ${doc.location || '—'}` }),
    ...(doc.entrepreneurName
      ? [new Paragraph({ text: `Entrepreneur name: ${doc.entrepreneurName}` })]
      : []),
    new Paragraph({ text: '' }),
    new Paragraph({ text: 'Table of Contents', heading: HeadingLevel.HEADING_2 }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Section', bold: true })] })] }),
          ],
        }),
        ...doc.sections.map(
          (s) =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: String(s.n) })] }),
                new TableCell({ children: [new Paragraph({ text: s.title })] }),
              ],
            })
        ),
      ],
    }),
  ];

  for (const section of doc.sections) {
    children.push(new Paragraph({ text: '' }));
    children.push(
      new Paragraph({
        text: `${section.n}. ${section.title}`,
        heading: HeadingLevel.HEADING_2,
      })
    );
    children.push(qaTable(section.rows));
  }

  const word = new Document({
    sections: [{ children }],
  });
  return Packer.toBuffer(word);
}

export function individualQaPlainText(doc: IndividualDocument): string {
  return doc.sections
    .map((s) => {
      const rows = s.rows.map((r) => `${r.label}: ${r.value}`).join('\n');
      return `${s.n}. ${s.title}\n${rows}`;
    })
    .join('\n\n');
}

export function groupSectionsForQuality(doc: IndividualDocument): Record<string, string> {
  const buckets: Record<string, number[]> = {
    executiveSummary: [1],
    businessProfile: [2, 3, 4, 11],
    marketAnalysis: [5, 6, 8],
    technicalFeasibility: [7, 9, 10],
    financialProjections: [12, 13, 14, 15],
    conclusion: [16, 17, 18],
  };
  const out: Record<string, string> = {};
  for (const [key, steps] of Object.entries(buckets)) {
    const texts = doc.sections
      .filter((s) => steps.includes(s.contentStep) || (key === 'executiveSummary' && s.n === 1))
      .map((s) => s.rows.filter((r) => r.filled).map((r) => `${r.label}: ${r.value}`).join('\n'))
      .filter(Boolean);
    out[key] = texts.join('\n\n');
  }
  return out;
}

export function resolveCatalogJsonPath(): string {
  const candidates = [
    path.join(__dirname, 'individualDprCatalog.json'),
    path.join(process.cwd(), 'server/src/services/individualDprCatalog.json'),
    path.join(process.cwd(), 'src/services/individualDprCatalog.json'),
  ];
  return candidates.find((p) => fs.existsSync(p)) || candidates[0];
}
