import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isEnteredDocRow, isEnteredDocText } from './individualDpr/docEntries.ts';
import { dprDownloadName } from './dprExportName.ts';
import { patchFromDocEdit } from './individualDpr/liveDocEdit.ts';
import { cardMatchesFilters, schemeKind, schemeLevel } from './schemePickerFilters.ts';
import { isReasonableIsoDate } from './individualDpr/isoDate.ts';
import { sanitizeOwnerTags, toggleOwner } from './ventureMatch/ownerSelection.ts';
import { analyzeCombinations, relationBetween } from './ventureMatch/combos.ts';
import { groundCostSuggestion } from './individualDpr/costSuggestionGuard.ts';
import {
  acceptByKind,
  buildFactsCard,
  costFigureFits,
  fieldIsFilled,
  machineryCostsFit,
  splitUnfilledFields,
  yearToIsoDate,
} from './individualDpr/stepSuggestionCheck.ts';
import {
  applySectionOrder,
  contrastOk,
  defaultStyleForScheme,
  insertPicture,
  addCustomSection,
  addSectionBlock,
  layoutOrder,
  moveSection,
  selectionStepOrder,
  pageEdgeMm,
  resizeImageBox,
  resolveDocumentStyle,
  setImageWidth,
  shiftForPageEdge,
} from './individualDpr/documentStyle.ts';

describe('report entries', () => {
  it('keeps a filled answer and drops a blank, a dash, and a zero', () => {
    assert.equal(isEnteredDocText('Visakhapatnam'), true);
    assert.equal(isEnteredDocText(''), false);
    assert.equal(isEnteredDocText('—'), false);
    assert.equal(isEnteredDocText('0'), false);
    assert.equal(isEnteredDocRow(['Year 1', '', '0', '12'], [0]), true);
    assert.equal(isEnteredDocRow(['Land', '0', '0', '0'], [0]), false);
    assert.equal(isEnteredDocRow(['', '0', '0']), false);
  });
});

describe('dpr download name', () => {
  it('uses scheme, project, short language, and DDMMYY', () => {
    const name = dprDownloadName({
      schemeCode: 'AP_CMEP',
      projectName: 'Kavya Silks',
      language: 'english',
      date: new Date(2026, 1, 1),
      ext: 'pdf',
    });
    assert.equal(name, 'AP_CMEP_Kavya_Silks_eng_010226.pdf');
  });

  it('shortens Telugu to tel', () => {
    const name = dprDownloadName({
      schemeCode: 'PMEGP',
      projectName: 'Unit',
      language: 'telugu',
      date: new Date(2026, 9, 3),
      ext: 'docx',
    });
    assert.equal(name, 'PMEGP_Unit_tel_031026.docx');
  });
});

describe('scheme card filters', () => {
  const card = {
    level: schemeLevel('State Scheme'),
    kind: schemeKind('Subsidy and incentive'),
    haystack: 'ap cmep garment',
  };

  it('matches any selected level and any selected kind', () => {
    assert.equal(cardMatchesFilters(card, ['state', 'central'], ['subsidy', 'loan'], ''), true);
    assert.equal(cardMatchesFilters(card, ['central'], ['subsidy'], ''), false);
    assert.equal(cardMatchesFilters(card, ['state'], ['loan'], ''), false);
  });

  it('treats an empty selection as all', () => {
    assert.equal(cardMatchesFilters(card, [], [], 'garment'), true);
    assert.equal(cardMatchesFilters(card, [], [], 'steel'), false);
  });
});

describe('iso dates', () => {
  it('accepts a real day inside 1990–2100', () => {
    assert.equal(isReasonableIsoDate('2026-04-01'), true);
  });

  it('rejects an impossible day and a year outside the range', () => {
    assert.equal(isReasonableIsoDate('2026-02-31'), false);
    assert.equal(isReasonableIsoDate('1989-01-01'), false);
  });
});

describe('cost suggestions', () => {
  it('returns 0 when earlier steps state no amount', () => {
    assert.equal(groundCostSuggestion('machinery', '42', { step1: { unitName: 'Loom' } }), '0');
  });

  it('keeps a figure when earlier steps already state one', () => {
    assert.equal(
      groundCostSuggestion('machinery', '12', { step12: { machinery: 12 } }),
      '12'
    );
  });
});

