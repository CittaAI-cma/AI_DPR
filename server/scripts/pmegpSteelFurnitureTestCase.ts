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
      'Sri Venkateswara Steel Furniture is a proposed new manufacturing unit on Survey No. 42/2 at Tangutur in Prakasam district. The unit will fabricate school desks with benches, household steel almirahs and window grill sets from purchased mild-steel sections. It will not run a foundry and it will not take structural work for buildings. Sri P. Venkateswara Rao, aged 38, an ITI fitter with nine years on the shop floor of a fabrication unit in Vijayawada, will own and manage the unit as a proprietorship. He has passed class 8 and holds an ITI certificate, which meets the PMEGP education condition for a manufacturing project above ₹10 lakh. The location is rural. The promoter is in the general category. The implementing agency proposed is the State KVIB. The project cost is ₹23.20 lakh. Land is not purchased. A roadside shed of about 2,400 square feet will be taken on a five-year lease from Sri M. Subba Rao of Tangutur, with a two-year lock-in. Building and electrical work is ₹3.20 lakh, machinery ₹12.40 lakh, utilities ₹0.80 lakh, preliminary expenses ₹0.60 lakh and working capital ₹6.20 lakh. The promoter brings ₹2.32 lakh, which is 10 percent. PMEGP margin money for a rural general-category unit is taken at 25 percent, or ₹5.80 lakh, and is shown as the government grant. State Bank of India, Tangutur branch, is proposed for a term loan of ₹15.08 lakh at 11 percent a year, with a moratorium of 6 months and a tenure of 60 months. Own funds, margin money and the term loan add up to the project cost. Installed capacity is six furniture pieces a day on one shift. Year-1 utilisation is 55 percent, so about 990 pieces and sales of ₹47.20 lakh are taken for the first year. Commercial production is proposed from 1 January 2027, after appraisal, shed work and machine installation in the second half of 2026. Seven people will work in the shed: a supervisor, two welders, two helpers, a painter, and the promoter on accounts and school-order follow-up. The first orders expected are school desks for two suppliers in Prakasam and grill work from house builders on the Tangutur–Ongole road. No export is proposed. Quotations for the shear, welding sets, spray booth and oven, the shed estimate, the bank passbook, Aadhaar and PAN, the Udyam application and the education certificate are placed with this report.',
    processOfManufacture:
      'Mild-steel angles, square pipes and CRCA sheets arrive by tempo from Ongole traders and are stored on racks inside the leased shed, off the floor, so monsoon damp does not mark the surface. Each confirmed order is marked on the sheet with the desk size, the almirah height or the grill opening given by the mason. The hydraulic shear cuts the sections to length. Pipes for desk frames and window grills are notched and bent on the pipe-bending machine. Desk frames, almirah carcasses and grill panels are then MIG-welded on simple jigs so the sizes repeat. Welds are ground flush. The piece is degreased, primed and finished in the spray booth, then cured in the powder-coating oven. School desks are fitted with a writing top and packed in sets of ten for the supplier lorry. Almirahs receive shelves, a lock and a paint coat and are wrapped for the Ongole furniture shop. Grill sets are checked against the opening list before dispatch. There is no melting of scrap and no fabrication of building columns or roof trusses. Offcuts are sold each week to the Ongole scrap yard and that recovery is not taken into the sales figure. A 10 kVA panel and stabilizer covers the welding load. The 15 kW three-phase connection on the Tangutur–Ongole road is the normal power source. One shift of about eight hours is proposed for 300 working days. At full capacity the shed can finish six pieces a day. In the first year only 55 percent of that capacity is taken, because the school season is the main desk order and grill work builds slowly. Helpers move material. Welders stay on the jigs. The painter runs the booth and oven. The supervisor checks measurement before paint, because a wrong desk size cannot be corrected after coating.',
    installedCapacity: '6 furniture pieces a day on one shift',
    capacityUtilisationY1: 55,
    powerRequirement: '15 kW, 3-phase',
    pmegpSubsidyPercent: 25,
    pmegpOwnPercent: 10,
    directEmployment: 7,
    indirectEmployment: 4,
    impactNote:
      'The shed will employ seven people directly. One fabrication supervisor, two welders, two helpers and one painter will be on the monthly rolls, and the promoter will handle accounts, bank work and follow-up with the school suppliers. Monthly pay is ₹16,000 for the supervisor, ₹13,000 for each welder, ₹9,000 for each helper and ₹11,000 for the painter, which is ₹8.50 lakh of wages in a full year and matches the operating statement. These are new jobs in Tangutur. The promoter is leaving wage employment in Vijayawada to run the unit, so the household income shifts from a salary to the profit of the proprietorship, which the first-year projection places at ₹5.80 lakh after costs. Paint, primer, locks, packing and tempo hire are bought in Ongole and Tangutur. That trade, together with the scrap buyer and the two school-furniture suppliers, is taken as about four indirect livelihoods. The unit does not displace an existing Tangutur workshop. It adds a small fabrication capacity on a leased shed beside the Ongole road, using a three-phase line that is already on the street. School desks are a seasonal rural demand. A local unit shortens the lead time for the two Prakasam suppliers who now bring desks from larger towns. House builders in Tangutur and Singarayakonda can order grills without a trip to Ongole for every opening. The working-capital limit of ₹6.20 lakh is meant to hold steel against those confirmed orders rather than to stock a showroom. If the June desk season is missed, utilisation in year 1 would fall below 55 percent and the ₹5.80 lakh profit would shrink. The moratorium of six months is set so the first instalments fall after the January 2027 start and the first school orders. Margin money of ₹5.80 lakh remains the PMEGP subsidy element and is not cash in the promoter hand on day one.',
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
      'The activity is light engineering, limited to steel furniture and window grills. The shed will buy CRCA sheet, mild-steel angle and square pipe, cut and weld them, and paint the finished piece. The products are a school desk with bench, a household steel almirah and a window grill set. Buyers are school-furniture suppliers and house builders in Prakasam district, plus one furniture shop in Ongole. The unit is a new rural manufacturing workshop. It is not a trading counter that buys finished furniture and resells it, and it is not a structural yard for sheds and roof frames. Installed capacity is six pieces a day. The product mix used for pricing is 55 percent desks at ₹4,200, 25 percent almirahs at ₹7,600 and 20 percent grill sets at ₹2,800. That mix gives a blended price near ₹4,770. At 55 percent utilisation and 300 working days the first-year volume is about 990 pieces and sales are ₹47.20 lakh. Raw material at ₹26 lakh is the largest cost, which is why steel is bought against confirmed orders and not held for a full season. Power is ₹1.40 lakh, wages ₹8.50 lakh, maintenance ₹0.50 lakh, administration ₹1 lakh and marketing ₹0.40 lakh. The same pattern, with utilisation rising from 55 percent to 90 percent, is carried into the five-year sales table. Machinery of ₹12.40 lakh covers the shear, two MIG sets, the pipe bender, drills and grinders, the spray booth, the powder-coating oven, hand tools and the 10 kVA panel. Those machines are new and are supported by quotations. The sector choice fits PMEGP manufacturing: the project is a single new unit, the cost is ₹23.20 lakh and so sits under the usual manufacturing ceiling, and the promoter is an experienced fitter rather than a first-time trader.',
  },
  step3: {
    geography:
      'The shed stands on the Tangutur–Ongole road, about 18 kilometres from Ongole town, on Survey No. 42/2 in Tangutur village, Prakasam district. Steel traders in Ongole can deliver sheet and pipe by tempo in a morning. The two school-furniture suppliers who have given enquiry notes cover government and private schools across the district and collect desks from the shed rather than from a workshop in a larger city. House builders in Tangutur and Singarayakonda are the grill customers. They are on the same road, so a wrong opening can be remeasured the same day. One furniture shop in Ongole is the outlet for almirahs. A rural three-phase line already runs along the road and 15 kW is the load applied for. The promoter will live at D.No. 3-18, Tangutur village and post, so supervision does not depend on a daily bus from Ongole. The site is not inside an industrial estate. It is a leased roadside shed in a village, which is the rural classification used for the 25 percent margin money. Rainwater drainage along the road is adequate for a fabrication shed that does not use process water. The nearest bank branch proposed for the term loan is State Bank of India at Tangutur, which can inspect the shed without an overnight trip. KVIB forwarding is from the district office at Ongole. No port and no export route is relevant. The market catchment for the first three years is Prakasam district only.',
  },
  step4: {
    presentActivities:
      'The unit is not in production. There is no existing machinery, no Udyam registration yet beyond the application placed with this report, and no sales history. Sri P. Venkateswara Rao is at present a fitter in a fabrication shop in Vijayawada. He will shift to Tangutur after the loan is sanctioned and the machines are ordered. The nine years in that shop are the technical base: shearing, MIG welding, grinding and a working knowledge of paint finish. He has not owned a unit before, so this application is for a new proprietorship and not for an upgrade of an existing PMEGP unit. Commercial production is proposed from 1 January 2027. The months before that are appraisal and KVIB forwarding in August and September 2026, shed flooring and the three-phase connection with the machine order through October 2026, and installation, trial welding and staff joining in November 2026. The first school-desk lot is planned in December 2026 so that deliveries can start with the January commencement. Until sanction, the promoter will not resign from the Vijayawada shop. The lease is to be registered in his name as proprietor of Sri Venkateswara Steel Furniture. No family member is shown as a partner. Year-wise sales in the projection start at ₹47.20 lakh and rise to ₹77.30 lakh by year 5 as utilisation moves from 55 percent to 90 percent. Previous years are not shown because there is no existing unit.',
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
      'The buyers are local and named in kind, not a general statewide tender. Two school-furniture suppliers who cover government and private schools in Prakasam district will take desks with benches. They place the bulk of their orders before the June reopening and a smaller lot before the second term. House builders in Tangutur and Singarayakonda will order window grill sets through the year, measured to the opening. One furniture shop in Ongole will take steel almirahs for household sale. The product mix follows that buyer list: 55 percent desks, 25 percent almirahs and 20 percent grills. No showroom is proposed at the shed. No export, no government e-marketplace registration and no inter-state depot is taken in the first five years. Prices used in the report are ₹4,200 for a desk with bench, ₹7,600 for an almirah and ₹2,800 for a grill set. Credit to the school suppliers is the main collection risk. The working-capital figure assumes steel is bought against a confirmed order and that the supplier pays inside the season. The Ongole shop is expected to pay on delivery or within a short bill. The promoter already knows these buyers from his years in fabrication. The report does not treat that acquaintance as a signed order, except the enquiry notes for about 400 desks in the first school season.',
    existingDemand:
      'Demand for school desks in Prakasam is seasonal. Suppliers book frames before June and again before the later term. A lot of about 400 desks in the first season, which the two suppliers have noted in enquiries, is 400 of the 990 pieces taken for year 1. The balance is almirahs and grills spread over the year. House building along the Tangutur–Ongole road and in Singarayakonda produces a steady grill enquiry. It is not a single contract. The Ongole furniture shop sells a small number of almirahs each month. At full capacity the shed can make six pieces a day, or about 1,800 pieces in 300 days. Year 1 uses only 55 percent of that, which is deliberate. The promoter will still be leaving wage work, the painters and welders will be new to this shed, and the first school season should not be planned at full load. Later years in the projection step utilisation up to 70, 80, 85 and 90 percent, and sales move from ₹47.20 lakh to ₹77.30 lakh. There is no claim of a district-wide shortage figure. The demand stated here is the order book the promoter can see: two suppliers, local builders and one shop. If the 400-desk enquiry is delayed, year-1 sales would fall and the break-even capacity of 48 percent would be the level to watch.',
  },
  step10: {
    name: 'Sri Venkateswara Steel Furniture shed',
    landDetails:
      'The workplace is a leased roadside shed of about 2,400 square feet on Survey No. 42/2, Tangutur, Prakasam district. The landlord is Sri M. Subba Rao of Tangutur. The lease proposed is five years with a two-year lock-in, so the term loan of 60 months is covered by the lease. Land cost in the project is zero because the land is not purchased. Building and shed work of ₹3.20 lakh is for flooring, a welding bay, a small paint room and the electrical points for 15 kW. It is not a new multi-storey structure. A building estimate is uploaded with the machinery quotations. Power is a 15 kW three-phase connection from the line already on the Tangutur–Ongole road. Water use is only for drinking and for washing hands after grinding. There is no plating bath and no process effluent. The shed estimate and the lease are the premises papers. The promoter will not start civil work before sanction. Rent is not capitalised. It will be paid from the operating account after commencement and is not added again on top of the ₹3.20 lakh shed work. The address for correspondence is D.No. 3-18, Tangutur village and post. The shed address and the residence are different, which is normal for a leased workshop in the same village.',
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
  const outFile = path.join(outDir, 'sri-venkateswara-steel-furniture-pmegp-long.pdf');
  fs.writeFileSync(outFile, pdf);
  console.log(`Wrote ${outFile} (${pdf.length} bytes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
