import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  AP_DISTRICTS,
  districtSelectOptions,
  isTownInDistrict,
  townsForDistrict,
} from './individualDpr/apDistricts.ts';
import { apTechIndicativeGrantLakhs, apTechSubsidyPercent } from './individualDpr/apTechUpgradeQuestions.ts';
import { cmepProjectionColumns } from './individualDpr/cmepProjections.ts';
import {
  applyPreset,
  contrastOk,
  defaultStyleForScheme,
  insertPicture,
  layoutOrder,
  moveSection,
  pageHeightMm,
  pageWidthMm,
  resolveDocumentStyle,
  resizeImageBox,
} from './individualDpr/documentStyle.ts';
import { getSchemeSteps } from './individualDpr/schemeStepCatalog.ts';
import { isKycUploaded, kycDisplayName } from './privacy/kycField.ts';
import { hasUnder18Applicant } from './privacy/under18.ts';
import { canAccessAdmin, canCreateDpr, isSuperAdmin, toAppRole } from './rbac.ts';

const tiny = 'data:image/png;base64,aaaa';

describe('who can use the app', () => {
  it('maps legacy roles and gates admin and DPR creation', () => {
    assert.equal(toAppRole('admin'), 'super_admin');
    assert.equal(toAppRole('entrepreneur'), 'consultant');
    assert.equal(toAppRole('officer'), 'govt_official');
    assert.equal(isSuperAdmin('admin'), true);
    assert.equal(canAccessAdmin('consultant'), false);
    assert.equal(canAccessAdmin('govt_official'), false);
    assert.equal(canCreateDpr('consultant'), true);
    assert.equal(canCreateDpr('super_admin'), true);
    assert.equal(canCreateDpr('govt_official'), false);
  });
});

describe('scheme step lists', () => {
  it('numbers every scheme from 1 with unique section ids', () => {
    for (const code of [null, 'PMEGP', 'AP_CMEP', 'PMFME', 'SVANIDHI']) {
      const steps = getSchemeSteps(code);
      assert.deepEqual(steps.map((step) => step.n), steps.map((_, index) => index + 1));
      assert.equal(new Set(steps.map((step) => step.id)).size, steps.length);
      assert.ok(steps.every((step) => step.contentStep > 0));
      assert.equal(steps[0].id, 'cover');
      assert.equal(steps.at(-1)?.id, 'uploads');
    }
  });

  it('uses the known step counts', () => {
    assert.equal(getSchemeSteps(null).length, 18);
    assert.equal(getSchemeSteps('PMEGP').length, 14);
    assert.equal(getSchemeSteps('AP_CMEP').length, 13);
    assert.equal(getSchemeSteps('PMFME').length, 14);
    assert.equal(getSchemeSteps('SVANIDHI').length, 11);
  });
});