describe('step suggestion batch', () => {
  const emptyFacts = { unitName: '', district: '', location: '', products: '', amounts: {} };

  it('keeps filled answers out of the batch and splits long write-ups', () => {
    const groups = splitUnfilledFields(
      [
        { name: 'sectorType' },
        { name: 'sectorDescription' },
        { name: 'executiveSummary' },
      ],
      { sectorType: 'Manufacturing', sectorDescription: '', executiveSummary: '' }
    );
    assert.deepEqual(groups.short.map((field) => field.name), []);
    assert.deepEqual(groups.long.map((field) => field.name), ['sectorDescription', 'executiveSummary']);
    assert.equal(fieldIsFilled(0), false);
    assert.equal(fieldIsFilled('Cotton yarn'), true);
  });

  it('builds a facts card from earlier steps', () => {
    const card = buildFactsCard({
      step1: { unitName: 'Kavya Silks', district: 'Guntur', location: 'Tenali', majorProducts: 'Sarees' },
      step12: { machinery: 12 },
    });
    assert.equal(card.unitName, 'Kavya Silks');
    assert.equal(card.district, 'Guntur');
    assert.equal(card.products, 'Sarees');
    assert.equal(card.amounts.machinery, 12);
  });

  it('keeps a cost only when it agrees with amounts already entered', () => {
    assert.equal(acceptByKind('cost', '42', emptyFacts), '0');
    assert.equal(costFigureFits(80, { machinery: 2 }), false);
    assert.equal(acceptByKind('cost', '8', { ...emptyFacts, amounts: { machinery: 2 } }), '8');
    assert.equal(
      machineryCostsFit([{ description: 'Loom', quantity: 1, unitCost: 40 }], { ...emptyFacts, amounts: { machinery: 2 } }),
      false
    );
  });

  it('turns a bare year into a start date', () => {
    assert.equal(yearToIsoDate('2019'), '2019-01-01');
    assert.equal(yearToIsoDate('started in 2023'), '2023-01-01');
    assert.equal(yearToIsoDate(''), '');
  });

  it('rejects a bad date and a short essay', () => {
    assert.equal(acceptByKind('date', '2026-02-31', emptyFacts), null);
    assert.equal(acceptByKind('date', '2026-04-01', emptyFacts), '2026-04-01');
    assert.equal(acceptByKind('prose', 'Too short.', emptyFacts), null);
  });
});

describe('custom sections', () => {
  it('adds a section and keeps a text block and an image inside it', () => {
    const steps = [{ id: 'a' }, { id: 'b' }];
    let style = defaultStyleForScheme('PMFME');
    style = addCustomSection(style, steps, 'Site photos', 'csec_site');
    assert.ok(layoutOrder(steps, style).includes('csec_site'));
    style = addSectionBlock(style, 'a', { id: 'blk_note', kind: 'text', text: 'Hello from the section' });
    style = addSectionBlock(style, 'csec_site', {
      id: 'blk_pic',
      kind: 'image',
      name: 'Front',
      src: 'data:image/png;base64,aaaa',
      hidden: false,
      frame: { w: 80, h: 0, x: 0, y: 0 },
    });
    const saved = resolveDocumentStyle(style, 'PMFME');
    assert.equal(saved.customSections[0].title, 'Site photos');
    assert.equal(saved.sectionBlocks.a[0].text, 'Hello from the section');
    assert.equal(saved.sectionBlocks.csec_site[0].name, 'Front');
    assert.ok(layoutOrder(steps, saved).includes('csec_site'));
  });
});

describe('live document typing', () => {
  it('writes a cover field and a table cell back onto the draft', () => {
    const unit = patchFromDocEdit({ step1: {} }, 'step1.unitName', 'Screen Test Unit');
    assert.equal(unit?.stepData?.unitName, 'Screen Test Unit');
    assert.equal(unit?.stepData?.clusterName, 'Screen Test Unit');
    const same = patchFromDocEdit({ step1: { unitName: 'Screen Test Unit', clusterName: 'Screen Test Unit' } }, 'step1.unitName', 'Screen Test Unit');
    assert.equal(same, null);
    const row = patchFromDocEdit({ step14: { staffRoles: [{ role: 'Helper', count: 1 }] } }, 'step14.staffRoles[0].count', '3');
    assert.equal(row?.stepData?.staffRoles[0].count, 3);
    assert.equal(row?.stepData?.staffRoles[0].role, 'Helper');
  });
});

