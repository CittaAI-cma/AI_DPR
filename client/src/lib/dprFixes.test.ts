import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { dprDownloadName } from './dprExportName.ts';
import { cardMatchesFilters, schemeKind, schemeLevel } from './schemePickerFilters.ts';
import { isReasonableIsoDate } from './individualDpr/isoDate.ts';
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