describe('report style editor', () => {
  it('starts PMEGP and AP CMEP from their own looks', () => {
    assert.equal(defaultStyleForScheme('PMEGP').preset, 'pmegp');
    assert.equal(defaultStyleForScheme('AP_CMEP').preset, 'apCmep');
    assert.equal(defaultStyleForScheme('SVANIDHI').preset, 'government');
  });

  it('keeps pictures and section order when a preset is applied', () => {
    const base = defaultStyleForScheme('PMEGP');
    const withPicture = insertPicture(base, [{ id: 'cover' }, { id: 'location' }], {
      id: 'shop',
      name: 'Shop front',
      src: tiny,
      hidden: false,
      place: 'cover',
      frame: { w: 80, h: 0, x: 0, y: 0 },
    });
    const next = applyPreset(withPicture, 'formal');
    assert.equal(next.preset, 'formal');
    assert.equal(next.pictures[0].name, 'Shop front');
    assert.equal(next.sectionOrder.includes('pic:shop'), true);
  });

  it('places a picture under the chosen section and lets it move', () => {
    const steps = [{ id: 'cover' }, { id: 'location' }, { id: 'uploads' }];
    const placed = insertPicture(defaultStyleForScheme(null), steps, {
      id: 'shop',
      name: 'Shop front',
      src: tiny,
      hidden: false,
      place: 'location',
      frame: { w: 100, h: 0, x: 0, y: 0 },
    });
    assert.deepEqual(layoutOrder(steps, placed), ['cover', 'location', 'pic:shop', 'uploads']);
    const moved = moveSection(placed.sectionOrder, steps, 'pic:shop', 'cover');
    assert.equal(moved[0], 'pic:shop');
  });

  it('hides a picture without deleting it and drops it from a saved style when the file is gone', () => {
    const base = defaultStyleForScheme(null);
    const placed = insertPicture(base, [{ id: 'cover' }], {
      id: 'shop',
      name: 'Shop front',
      src: tiny,
      hidden: true,
      place: 'cover',
      frame: { w: 100, h: 0, x: 0, y: 0 },
    });
    const kept = resolveDocumentStyle(placed, null);
    assert.equal(kept.pictures.length, 1);
    assert.equal(kept.pictures[0].hidden, true);
    const cleared = resolveDocumentStyle({ ...placed, pictures: [{ ...placed.pictures[0], src: '' }] }, null);
    assert.equal(cleared.pictures.length, 0);
  });

  it('resizes from the opposite edge and rejects unreadable colors', () => {
    const start = { w: 80, h: 40, x: 10, y: 6 };
    const fromLeft = resizeImageBox(start, 'w', 10, 0);
    assert.equal(fromLeft.x + fromLeft.w, start.x + start.w);
    const fromTop = resizeImageBox(start, 'n', 0, 8);
    assert.equal(fromTop.y + fromTop.h, start.y + start.h);
    assert.equal(contrastOk('#ffffff', '#ffffff'), false);
    assert.equal(contrastOk('#111827', '#ffffff'), true);
  });

  it('uses the real page sizes', () => {
    assert.deepEqual([pageWidthMm('A4'), pageHeightMm('A4')], [210, 297]);
    assert.deepEqual([pageWidthMm('A3'), pageHeightMm('A3')], [297, 420]);
  });
});

describe('form helpers', () => {
  it('keeps Andhra Pradesh districts and towns together', () => {
    assert.ok(AP_DISTRICTS.includes('Visakhapatnam'));
    assert.ok(townsForDistrict('Visakhapatnam').length > 0);
    assert.deepEqual(townsForDistrict(''), []);
    assert.equal(isTownInDistrict('Visakhapatnam', ''), true);
    assert.equal(isTownInDistrict('Visakhapatnam', 'Not A Real Town'), false);
    assert.equal(districtSelectOptions('Old District')[0], 'Old District');
  });

  it('caps the AP technology upgrade grant', () => {
    assert.equal(apTechSubsidyPercent('micro', 'no'), 20);
    assert.equal(apTechSubsidyPercent('micro', 'yes'), 40);
    assert.equal(apTechIndicativeGrantLakhs(1000, 'micro', 'no'), 20);
    assert.equal(apTechIndicativeGrantLakhs(0, 'small', 'yes'), 0);
  });

  it('builds three past years and eight projected years for CMEP', () => {
    const columns = cmepProjectionColumns(new Date(2026, 5, 1));
    assert.equal(columns.length, 11);
    assert.equal(columns.filter((column) => column.period === 'previous').length, 3);
    assert.equal(columns.filter((column) => column.period === 'projected').length, 8);
    assert.equal(columns[0].label, '2023-2024');
  });

  it('treats a file id as uploaded and a URL as a stored name', () => {
    assert.equal(isKycUploaded(''), false);
    assert.equal(isKycUploaded({ fileId: 'abc', status: 'uploaded' }), true);
    assert.equal(kycDisplayName('https://files.example/aadhaar.jpg'), 'Uploaded');
    assert.equal(kycDisplayName({ originalName: 'aadhaar.pdf' }), 'aadhaar.pdf');
  });

  it('flags an under-18 applicant on the form', () => {
    assert.equal(hasUnder18Applicant({ step1: { entrepreneurAge: 16 } }), true);
    assert.equal(hasUnder18Applicant({ step1: { entrepreneurAge: 21 } }), false);
  });
});