describe('report style', () => {
  it('starts PMEGP from its preset and other schemes from the government look', () => {
    assert.equal(defaultStyleForScheme('PMEGP').preset, 'pmegp');
    assert.equal(defaultStyleForScheme('AP_CMEP').preset, 'apCmep');
    assert.equal(defaultStyleForScheme('PMFME').preset, 'government');
  });

  it('keeps a half-saved style on the preset', () => {
    const style = resolveDocumentStyle({ colors: { header: '#111827' } }, 'PMEGP');
    assert.equal(style.colors.header, '#111827');
    assert.equal(style.colors.primary, defaultStyleForScheme('PMEGP').colors.primary);
    assert.equal(style.watermark, 'Confidential — for lending appraisal');
  });

  it('moves a section with its place in the print order and can hide it', () => {
    const steps = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const order = moveSection([], steps, 'c', 'a');
    assert.deepEqual(order, ['c', 'a', 'b']);
    const visible = applySectionOrder(steps, { sectionOrder: order, hiddenSectionIds: ['a'] });
    assert.deepEqual(visible.map((step) => step.id), ['c', 'b']);
  });

  it('drops a section after the row under the pointer and reorders step selection', () => {
    const steps = [
      { id: 'a', n: 1 },
      { id: 'b', n: 2 },
      { id: 'c', n: 3 },
    ];
    const order = moveSection(['a', 'b', 'c'], steps, 'a', 'b', 'after');
    assert.deepEqual(order, ['b', 'a', 'c']);
    assert.deepEqual(selectionStepOrder(steps, order, [1, 2, 3]), [2, 1, 3]);
    assert.deepEqual(selectionStepOrder(steps, ['pic:shop', 'c', 'a', 'b'], [1, 2, 3]), [3, 1, 2]);
  });

  it('rejects a color that would hide the text', () => {
    assert.equal(contrastOk('#ffffff', '#ffffff'), false);
    assert.equal(contrastOk('#111827', '#ffffff'), true);
    assert.equal(contrastOk('#ffffff', '#1e3a5f'), true);
  });

  it('keeps a picture width and drops it when the picture is gone', () => {
    const base = defaultStyleForScheme('PMFME');
    const tiny = 'data:image/png;base64,aaaa';
    const sized = setImageWidth({ ...base, images: { ...base.images, cover: tiny } }, 'cover', 40);
    assert.equal(sized.imageWidths.cover, 40);
    const kept = resolveDocumentStyle(sized, 'PMFME');
    assert.equal(kept.imageWidths.cover, 40);
    const cleared = resolveDocumentStyle({ ...sized, images: { ...sized.images, cover: '' } }, 'PMFME');
    assert.equal(cleared.images.cover, '');
    assert.equal(cleared.imageWidths.cover, 100);
    const start = { w: 80, h: 40, x: 10, y: 6 };
    const fromLeft = resizeImageBox(start, 'w', 10, 0);
    assert.equal(fromLeft.x + fromLeft.w, start.x + start.w);
    const fromTop = resizeImageBox(start, 'n', 0, 8);
    assert.equal(fromTop.y + fromTop.h, start.y + start.h);
    const corner = resizeImageBox(start, 'se', -10, -4);
    assert.equal(corner.x, start.x);
    assert.equal(corner.y, start.y);
    assert.ok(corner.w < start.w && corner.h < start.h);
    const steps = [{ id: 'a' }, { id: 'b' }];
    const placed = insertPicture(base, steps, {
      id: 'shop',
      name: 'Shop front',
      src: tiny,
      hidden: false,
      place: 'a',
      frame: { w: 100, h: 0, x: 0, y: 0 },
    });
    assert.deepEqual(layoutOrder(steps, placed), ['a', 'pic:shop', 'b']);
    const migrated = resolveDocumentStyle({ images: { cover: tiny } }, 'PMFME');
    assert.equal(migrated.pictures[0].place, 'cover');
    assert.equal(migrated.pictures[0].name, 'Cover picture');
  });

  it('keeps a block off the page edge and off the break', () => {
    const page = 1000;
    const edge = 80;
    assert.equal(pageEdgeMm(8), 12);
    assert.equal(pageEdgeMm(16), 16);
    assert.equal(shiftForPageEdge(100, 40, page, edge, edge), 0);
    assert.equal(shiftForPageEdge(20, 40, page, edge, edge), 60);
    assert.equal(shiftForPageEdge(900, 150, page, edge, edge), 180);
    assert.equal(shiftForPageEdge(400, 900, page, edge, edge), 0);
  });
});

