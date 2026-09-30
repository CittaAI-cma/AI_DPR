/**
 * One filled PMEGP case: new rural steel-furniture unit, Tangutur, Prakasam.
 * Run from server/: node node_modules/ts-node-dev/node_modules/ts-node/dist/bin.js --transpile-only scripts/pmegpSteelFurnitureTestCase.ts
 */
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { buildIndividualDocument, renderIndividualDprHtml } from '../src/services/individualDprDocument';

const clusterData = {
  isIndividualDPR: true,
  matchedSchemeCode: 'PMEGP',
  schemeExtras: {
    pmegpCategory: 'general',
    pmegpArea: 'rural',
    pmegpAgency: 'KVIB',
    entrepreneurName: 'Sri P. Venkateswara Rao',
    entrepreneurAge: '38',
    educationStatus: '8thPlus',
    executiveSummary:
      'Sri Venkateswara Steel Furniture is a proposed new fabrication unit at Tangutur, Prakasam district, for school desks, steel almirahs and window grills. Sri P. Venkateswara Rao, an ITI fitter with nine years in a Vijayawada fabrication shop, will run it as a proprietorship. The project cost is ₹23.20 lakh. The promoter brings ₹2.32 lakh (10%). PMEGP margin money for a rural general-category unit is ₹5.80 lakh (25%). State Bank of India, Tangutur branch, is proposed for a term loan of ₹15.08 lakh at 11% for 60 months with a 6-month moratorium. The shed is leased. Commercial production is proposed from January 2027 at 55% of a 6-piece-a-day capacity.',
    processOfManufacture:
      'MS angles, square pipes and CRCA sheets are cut to size on a hydraulic shear, notched and bent, then MIG-welded on jigs for desks, almirahs and grill frames. Welds are ground, the piece is degreased, primed and finished in a spray booth. School desks are packed in sets of ten. Almirahs get locks, shelves and a paint coat. Grill sets are measured against the mason’s opening list. No foundry and no structural fabrication for buildings. Scrap is sold weekly to the Ongole scrap yard.',
    installedCapacity: '6 furniture pieces a day on one shift',
    capacityUtilisationY1: 55,
    powerRequirement: '15 kW, 3-phase',
    pmegpSubsidyPercent: 25,
    pmegpOwnPercent: 10,
    directEmployment: 7,
    indirectEmployment: 4,
    impactNote:
      'Seven people will work in the shed: one supervisor, two welders, two helpers, one painter and the promoter on accounts and school-order follow-up. Paint, hardware and local transport add about four indirect jobs. The first buyers are two government-school suppliers in Prakasam and a furniture shop in Ongole.',
  },
  step1: {
    unitName: 'Sri Venkateswara Steel Furniture',
    clusterName: 'Sri Venkateswara Steel Furniture',
    district: 'Prakasam',
    location: 'Survey No. 42/2, Tangutur, Prakasam district',
    natureOfBusiness: 'Fabrication of steel school furniture, almirahs and window grills',
    majorProducts: 'School desk with bench, steel almirah, window grill set',
  },
  step2: {
    sectorType: 'Light engineering — steel furniture',
    sectorDescription:
      'The unit will cut, weld and paint purchased mild-steel sections into school desks, household almirahs and window grills for schools and house builders in Prakasam district. It is a new rural manufacturing shed, not a trading showroom.',
  },
  step3: {
    geography:
      'The shed is on the Tangutur–Ongole road, about 18 km from Ongole. Steel traders in Ongole deliver sheet and pipe by tempo. Two school-furniture suppliers and house builders in Tangutur and Singarayakonda are the first buyers. A 3-phase line is on the road.',
  },
  step4: {
    presentActivities:
      'The unit is not yet in production. The promoter is a fitter in a Vijayawada fabrication shop and will move to Tangutur once the loan is sanctioned. Commercial production is proposed from January 2027.',
    yearOfEstablishment: 'Proposed commencement January 2027',
    technologyLevel: 'Hydraulic shear, MIG welding, pipe bending and a spray booth',
    productionCapacity: '6 furniture pieces a day at full capacity',
    productMix: [
      { name: 'School desk with bench', sharePercent: 55, sellingPrice: 4200 },
      { name: 'Steel almirah', sharePercent: 25, sellingPrice: 7600 },
      { name: 'Window grill set', sharePercent: 20, sellingPrice: 2800 },
    ],
  },
  step6: {
    targetMarket:
      'Two school-furniture suppliers who cover government and private schools in Prakasam, house builders in Tangutur, and one furniture shop in Ongole. No export is proposed.',
    existingDemand:
      'School suppliers place desk orders before June. House builders order grills through the year. The promoter has enquiry notes from two suppliers for about 400 desks in the first school season.',
  },
  step10: {
    name: 'Sri Venkateswara Steel Furniture shed',
    landDetails:
      'Leased roadside shed of about 2,400 sq.ft. on Survey No. 42/2, Tangutur. Five-year lease, two-year lock-in. Landlord: Sri M. Subba Rao, Tangutur.',
  },
  step11: {
    spvName: 'Sri Venkateswara Steel Furniture',
    legalStatus: 'Proprietorship',
    address: 'D.No. 3-18, Tangutur village and post, Prakasam district, Andhra Pradesh',
  },
  step12: {
    land: 0,
    building: 3.2,
    machinery: 12.4,
    utilitiesAndInfrastructure: 0.8,
    preliminaryAndPreOperative: 0.6,
    workingCapitalMargin: 6.2,
    machineryItems: [
      { description: 'Hydraulic shearing machine', condition: 'New', supplier: 'Batliboi dealer, Vijayawada', quantity: 1, unitCost: 2.6 },
      { description: 'MIG welding machines', condition: 'New', supplier: 'Welding supplier, Ongole', quantity: 2, unitCost: 0.55 },
      { description: 'Pipe bending machine', condition: 'New', supplier: 'Fabricator, Hyderabad', quantity: 1, unitCost: 1.8 },
      { description: 'Bench drill and angle grinder set', condition: 'New', supplier: 'Tools shop, Ongole', quantity: 1, unitCost: 0.45 },
      { description: 'Spray booth with compressor', condition: 'New', supplier: 'Paint equipment, Chennai', quantity: 1, unitCost: 2.15 },
      { description: 'Powder-coating oven', condition: 'New', supplier: 'Coating equipment, Hyderabad', quantity: 1, unitCost: 2.4 },
      { description: 'Hand tools, clamps and measuring set', condition: 'New', supplier: 'Local, Ongole', quantity: 1, unitCost: 0.4 },
      { description: '10 kVA panel and stabilizer', condition: 'New', supplier: 'Electricals, Guntur', quantity: 1, unitCost: 1.5 },
    ],
  },
  step13: {
    spvContribution: 2.32,
    governmentGrant: 5.8,
    bankLoan: 15.08,
    otherSources: 0,
    bankName: 'State Bank of India, Tangutur branch',
    interestRate: 11,
    moratoriumMonths: 6,
    loanTenureMonths: 60,
  },
  step14: {
    rawMaterialCost: 26,
    powerCost: 1.4,
    wages: 8.5,
    maintenance: 0.5,
    administrativeExpenses: 1,
    marketingExpenses: 0.4,
    annualProductionVolume: 990,
    annualSalesRealization: 47.2,
    rawMaterialItems: [
      { name: 'CRCA sheet and MS angle', use: 'Desks and almirahs', basis: 'Monthly lots from Ongole steel traders' },
      { name: 'MS square pipe', use: 'Desk frames and grills', basis: 'Bought against confirmed school orders' },
      { name: 'Primer, paint, locks and packing', use: 'Finishing', basis: 'Monthly consumable stock' },
    ],
    staffRoles: [
      { role: 'Fabrication supervisor', count: 1, monthlyPay: 16000 },
      { role: 'Welders', count: 2, monthlyPay: 13000 },
      { role: 'Helpers', count: 2, monthlyPay: 9000 },
      { role: 'Painter', count: 1, monthlyPay: 11000 },
    ],
  },
  step15: {
    breakEvenPoint: 48,
    yearProjections: [
      { year: 1, sales: 47.2, rm: 26, wages: 8.5, power: 1.4, netProfit: 5.8 },
      { year: 2, sales: 60.1, rm: 33, wages: 9, power: 1.6, netProfit: 8.2 },
      { year: 3, sales: 68.7, rm: 37.5, wages: 9.6, power: 1.8, netProfit: 10.1 },
      { year: 4, sales: 73, rm: 39.8, wages: 10.1, power: 1.9, netProfit: 10.8 },
      { year: 5, sales: 77.3, rm: 42, wages: 10.6, power: 2, netProfit: 11.4 },
    ],
  },
  step16: {
    startDate: '2027-01-01',
    milestones: [
      { activity: 'KVIB forwarding and bank appraisal', timeRequired: '45 days', startDate: '2026-08-01', endDate: '2026-09-15' },
      { activity: 'Shed flooring, 3-phase connection and machine order', timeRequired: '45 days', startDate: '2026-09-16', endDate: '2026-10-31' },
      { activity: 'Installation, trial welding and staff joining', timeRequired: '30 days', startDate: '2026-11-01', endDate: '2026-11-30' },
      { activity: 'First school-desk lot', timeRequired: '30 days', startDate: '2026-12-01', endDate: '2027-01-01' },
    ],
  },
  step17: {
    employmentGeneration: 7,
  },
  step18: {
    aadhaarPan: { status: 'uploaded', originalName: 'aadhaar-pan-venkateswara-rao.pdf' },
    machineryQuotations: { status: 'uploaded', originalName: 'shear-welder-oven-quotations.pdf' },
    buildingEstimates: { status: 'uploaded', originalName: 'tangutur-shed-estimate.pdf' },
    bankPassbook: { status: 'uploaded', originalName: 'sbi-tangutur-passbook.pdf' },
    udyamCertificate: { status: 'uploaded', originalName: 'udyam-application-venkateswara-steel.pdf' },
    educationCertificate: { status: 'uploaded', originalName: 'iti-fitter-certificate.pdf' },
  },
};

async function main() {
  const dpr = {
    metadata: { isIndividualDPR: true, matchedSchemeCode: 'PMEGP', clusterData },
    content: { english: { clusterData, isIndividualDPR: true } },
  };
  const html = renderIndividualDprHtml(buildIndividualDocument(dpr, { projectName: clusterData.step1.unitName }));
  const chrome = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].find((candidate) => candidate && fs.existsSync(candidate));
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chrome,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setContent(html, { waitUntil: 'load', timeout: 60000 });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' },
  });
  await browser.close();
  const outDir = path.resolve(__dirname, '../../docs/schemes/PMEGP');
  const outFile = path.join(outDir, 'sri-venkateswara-steel-furniture-pmegp-test.pdf');
  fs.writeFileSync(outFile, pdf);
  console.log(`Wrote ${outFile} (${pdf.length} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
