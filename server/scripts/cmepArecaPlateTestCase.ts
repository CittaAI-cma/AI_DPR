/**
 * One filled AP CMEP case: new rural areca-leaf plate unit, Kadiyam, East Godavari.
 * Run from server/: node node_modules/ts-node-dev/node_modules/ts-node/dist/bin.js --transpile-only scripts/cmepArecaPlateTestCase.ts
 */
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { buildIndividualDocument, renderIndividualDprHtml } from '../src/services/individualDprDocument';

const line = (
  sales: number,
  rm: number,
  wages: number,
  power: number,
  salaries: number,
  rent: number,
  maintenance: number,
  admin: number,
  interest: number,
  depreciation: number,
  tax: number,
  netProfit: number
) => ({ sales, rm, wages, power, salaries, rent, maintenance, admin, interest, depreciation, tax, netProfit });

const previous = ['2023-2024', '2024-2025', '2025-2026'].map((label) => ({
  label,
  period: 'previous' as const,
  ...line(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
}));

const projectedRows = [
  ['2026-2027', line(71.7, 40.0, 15.8, 2.6, 2.2, 1.8, 0.5, 1.2, 3.3, 2.1, 0.4, 1.8)],
  ['2027-2028', line(86.0, 47.3, 16.6, 2.9, 2.3, 1.9, 0.6, 1.3, 3.0, 1.9, 1.6, 6.6)],
  ['2028-2029', line(100.4, 54.2, 17.4, 3.2, 2.4, 2.0, 0.7, 1.4, 2.6, 1.7, 2.9, 11.9)],
  ['2029-2030', line(107.6, 57.5, 18.2, 3.4, 2.5, 2.1, 0.7, 1.5, 2.3, 1.5, 3.6, 14.3)],
  ['2030-2031', line(114.7, 60.8, 19.0, 3.5, 2.6, 2.2, 0.8, 1.5, 1.9, 1.4, 4.2, 16.8)],
  ['2031-2032', line(121.9, 64.0, 19.8, 3.6, 2.7, 2.3, 0.8, 1.6, 1.5, 1.2, 4.9, 19.5)],
  ['2032-2033', line(121.9, 64.0, 20.4, 3.7, 2.8, 2.4, 0.9, 1.7, 1.1, 1.1, 4.8, 19.0)],
  ['2033-2034', line(121.9, 64.0, 21.0, 3.8, 2.9, 2.5, 0.9, 1.7, 0.8, 1.0, 4.7, 18.6)],
].map(([label, amounts]) => ({ label, period: 'projected' as const, ...(amounts as object) }));

const clusterData = {
  isIndividualDPR: true,
  matchedSchemeCode: 'AP_CMEP',
  schemeExtras: {
    activityBand: 'manufacturing',
    boosterCategory: 'woman',
    apDomicile: 'yes',
    entrepreneurName: 'Smt. K. Padmavathi',
    cmepArea: 'rural',
    edpStatus: 'completed',
    priorSubsidy: 'no',
    familyExclusive: 'yes',
    premisesType: 'leased',
    executiveSummary:
      'Sri Godavari Areca Plates is a proposed new manufacturing unit at Kadiyam, East Godavari, for pressed areca-leaf meal plates, bowls and compartment plates. Smt. K. Padmavathi, a Kadiyam resident with four years as a supervisor in a leaf-plate unit, will run it as a proprietorship. The project cost is ₹33.71 lakh. The promoter brings ₹3.37 lakh and Indian Bank, Rajamahendravaram, is proposed for a term loan of ₹30.34 lakh at 11% for 84 months with a 6-month moratorium. Four hydraulic presses will make about 8,000 plates a day on one shift for 300 days. Year-1 utilisation is 50% because production starts in December 2026, and it rises to 85% by 2031-32. The unit is rural, the promoter is a woman, EDP is complete, and no family member has taken this subsidy before. Subsidy at 25% is back-ended and is not counted in the opening means of finance.',
    processOfManufacture:
      'Fallen areca sheaths are bought from gardens around Kadiyam, soaked, washed and trimmed. Sound sheaths are hot-pressed on hydraulic dies into 10-inch meal plates, 6-inch bowls and compartment plates. Pieces are dried, checked for cracks and packed in bundles of 100. Rejected leaf is pulverised and sold as nursery mulch. There is no plastic lamination and no dye. Wash water goes to a settling pit and is used on the landlord’s coconut garden. Power cuts are covered by a 20 kVA generator.',
  },
  step1: {
    unitName: 'Sri Godavari Areca Plates',
    clusterName: 'Sri Godavari Areca Plates',
    district: 'East Godavari',
    location: 'D.No. 2-41, Kadiyam village, East Godavari',
    natureOfBusiness: 'Pressed areca-leaf plate manufacturing',
    majorProducts: '10-inch meal plates, 6-inch bowls, compartment plates',
  },
  step2: {
    sectorType: 'Agro-based manufacturing — areca leaf plates',
    sectorDescription:
      'The unit will press fallen areca sheaths into disposable meal plates and bowls for hotels, canteens and function caterers in Rajamahendravaram and Kakinada. It is a new rural manufacturing shed. It does not make plastic plates and it does not trade finished goods bought from others.',
  },
  step3: {
    geography:
      'The shed is in Kadiyam, about 12 km from Rajamahendravaram railway station, on the road toward the nursery belt. Areca and coconut gardens are the leaf source. Buyers in Rajamahendravaram and Kakinada are a short tempo trip away. A rural 3-phase line serves the street.',
  },
  step4: {
    presentActivities:
      'The unit is not yet in production. The promoter currently supervises pressing at another unit in Kadiyam and will shift to her own shed after the machines are installed. Commercial pressing is proposed from December 2026.',
    yearOfEstablishment: 'Proposed commencement December 2026',
    technologyLevel: 'Four hydraulic hot presses, a leaf cutter, a hot-air dryer and a packing sealer',
    productionCapacity: '8,000 plates a day at full capacity',
    productMix: [
      { name: '10-inch meal plates', sharePercent: 55, sellingPrice: 6 },
      { name: '6-inch bowls', sharePercent: 25, sellingPrice: 3.5 },
      { name: 'Compartment plates', sharePercent: 20, sellingPrice: 9 },
    ],
    loomCount: 4,
    shifts: 1,
  },
  step6: {
    targetMarket:
      'Hotel suppliers and function caterers in Rajamahendravaram and Kakinada, and two temple-meal contractors. No export is proposed in the first three years.',
    existingDemand:
      'Caterers take plates for weekend functions. Hotels take a weekly lot. The promoter has enquiry notes from two caterers and one hotel supplier for the December marriage season.',
  },
  step10: {
    name: 'Sri Godavari Areca Plates shed',
    landDetails: 'Leased village shed with a small drying yard. Five-year lease, two-year lock-in. Landlord: Sri G. Narasimha Rao, Kadiyam.',
    workshopAreaSqft: 2200,
    productionAreaSqft: 1500,
    storageAreaSqft: 450,
    officeAreaSqft: 250,
    leaseYears: 5,
    waterAndEffluent:
      'About 800 litres a day to wash sheaths, plus drinking and floor washing. No dye. Wash water settles in a lined pit and is reused on the coconut garden. Domestic wastewater goes to a soak pit.',
  },
  step11: {
    spvName: 'Sri Godavari Areca Plates',
    legalStatus: 'Proprietorship',
    address: 'D.No. 1-88, Kadiyam village and post, East Godavari, Andhra Pradesh',
    promoters: [
      {
        name: 'Smt. K. Padmavathi',
        relationName: 'W/o K. Srinivas',
        age: '36',
        dob: '1990-08-12',
        education: 'B.Sc. Home Science, Adikavi Nannaya University',
        experienceYears: '4',
        phone: '9848123456',
        address: 'D.No. 1-88, Kadiyam, East Godavari',
      },
    ],
  },
  step12: {
    land: 0,
    building: 5.5,
    machinery: 15.31,
    furniture: 0.9,
    securityDeposits: 1.4,
    utilitiesAndInfrastructure: 1.2,
    preliminaryAndPreOperative: 0.8,
    workingCapitalMargin: 8.6,
    wcRawStock: 4.2,
    wcWip: 0.6,
    wcFinished: 1.8,
    wcReceivables: 2.6,
    wcSupplierCredit: 1.1,
    wcCash: 0.5,
    costPhasing: {
      land: { incurred: 0, proposed: 0 },
      building: { incurred: 0, proposed: 5.5 },
      machinery: { incurred: 0, proposed: 15.31 },
      furniture: { incurred: 0, proposed: 0.9 },
      deposits: { incurred: 0, proposed: 1.4 },
      workingCapital: { incurred: 0, proposed: 8.6 },
    },
    machineryItems: [
      { description: 'Hydraulic areca-leaf plate presses', condition: 'New', supplier: 'Press maker, Coimbatore', quantity: 4, unitCost: 1.55, gst: 0.28, transport: 0.03, installation: 0.04, lifeYears: 10, annualMaintenance: 0.06 },
      { description: 'Leaf cutting and trimming machines', condition: 'New', supplier: 'Local fabricator, Rajamahendravaram', quantity: 2, unitCost: 0.4, gst: 0.07, transport: 0.02, installation: 0.02, lifeYears: 8, annualMaintenance: 0.02 },
      { description: 'Hot-air dryer', condition: 'New', supplier: 'Dryer supplier, Hyderabad', quantity: 1, unitCost: 1.9, gst: 0.34, transport: 0.06, installation: 0.08, lifeYears: 12, annualMaintenance: 0.08 },
      { description: 'Leaf pulveriser for rejects', condition: 'New', supplier: 'Agro machinery, Vijayawada', quantity: 1, unitCost: 0.7, gst: 0.13, transport: 0.03, installation: 0.04, lifeYears: 10, annualMaintenance: 0.03 },
      { description: 'Packing and sealing machine', condition: 'New', supplier: 'Packing machines, Chennai', quantity: 1, unitCost: 0.55, gst: 0.1, transport: 0.03, installation: 0.02, lifeYears: 8, annualMaintenance: 0.02 },
      { description: 'Generator 20 kVA', condition: 'New', supplier: 'Kirloskar dealer, Rajamahendravaram', quantity: 1, unitCost: 2.2, gst: 0.4, transport: 0.05, installation: 0.06, lifeYears: 15, annualMaintenance: 0.1 },
    ],
  },
  step13: {
    spvContribution: 3.37,
    governmentGrant: 0,
    bankLoan: 30.34,
    otherSources: 0,
    cashCreditLimit: 5,
    bankName: 'Indian Bank, Rajamahendravaram main branch',
    interestRate: 11,
    moratoriumMonths: 6,
    loanTenureMonths: 84,
    subsidyPercent: 25,
  },
  step14: {
    rawMaterialCost: 40,
    powerCost: 2.6,
    wages: 15.8,
    maintenance: 0.5,
    administrativeExpenses: 1.2,
    marketingExpenses: 0.4,
    annualProductionVolume: 1200000,
    annualSalesRealization: 71.7,
    capacityPerDay: 8000,
    workingDays: 300,
    capacityUtilisation: 50,
    sellingPricePerUnit: 6,
    monthlyRent: 15000,
    monthlySalaries: 18000,
    monthlyPower: 22000,
    annualExpenseGrowth: 5,
    rawMaterialItems: [
      { name: 'Fallen areca sheaths', use: 'Plates, bowls and compartment plates', basis: 'Weekly lots from Kadiyam and nearby gardens' },
      { name: 'Packing covers and straps', use: 'Bundles of 100', basis: 'Monthly purchase from Rajamahendravaram' },
    ],
    staffRoles: [
      { role: 'Production supervisor', count: 1, monthlyPay: 18000 },
      { role: 'Press operators', count: 4, monthlyPay: 12000 },
      { role: 'Leaf washing helpers', count: 6, monthlyPay: 8000 },
      { role: 'Packing', count: 2, monthlyPay: 9000 },
    ],
    utilisationByYear: [
      { label: '2026-2027', percent: 50 },
      { label: '2027-2028', percent: 60 },
      { label: '2028-2029', percent: 70 },
      { label: '2029-2030', percent: 75 },
      { label: '2030-2031', percent: 80 },
      { label: '2031-2032', percent: 85 },
      { label: '2032-2033', percent: 85 },
      { label: '2033-2034', percent: 85 },
    ],
  },
  step15: {
    breakEvenPoint: 46,
    yearProjections: [...previous, ...projectedRows],
  },
  step16: {
    startDate: '2026-12-01',
    milestones: [
      { activity: 'Loan appraisal and lease registration', timeRequired: '30 days', startDate: '2026-08-01', endDate: '2026-08-31' },
      { activity: 'Shed floor, electrical work and press order', timeRequired: '45 days', startDate: '2026-09-01', endDate: '2026-10-15' },
      { activity: 'Installation, trial pressing and staff joining', timeRequired: '30 days', startDate: '2026-10-16', endDate: '2026-11-15' },
      { activity: 'First caterer lots for the marriage season', timeRequired: '15 days', startDate: '2026-11-16', endDate: '2026-12-01' },
    ],
    risks: [
      { risk: 'Sheath supply drops in the monsoon', mitigation: 'Keep a six-week dry stock and two garden sources.' },
      { risk: 'Press die damage before a function season', mitigation: 'Keep one spare die and an annual service contract.' },
      { risk: 'Slow payment from caterers', mitigation: 'Cap credit at 21 days and take an advance on marriage-season lots.' },
      { risk: 'Rural power cuts on pressing days', mitigation: '20 kVA generator sized for two presses and the dryer.' },
    ],
  },
  step18: {
    udyamCertificate: { status: 'uploaded', originalName: 'udyam-application-godavari-areca.pdf' },
    machineryQuotations: { status: 'uploaded', originalName: 'coimbatore-press-quotations.pdf' },
    apDomicileProof: { status: 'uploaded', originalName: 'aadhaar-padmavathi.pdf' },
    bankPassbook: { status: 'uploaded', originalName: 'indian-bank-passbook.pdf' },
    educationCertificate: { status: 'uploaded', originalName: 'bsc-home-science.pdf' },
    edpCertificate: { status: 'uploaded', originalName: 'edp-dic-east-godavari.pdf' },
    premisesLease: { status: 'uploaded', originalName: 'kadiyam-shed-lease.pdf' },
    rawMaterialQuotations: { status: 'uploaded', originalName: 'areca-sheath-rate-note.pdf' },
    dealerEnquiries: { status: 'uploaded', originalName: 'caterer-enquiries.pdf' },
  },
};

async function main() {
  const dpr = {
    metadata: { isIndividualDPR: true, matchedSchemeCode: 'AP_CMEP', clusterData },
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
  const outDir = path.resolve(__dirname, '../../docs/schemes/AP_CMEP');
  const outFile = path.join(outDir, 'sri-godavari-areca-plates-cmep-test.pdf');
  fs.writeFileSync(outFile, pdf);
  console.log(`Wrote ${outFile} (${pdf.length} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