describe('live report dropdowns and numbers', () => {
  it('clears the town when a new district does not contain it', () => {
    const moved = patchFromDocEdit({ step1: { district: 'Guntur', location: 'Tenali' } }, 'step1.district', 'Kakinada');
    assert.equal(moved?.stepData?.district, 'Kakinada');
    assert.equal(moved?.stepData?.location, '');
  });

  it('stores typed numbers as numbers and leaves dates as text', () => {
    const year = patchFromDocEdit({ step4: {} }, 'step4.yearOfEstablishment', '2019');
    assert.equal(year?.stepData?.yearOfEstablishment, 2019);
    const date = patchFromDocEdit({ step4: {} }, 'step4.yearOfEstablishment', '2024-05-01');
    assert.equal(date?.stepData?.yearOfEstablishment, '2024-05-01');
  });
});

describe('owner selection groups', () => {
  it('lets only one of SC, ST, BC and General category man be chosen', () => {
    let tags = toggleOwner([], 'sc');
    tags = toggleOwner(tags, 'bc');
    assert.deepEqual(tags, ['bc']);
    tags = toggleOwner(tags, 'generalMale');
    assert.deepEqual(tags, ['generalMale']);
    assert.deepEqual(toggleOwner(tags, 'generalMale'), []);
  });

  it('combines woman, disability, transgender and ex-serviceman with a group choice', () => {
    let tags = toggleOwner([], 'sc');
    tags = toggleOwner(tags, 'female');
    tags = toggleOwner(tags, 'pwd');
    tags = toggleOwner(tags, 'exServiceman');
    assert.deepEqual(new Set(tags), new Set(['sc', 'female', 'pwd', 'exServiceman']));
    tags = toggleOwner(tags, 'st');
    assert.deepEqual(new Set(tags), new Set(['st', 'female', 'pwd', 'exServiceman']));
  });

  it('keeps not decided, no 51% and not sure on their own', () => {
    assert.deepEqual(toggleOwner(['sc', 'female'], 'notSure'), ['notSure']);
    assert.deepEqual(toggleOwner(['notSure'], 'female'), ['female']);
    assert.deepEqual(sanitizeOwnerTags(['sc', 'st', 'pwd']), ['sc', 'pwd']);
    assert.deepEqual(sanitizeOwnerTags(['female', 'noMajority']), ['noMajority']);
  });
});

describe('scheme combinations', () => {
  const pick = (...codes: string[]) => codes.map((code) => ({ code, name: code, kind: 'subsidy' as const, benefit: '' }));

  it('rules out the AP incentives that cannot share one investment and keeps the food one for food units', () => {
    const result = analyzeCombinations(pick('AP_EDP', 'AP_FPP', 'AP_TECH_UPGRADE'));
    assert.deepEqual(result.core.map((item) => item.scheme.code), ['AP_FPP']);
    assert.deepEqual(new Set(result.leftOut.map((item) => item.scheme.code)), new Set(['AP_EDP', 'AP_TECH_UPGRADE']));
    assert.equal(relationBetween('AP_EDP', 'AP_TECH_UPGRADE')?.type, 'exclusive');
    assert.equal(relationBetween('AP_EDP', 'AP_TECH_UPGRADE')?.source, 'guideline');
  });

  it('keeps PMEGP away from other subsidies and puts the 2nd loan after the first', () => {
    assert.equal(relationBetween('PMEGP', 'PMFME')?.type, 'exclusive');
    assert.equal(relationBetween('PMEGP', 'MUDRA')?.type, 'exclusive');
    const seq = relationBetween('PMEGP', 'PMEGP_2ND');
    assert.equal(seq?.type, 'sequence');
    assert.equal(seq?.first, 'PMEGP');
  });

  it('adds a guarantee on top of a subsidy but not on a loan that is already guaranteed', () => {
    assert.equal(relationBetween('CGTMSE', 'PMEGP')?.type, 'stack');
    assert.equal(relationBetween('CGTMSE', 'MUDRA')?.type, 'overlap');
    const plan = analyzeCombinations(pick('PMEGP', 'CGTMSE', 'ZED', 'MUDRA'));
    assert.deepEqual(plan.core.map((item) => item.scheme.code), ['PMEGP']);
    assert.deepEqual(new Set(plan.addOns.map((item) => item.scheme.code)), new Set(['CGTMSE', 'ZED']));
  });

  it('bars PM Vishwakarma for people who took PMEGP, MUDRA or SVANidhi', () => {
    ['PMEGP', 'MUDRA', 'SVANIDHI'].forEach((code) =>
      assert.equal(relationBetween('VISHWAKARMA', code)?.type, 'exclusive')
    );
  });
});
