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
      'Sri Godavari Areca Plates is a proposed new manufacturing unit at D.No. 2-41, Kadiyam village, East Godavari, for pressed areca-leaf meal plates, bowls and compartment plates. Smt. K. Padmavathi, aged 36, wife of K. Srinivas, a Kadiyam resident with a B.Sc. in Home Science and four years as a supervisor in a leaf-plate unit, will own and run it as a proprietorship. The activity is manufacturing. The promoter is a woman, which is the booster category claimed. She is an Andhra Pradesh domicile. The unit is rural. EDP training at the DIC is complete. She has not taken this subsidy before, and no other person in the family has taken it. The workplace is a leased village shed with a drying yard, on a five-year lease with a two-year lock-in, from Sri G. Narasimha Rao of Kadiyam. The project cost is ₹33.71 lakh. Land is not purchased. Building work is ₹5.50 lakh, machinery including GST, transport and installation is ₹15.31 lakh, furniture ₹0.90 lakh, security deposits ₹1.40 lakh, utilities ₹1.20 lakh, preliminary expenses ₹0.80 lakh and working capital ₹8.60 lakh. The promoter brings ₹3.37 lakh. Indian Bank, Rajamahendravaram main branch, is proposed for a term loan of ₹30.34 lakh at 11 percent a year, with a moratorium of 6 months and a tenure of 84 months. A cash-credit limit of ₹5 lakh is proposed beside the term loan. Own funds and the term loan add up to ₹33.71 lakh. The subsidy rate entered is 25 percent. It is back-ended and is not counted in the opening means of finance. Four hydraulic presses, with cutters, a dryer, a pulveriser, a packing sealer and a 20 kVA generator, can make about 8,000 plates a day on one shift for 300 days. Year-1 utilisation is 50 percent because commercial pressing starts on 1 December 2026, part way through the year. Utilisation is taken to rise to 85 percent by 2031-32. First-year sales are ₹71.70 lakh on about 12 lakh pieces. Buyers are hotel suppliers and function caterers in Rajamahendravaram and Kakinada, and two temple-meal contractors. No export is proposed in the first three years.',
    processOfManufacture:
      'Fallen areca sheaths are bought in weekly lots from gardens in Kadiyam and the nearby nursery belt. They are not plucked green. The lots are checked for holes and fungus, soaked, washed and trimmed on two cutting machines. Sound sheaths are hot-pressed on four hydraulic dies into 10-inch meal plates, 6-inch bowls and three-compartment plates. The product mix is 55 percent meal plates at ₹6, 25 percent bowls at ₹3.50 and 20 percent compartment plates at ₹9. Each piece is dried in the hot-air dryer, checked for cracks and packed in bundles of 100 on the sealing machine. A cracked plate is not repaired with plastic film. Rejected leaf is pulverised and sold as nursery mulch. That side sale is not added to the ₹71.70 lakh plate sales. There is no lamination, no dye and no printing. Wash water, about 800 litres a day, goes to a lined settling pit and is reused on the landlord coconut garden. Domestic wastewater goes to a soak pit. The normal power source is the rural three-phase line on the street. A 20 kVA generator covers two presses and the dryer when the line fails, which matters in the marriage-season weeks when caterers will not wait. One shift is proposed. Four press operators, six washing helpers, two packers and one supervisor are the shop-floor staff. At full capacity the four presses can finish about 8,000 plates a day. Year 1 uses half of that because the start date is 1 December 2026. Dies are changed when the order moves from meal plates to bowls or compartment plates. One spare die is to be kept so a damaged die does not stop a weekend function order. Sheaths are stored dry for about six weeks so a monsoon gap in garden supply does not stop the presses.',
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
      'The sector is agro-based manufacturing. Fallen areca sheaths, which gardens otherwise burn or leave as waste, are pressed into disposable meal plates and bowls. The buyers are hotels, canteens and function caterers in Rajamahendravaram and Kakinada, and two temple-meal contractors. The unit is a new rural shed. It does not make plastic plates, it does not laminate leaf with a plastic film, and it does not buy finished plates from another district for resale. Capacity is 8,000 plates a day on four hydraulic presses, one shift, 300 days. The first-year volume of 12 lakh pieces is 50 percent of that capacity, and sales are ₹71.70 lakh. Raw material, mainly sheaths, is ₹40 lakh. Wages are ₹15.80 lakh for the supervisor, four operators, six helpers and two packers. Power is ₹2.60 lakh because of the dryer and the presses. Rent of the shed is ₹15,000 a month. Furniture is only ₹0.90 lakh. The machinery total of ₹15.31 lakh includes GST, transport and installation on the presses, cutters, dryer, pulveriser, sealer and generator. Working capital of ₹8.60 lakh is built from raw stock ₹4.20 lakh, work in progress ₹0.60 lakh, finished goods ₹1.80 lakh, receivables ₹2.60 lakh and cash ₹0.50 lakh, less supplier credit of ₹1.10 lakh. This is a single new unit of a woman proprietor, with a bank term loan, which is the CMEP pattern. The 25 percent subsidy is recorded as the rate claimed and is kept out of the opening means because it is back-ended.',
  },
  step3: {
    geography:
      'The shed is in Kadiyam village, East Godavari, about 12 kilometres from Rajamahendravaram railway station, on the road that runs into the nursery belt. Areca and coconut gardens in and around Kadiyam are the sheath source, so the raw material does not come by lorry from another state. A weekly tempo round is enough. Buyers in Rajamahendravaram are a short trip. Kakinada is a longer but regular tempo run for caterers who take marriage-season lots. A rural three-phase line already serves the street. The promoter lives at D.No. 1-88 in the same village, so the shed at D.No. 2-41 can be supervised without a town commute. The site is a village shed, not a municipal industrial estate, and the area is therefore taken as rural. Indian Bank, Rajamahendravaram main branch, is the proposed lender and can visit the shed in a day. DIC East Godavari is the office for the EDP certificate already completed. There is no export corridor in the plan. The catchment for three years is the Godavari towns that already use disposable plates for hotels, temple meals and functions. Garden supply is the location advantage. A unit in a town without sheaths would buy dried leaf at a higher rate and would hold more stock. Here the six-week dry stock in the 450 square foot store is a buffer, not the whole raw-material policy.',
  },
  step4: {
    presentActivities:
      'The unit is not in production. Smt. K. Padmavathi currently supervises pressing at another leaf-plate unit in Kadiyam. That employment is the four years of experience shown in the promoter table. She will leave it after her own machines are installed. She does not own that unit and this application is not an expansion of it. There are no past sales, which is why the three previous financial years in the projection are zeros and only the eight years from 2026-27 are estimates. Commercial pressing is proposed from 1 December 2026. Loan appraisal and lease registration are planned for August 2026, shed floor and electrical work and the press order through mid-October, installation and trial pressing with staff joining by mid-November, and the first caterer lots for the marriage season by 1 December. Until sanction she remains a supervisor on wages. The proprietorship name is Sri Godavari Areca Plates. The correspondence address is her house at D.No. 1-88, Kadiyam. Udyam is an application uploaded with this report, not a registration already in hand. EDP is already complete, so production is not waiting on a training date. Year-1 utilisation of 50 percent is the result of a December start, not of a full twelve months at half speed.',
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
      'The customers are hotel suppliers and function caterers in Rajamahendravaram and Kakinada, and two contractors who supply temple meals. They buy bundles of 100. Meal plates are the largest share, bowls the next, and compartment plates the smallest, matching the 55, 25 and 20 percent mix. No export is proposed in the first three years. No plastic-plate wholesaler is a target, because the product is sold on being free of plastic film. Credit is short. The working rule in the risk table is 21 days, with an advance on marriage-season lots. A cash-credit limit of ₹5 lakh covers the gap between sheath purchase and caterer payment. Prices are ₹6, ₹3.50 and ₹9. The blended realisation supports the ₹71.70 lakh first-year sales at 12 lakh pieces. The promoter knows these buyers from her years as a supervisor. The report treats the enquiry notes from two caterers and one hotel supplier as the evidence of first orders, not as a guaranteed annual contract. Later years raise utilisation from 50 percent to 85 percent and sales from ₹71.70 lakh to ₹121.90 lakh. That rise assumes the same buyer types take a larger weekly lot once the presses are known, not a new export market.',
    existingDemand:
      'Caterers take plates for weekend functions and for the marriage weeks in December and January. Hotels and canteens take a smaller weekly lot through the year. Temple-meal contractors order when there is a festival. The promoter has enquiry notes for the December 2026 marriage season from two caterers and one hotel supplier. Those notes are the reason production is timed to start on 1 December 2026 rather than after the season. Full capacity is 8,000 plates a day. Over 300 days that is 24 lakh pieces. Year 1 takes half, 12 lakh pieces, because only part of the year is in production and the operators are new to these dies. The demand statement is not a district consumption survey. It is the order pattern of hotels, caterers and two temple contractors within a tempo ride of Kadiyam. If the marriage-season enquiries slip, the six-week sheath stock and the 50 percent utilisation still leave room to cut purchases. Break-even sales in the derived sheet should be read against the ₹71.70 lakh, not against the full-capacity figure. From 2027-28 the projection assumes a full year and a step-up in utilisation of about 10 points a year until 85 percent.',
  },
  step10: {
    name: 'Sri Godavari Areca Plates shed',
    landDetails: 'The workplace is a leased village shed with a small drying yard at D.No. 2-41, Kadiyam. The landlord is Sri G. Narasimha Rao of Kadiyam. The lease is five years with a two-year lock-in. The term loan runs 84 months, so the lease will need renewal once during the loan, which is stated here rather than hidden. Land cost is zero. Building and yard work of ₹5.50 lakh covers the press floor, a wash area and a drying yard. It is not a purchase of the plot. Workshop area is 2,200 square feet, of which 1,500 is the production floor, 450 is storage for dry sheaths and packed bundles, and 250 is the office. Rent is ₹15,000 a month and is an operating cost, not part of the ₹5.50 lakh. Security deposits of ₹1.40 lakh cover the lease deposit and the power deposit. The lease deed is uploaded. The promoter will not pay for machinery before sanction. The shed is in the same village as her house at D.No. 1-88, so night storage of dry sheaths can be watched.',
    workshopAreaSqft: 2200,
    productionAreaSqft: 1500,
    storageAreaSqft: 450,
    officeAreaSqft: 250,
    leaseYears: 5,
    waterAndEffluent:
      'Water use is about 800 litres a day to wash sheaths, plus drinking water for the staff and a small quantity for floor washing. There is no dye, no boiler blowdown and no plastic wash. Sheath wash water is collected in a lined settling pit beside the drying yard. After the leaf dust settles, the water is reused on the landlord coconut garden. The pit is part of the ₹5.50 lakh yard work and is not a separate effluent-treatment plant. Domestic wastewater from the office and the wash area goes to a soak pit and not into the garden pit. Sludge from the settling pit is dried and mixed with the pulverised reject leaf that is sold as nursery mulch. In the monsoon the pit must be kept from overflowing onto the press floor. The yard level in the building estimate allows for that. The generator does not use the wash-water system. No consent for a dyeing discharge is required because dyeing is not part of the process. The 800 litre figure is a working estimate for four presses at the year-1 load. At 85 percent utilisation the wash volume will be higher and the same pit is sized for that in the yard layout, with the garden reuse as the disposal route.',
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
  const outFile = path.join(outDir, 'sri-godavari-areca-plates-cmep-long.pdf');
  fs.writeFileSync(outFile, pdf);
  console.log(`Wrote ${outFile} (${pdf.length} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
