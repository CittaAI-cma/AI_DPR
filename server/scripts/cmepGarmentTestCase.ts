/**
 * One filled AP CMEP case: new readymade-garment unit, Guntur.
 * Run: npx ts-node --transpile-only scripts/cmepGarmentTestCase.ts
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
  ['2026-2027', line(66.3, 27.8, 14.4, 1.8, 8.2, 3.6, 1.2, 2.4, 3.4, 2.6, 0.2, 0.7)],
  ['2027-2028', line(78.4, 32.1, 15.8, 2.0, 8.6, 3.8, 1.3, 2.5, 3.0, 2.3, 1.4, 5.6)],
  ['2028-2029', line(90.5, 36.2, 17.2, 2.2, 9.0, 4.0, 1.4, 2.6, 2.6, 2.0, 2.7, 10.6)],
  ['2029-2030', line(96.5, 38.2, 18.0, 2.3, 9.4, 4.2, 1.5, 2.7, 2.2, 1.8, 3.2, 13.0)],
  ['2030-2031', line(102.6, 40.2, 18.8, 2.4, 9.8, 4.4, 1.6, 2.8, 1.8, 1.6, 3.8, 15.4)],
  ['2031-2032', line(108.6, 42.2, 19.6, 2.5, 10.2, 4.6, 1.7, 2.9, 1.4, 1.4, 4.4, 17.7)],
  ['2032-2033', line(108.6, 42.2, 19.6, 2.5, 10.6, 4.8, 1.8, 3.0, 1.0, 1.2, 4.4, 17.5)],
  ['2033-2034', line(108.6, 42.2, 19.6, 2.5, 11.0, 5.0, 1.8, 3.1, 0.6, 1.1, 4.3, 17.4)],
].map(([label, amounts]) => ({ label, period: 'projected' as const, ...(amounts as object) }));

const clusterData = {
  isIndividualDPR: true,
  matchedSchemeCode: 'AP_CMEP',
  schemeExtras: {
    activityBand: 'manufacturing',
    boosterCategory: 'woman',
    apDomicile: 'yes',
    entrepreneurName: 'Smt. Anitha Reddy',
    cmepArea: 'urban',
    edpStatus: 'completed',
    priorSubsidy: 'no',
    familyExclusive: 'yes',
    premisesType: 'leased',
    executiveSummary:
      'Sri Lakshmi Readymade Garments is a proposed new manufacturing unit at Brodipet, Guntur, for cotton shirts, kurtas and school uniforms. Smt. Anitha Reddy, a Guntur resident with six years in garment retail, will run the unit as a proprietorship. The project cost is ₹42.20 lakh, of which the promoter brings ₹6.30 lakh and Union Bank of India is proposed for a term loan of ₹35.90 lakh at 11% for 84 months with a 6-month moratorium. Twelve industrial sewing machines, a cutting section and steam finishing will produce about 80 pieces a day on one shift for 300 days. Year-1 utilisation is 55% and rises to 90% by 2031-32. The unit is urban, the promoter is a woman, EDP is complete, and no family member has taken this subsidy before. Buyers are school suppliers, local retailers and two wholesale traders in Guntur and Vijayawada.',
    processOfManufacture:
      'Fabric is received in lots, checked for width, shade and defects, and stored on racks. Markers are laid on the cutting table and panels are cut, bundled and ticketed by size and style. Bundles move to single-needle machines for assembly, then to overlock and button-hole machines. Each bundle is inspected for seam strength, measurement and loose thread. Garments are steam-pressed, folded, size-labelled and packed in dozens. School-uniform lots are packed against the buyer’s size ratio. Rejects are recut or sold as seconds. Dyeing and spinning are not part of this unit. Water is used only for steam irons and housekeeping.',
  },
  step1: {
    unitName: 'Sri Lakshmi Readymade Garments',
    clusterName: 'Sri Lakshmi Readymade Garments',
    district: 'Guntur',
    location: 'D.No. 12-4-18, Brodipet, Guntur',
    natureOfBusiness: 'Readymade cotton garment manufacturing',
    majorProducts: 'Cotton shirts, cotton kurtas, school uniforms',
  },
  step2: {
    sectorType: 'Textiles — readymade garments',
    sectorDescription:
      'The unit will stitch purchased cotton fabric into shirts, kurtas and school uniforms for retailers and school suppliers in Guntur district. It is a small new manufacturing workshop, not a trading counter and not a spinning or dyeing mill.',
  },
  step3: {
    geography:
      'The workshop is on a commercial lane in Brodipet, Guntur, about 2 km from Guntur railway station and on the city bus route toward Vijayawada. Fabric merchants in Patnam Bazar and buyers in Guntur and Vijayawada are within a short road trip. Power and municipal water are available on the street.',
  },
  step4: {
    presentActivities:
      'The unit is not yet in production. The promoter currently helps in a family cloth shop and will shift to full-time supervision once the machines are installed. Commercial stitching is proposed to start in November 2026.',
    yearOfEstablishment: 'Proposed commencement November 2026',
    technologyLevel: 'Industrial single-needle, overlock and button machines with manual cutting',
    productionCapacity: '80 garments per day at full capacity',
    productMix: [
      { name: 'Cotton shirts', sharePercent: 40, sellingPrice: 450 },
      { name: 'Cotton kurtas', sharePercent: 35, sellingPrice: 650 },
      { name: 'School uniforms', sharePercent: 25, sellingPrice: 380 },
    ],
    loomCount: 12,
    shifts: 1,
  },
  step6: {
    targetMarket:
      'School-uniform suppliers, neighbourhood garment retailers in Guntur, and two wholesale traders who supply Vijayawada. No export is proposed in the first three years.',
    existingDemand:
      'Local school suppliers place two bulk orders a year, before June and December. Retailers take weekly lots of shirts and kurtas. The promoter already has enquiry letters from two uniform contractors and one Brodipet retailer.',
  },
  step10: {
    name: 'Sri Lakshmi Readymade Garments workshop',
    landDetails: 'Leased first-floor workshop. Five-year lease with a two-year lock-in. Landlord: K. Srinivasa Rao, Brodipet, Guntur.',
    workshopAreaSqft: 1800,
    productionAreaSqft: 1200,
    storageAreaSqft: 350,
    officeAreaSqft: 250,
    leaseYears: 5,
    waterAndEffluent:
      'About 200 litres a day for steam irons, drinking and floor washing. No dyeing and no process effluent. Domestic wastewater goes to the municipal drain.',
  },
  step11: {
    spvName: 'Sri Lakshmi Readymade Garments',
    legalStatus: 'Proprietorship',
    address: 'D.No. 4-12-7, Arundelpet, Guntur, Andhra Pradesh',
    promoters: [
      {
        name: 'Smt. Anitha Reddy',
        relationName: 'W/o K. Ramesh Reddy',
        age: '34',
        dob: '1992-04-18',
        education: 'B.Com., Acharya Nagarjuna University',
        experienceYears: '6',
        phone: '9848012345',
        address: 'D.No. 4-12-7, Arundelpet, Guntur',
      },
    ],
  },
  step12: {
    land: 0,
    building: 4.5,
    machinery: 18.4,
    furniture: 1.6,
    securityDeposits: 2.0,
    utilitiesAndInfrastructure: 1.4,
    preliminaryAndPreOperative: 1.2,
    workingCapitalMargin: 13.1,
    wcRawStock: 6.5,
    wcWip: 1.8,
    wcFinished: 3.2,
    wcReceivables: 4.0,
    wcSupplierCredit: 3.2,
    wcCash: 0.8,
    costPhasing: {
      land: { incurred: 0, proposed: 0 },
      building: { incurred: 0, proposed: 4.5 },
      machinery: { incurred: 0, proposed: 18.4 },
      furniture: { incurred: 0, proposed: 1.6 },
      deposits: { incurred: 0, proposed: 2.0 },
      workingCapital: { incurred: 0, proposed: 13.1 },
    },
    machineryItems: [
      { description: 'Single-needle lockstitch machines', condition: 'new', supplier: 'Juki dealer, Vijayawada', quantity: 8, unitCost: 0.42, gst: 0.08, transport: 0.02, installation: 0.01, lifeYears: 10, annualMaintenance: 0.04 },
      { description: 'Overlock machines', condition: 'new', supplier: 'Juki dealer, Vijayawada', quantity: 2, unitCost: 0.65, gst: 0.12, transport: 0.02, installation: 0.02, lifeYears: 10, annualMaintenance: 0.05 },
      { description: 'Button-hole and button-stitch set', condition: 'new', supplier: 'Jack Machines, Guntur', quantity: 1, unitCost: 0.85, gst: 0.15, transport: 0.02, installation: 0.03, lifeYears: 10, annualMaintenance: 0.04 },
      { description: 'Cutting table with straight knife', condition: 'new', supplier: 'Local fabricator, Guntur', quantity: 1, unitCost: 0.55, gst: 0.1, transport: 0.02, installation: 0.02, lifeYears: 12, annualMaintenance: 0.02 },
      { description: 'Steam irons and vacuum table', condition: 'new', supplier: 'Naomoto stockist, Hyderabad', quantity: 2, unitCost: 0.35, gst: 0.06, transport: 0.02, installation: 0.02, lifeYears: 8, annualMaintenance: 0.03 },
      { description: 'Generator 15 kVA', condition: 'new', supplier: 'Kirloskar dealer, Guntur', quantity: 1, unitCost: 2.4, gst: 0.43, transport: 0.05, installation: 0.08, lifeYears: 15, annualMaintenance: 0.12 },
    ],
  },
  step13: {
    spvContribution: 6.3,
    governmentGrant: 0,
    bankLoan: 35.9,
    otherSources: 0,
    cashCreditLimit: 8,
    bankName: 'Union Bank of India, Brodipet branch, Guntur',
    interestRate: 11,
    moratoriumMonths: 6,
    loanTenureMonths: 84,
    subsidyPercent: 25,
  },
  step14: {
    rawMaterialCost: 27.8,
    powerCost: 1.8,
    wages: 14.4,
    maintenance: 1.2,
    administrativeExpenses: 2.4,
    marketingExpenses: 0.6,
    annualProductionVolume: 13200,
    annualSalesRealization: 66.3,
    capacityPerDay: 80,
    workingDays: 300,
    capacityUtilisation: 55,
    sellingPricePerUnit: 502,
    monthlyRent: 30000,
    monthlySalaries: 68000,
    monthlyPower: 15000,
    annualExpenseGrowth: 5,
    rawMaterialItems: [
      { name: 'Cotton shirting and suiting', use: 'Shirts and uniforms', basis: 'Weekly lots from Patnam Bazar merchants' },
      { name: 'Kurta cotton and lining', use: 'Kurtas', basis: 'Fortnightly purchase against confirmed orders' },
      { name: 'Thread, buttons, labels, packing', use: 'Stitching and packing', basis: 'Monthly consumable stock' },
    ],
    staffRoles: [
      { role: 'Production supervisor', count: 1, monthlyPay: 22000 },
      { role: 'Tailors', count: 10, monthlyPay: 12000 },
      { role: 'Helpers and pressers', count: 4, monthlyPay: 9000 },
      { role: 'Accounts and dispatch', count: 1, monthlyPay: 15000 },
    ],
    utilisationByYear: [
      { label: '2026-2027', percent: 55 },
      { label: '2027-2028', percent: 65 },
      { label: '2028-2029', percent: 75 },
      { label: '2029-2030', percent: 80 },
      { label: '2030-2031', percent: 85 },
      { label: '2031-2032', percent: 90 },
      { label: '2032-2033', percent: 90 },
      { label: '2033-2034', percent: 90 },
    ],
  },
  step15: {
    breakEvenPoint: 42,
    yearProjections: [...previous, ...projectedRows],
  },
  step16: {
    startDate: '2026-11-01',
    milestones: [
      { activity: 'Loan appraisal and lease registration', timeRequired: '30 days', startDate: '2026-07-01', endDate: '2026-07-31' },
      { activity: 'Workshop flooring, electrical work and machine order', timeRequired: '45 days', startDate: '2026-08-01', endDate: '2026-09-15' },
      { activity: 'Installation, trial stitching and staff joining', timeRequired: '30 days', startDate: '2026-09-16', endDate: '2026-10-15' },
      { activity: 'First school-uniform and retail lots', timeRequired: '15 days', startDate: '2026-10-16', endDate: '2026-11-01' },
    ],
    risks: [
      { risk: 'Cotton fabric price rise', mitigation: 'Buy against confirmed orders and keep two merchants.' },
      { risk: 'Tailors leaving before the school season', mitigation: 'Keep a standby list of four tailors and pay piece-rate on urgent lots.' },
      { risk: 'Slow payment from uniform contractors', mitigation: 'Cap credit at 30 days and take an advance on bulk orders.' },
      { risk: 'Machine downtime in peak months', mitigation: 'Annual service contract and a spare single-needle machine.' },
    ],
  },
  step18: {
    udyamCertificate: { status: 'uploaded', originalName: 'udyam-application-sri-lakshmi.pdf' },
    machineryQuotations: { status: 'uploaded', originalName: 'juki-jack-quotations.pdf' },
    apDomicileProof: { status: 'uploaded', originalName: 'aadhaar-anitha-reddy.pdf' },
    bankPassbook: { status: 'uploaded', originalName: 'union-bank-passbook.pdf' },
    educationCertificate: { status: 'uploaded', originalName: 'bcom-certificate.pdf' },
    edpCertificate: { status: 'uploaded', originalName: 'edp-dic-guntur.pdf' },
    premisesLease: { status: 'uploaded', originalName: 'brodipet-lease-deed.pdf' },
    rawMaterialQuotations: { status: 'uploaded', originalName: 'fabric-rate-sheet.pdf' },
    dealerEnquiries: { status: 'uploaded', originalName: 'uniform-contractor-enquiries.pdf' },
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
  const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' } });
  await browser.close();
  const outDir = path.resolve(__dirname, '../../docs/schemes/AP_CMEP');
  const outFile = path.join(outDir, 'sri-lakshmi-garments-cmep-test.pdf');
  fs.writeFileSync(outFile, pdf);
  console.log(`Wrote ${outFile} (${pdf.length} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
