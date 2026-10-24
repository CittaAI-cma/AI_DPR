// DASH: the dashboard home page: summary numbers match the data, every card, step and shortcut opens the right place, and deleting asks first.
import { before, after, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { launch, openPage, go, requireStack, api, signIn, clickText, bodyText, waitFor, sleep, unique, dbClose, horizontalOverflow } from '../lib/harness.mjs';

let browser;
before(async () => { await requireStack(); browser = await launch(); });
after(async () => { await browser?.close(); await dbClose(); });

const pathOf = (page) => { const u = new URL(page.url()); return u.pathname + u.search; };
const draft = (name) => ({ clusterData: { step1: { unitName: name, location: 'Guntur', district: 'Guntur' }, isIndividualDPR: true } });

/** A person with exactly one draft, so the numbers and the recent list are easy to check. */
async function newPerson() {
  const email = `${unique('dash')}@msme.test`;
  const made = await api('POST', '/auth/register', { name: 'QA Dash', email, password: 'Qa-Test-2026!', phoneNumber: '9876543210', dateOfBirth: '1990-01-01', accountConsent: true, privacyConsent: true });
  assert.equal(made.status, 201, JSON.stringify(made.body));
  return { token: made.body.data.token, email };
}
async function openAs(token, user, opts = {}) {
  const page = await openPage(browser, opts);
  await page.evaluateOnNewDocument((state) => {
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: state.user, token: state.token, isAuthenticated: true }, version: 0 }));
    localStorage.setItem('token', state.token);
  }, { token, user });
  return page;
}

describe('dashboard layout and numbers', () => {
  test('DASH-001 the page shows the journey, five summary cards, recent reports, scheme finder and quick actions in order', async () => {
    const page = await openPage(browser, { as: 'consultant' });
    await go(page, '/dashboard', 2000);
    const order = await page.evaluate(() => [...document.querySelectorAll('main h1, main h2')].map((h) => h.textContent.trim()));
    const expected = ['Welcome back', 'Create a DPR in simple steps', 'My Recent DPRs', 'Scheme Finder', 'Quick Actions'];
    let at = -1;
    for (const title of expected) {
      const next = order.findIndex((text, i) => i > at && text.startsWith(title));
      assert.ok(next > at, `"${title}" is missing or out of order in ${JSON.stringify(order)}`);
      at = next;
    }
    assert.equal(await page.evaluate(() => document.querySelectorAll('main h1').length), 1, 'one page heading');
    assert.equal(await horizontalOverflow(page) <= 1, true, 'no sideways scrolling');
    await page.close();
  });

  test('DASH-002 the five summary numbers equal what is stored for this person', async () => {
    const me = await newPerson();
    for (const n of [1, 2]) assert.equal((await api('POST', '/dpr/cluster/draft/save', draft(unique(`QA Num${n}`)), me.token)).status, 200);
    const profile = await api('GET', '/auth/profile', undefined, me.token);
    const page = await openAs(me.token, profile.body.data?.user || profile.body.data);
    await go(page, '/dashboard', 2500);
    const cards = await page.evaluate(() => [...document.querySelectorAll('section[aria-label="DPR summary"] button')].map((b) => b.getAttribute('aria-label')));
    assert.equal(cards.length, 5);
    assert.match(cards[0], /^Total DPRs: 2\./);
    assert.match(cards[1], /^Draft: 2\./);
    assert.match(cards[2], /^Submitted: 0\./);
    assert.match(cards[3], /^Analyzed: 0\./);
    assert.match(cards[4], /^Avg Quality: N\/A\./, 'no score is invented when nothing has been analysed');
    await page.close();
  });

  test('DASH-003 a person with no reports sees a clear empty state with a way to start', async () => {
    const me = await newPerson();
    const profile = await api('GET', '/auth/profile', undefined, me.token);
    const page = await openAs(me.token, profile.body.data?.user || profile.body.data);
    await go(page, '/dashboard', 2500);
    assert.match(await bodyText(page), /No DPRs yet/);
    await clickText(page, 'main button', /^Create DPR/);
    await waitFor(page, () => location.pathname === '/individual-dpr/create');
    await page.close();
  });
});

describe('dashboard navigation', () => {
  test('DASH-010 the Draft card opens the report list already filtered to drafts', async () => {
    const page = await openPage(browser, { as: 'consultant' });
    await go(page, '/dashboard', 2000);
    await clickText(page, 'section[aria-label="DPR summary"] button', /^Draft:/);
    await waitFor(page, () => location.pathname === '/dprs');
    assert.equal(pathOf(page), '/dprs?status=draft');
    await sleep(1500);
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('select')].some((s) => s.value === 'draft')), true, 'the status filter shows Draft');
    await page.close();
  });

  test('DASH-011 the top-right Create DPR and Scheme Finder buttons and the Take Quick Guide button open their pages', async () => {
    const page = await openPage(browser, { as: 'consultant' });
    await go(page, '/dashboard', 2000);
    await clickText(page, '[data-tour=actions] button', /^Create DPR/);
    await waitFor(page, () => location.pathname === '/individual-dpr/create');
    await go(page, '/dashboard', 1500);
    await clickText(page, '[data-tour=journey] button', /Take Quick Guide/);
    await waitFor(page, () => location.pathname === '/individual-dpr/guide');
    await go(page, '/dashboard', 1500);
    await clickText(page, '[data-tour=actions] button', /^Scheme Finder$/);
    await waitFor(page, () => location.pathname === '/venture-match');
    await page.close();
  });

  test('DASH-012 the four "simple steps" boxes only explain; they are not buttons or links', async () => {
    const page = await openPage(browser, { as: 'consultant' });
    await go(page, '/dashboard', 2000);
    const steps = await page.evaluate(() => [...document.querySelectorAll('[data-tour=journey] ol li')].map((li) => ({ text: li.innerText.replace(/\s+/g, ' ').trim(), interactive: li.querySelectorAll('button, a, [role=button], [tabindex]').length })));
    assert.equal(steps.length, 4);
    assert.deepEqual(steps.map((s) => s.interactive), [0, 0, 0, 0]);
    assert.match(steps[0].text, /1\. Create/);
    assert.match(steps[3].text, /4\. Generate/);
    const before = new URL(page.url()).pathname;
    await page.evaluate(() => document.querySelector('[data-tour=journey] ol li div').click());
    await sleep(500);
    assert.equal(new URL(page.url()).pathname, before, 'pressing a step goes nowhere');
    await page.close();
  });

  test('DASH-014 searching in Scheme Finder opens the scheme list with the words already typed', async () => {
    const page = await openPage(browser, { as: 'consultant' });
    await go(page, '/dashboard', 2000);
    await page.fill('input[type=search]', 'food');
    await page.keyboard.press('Enter');
    await waitFor(page, () => location.pathname === '/individual-dpr/create');
    await sleep(1500);
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('input')].some((i) => i.value === 'food')), true, 'the search box holds "food"');
    await page.close();
  });

  test('DASH-015 a popular sector chip and the quick-action tiles open their places', async () => {
    const page = await openPage(browser, { as: 'consultant' });
    await go(page, '/dashboard', 2000);
    await clickText(page, 'main button', /^Manufacturing$/);
    await waitFor(page, () => location.pathname === '/individual-dpr/create' && location.search.includes('q=Manufacturing'));
    for (const [label, path] of [[/^Start with a guide/, '/individual-dpr/guide'], [/^Scheme Finder/, '/venture-match'], [/^My Projects/, '/projects']]) {
      await go(page, '/dashboard', 1500);
      await clickText(page, 'section[aria-labelledby="quick-actions-title"] button', label);
      await waitFor(page, (p) => location.pathname === p, p => p, 8000).catch(() => {});
      assert.equal(new URL(page.url()).pathname, path);
    }
    await page.close();
  });
});

describe('dashboard tour', () => {
  test('DASH-016 the Take a Tour button walks through the page, can be stepped back, and Escape closes it', async () => {
    const page = await openPage(browser, { as: 'consultant' });
    await go(page, '/dashboard', 2000);
    await clickText(page, '[data-tour=journey] button', /Take a Tour/);
    await waitFor(page, () => !!document.querySelector('[role=dialog][aria-labelledby=tour-title]'));
    const stopTitle = () => page.evaluate(() => document.getElementById('tour-title')?.textContent);
    assert.equal(await stopTitle(), 'Start here');
    assert.equal(await page.evaluate(() => document.querySelector('[data-tour-active]')?.getAttribute('data-tour')), 'actions', 'the top-right buttons are marked');
    await clickText(page, '[role=dialog] button', /^Next/);
    await sleep(300);
    assert.equal(await stopTitle(), 'The four steps of a DPR');
    await clickText(page, '[role=dialog] button', /^Back/);
    await sleep(300);
    assert.equal(await stopTitle(), 'Start here');
    await page.keyboard.press('Escape');
    await sleep(300);
    assert.equal(await page.evaluate(() => !!document.querySelector('[aria-labelledby=tour-title]')), false, 'Escape closes the tour');
    assert.equal(await page.evaluate(() => document.querySelectorAll('[data-tour-active]').length), 0, 'no part of the page stays marked');
    await page.close();
  });
});

describe('dashboard report rows', () => {
  test('DASH-020 a row opens the report, and Delete asks first and only then removes it', async () => {
    const me = await newPerson();
    const unit = unique('QA Row');
    assert.equal((await api('POST', '/dpr/cluster/draft/save', draft(unit), me.token)).status, 200);
    const profile = await api('GET', '/auth/profile', undefined, me.token);
    const page = await openAs(me.token, profile.body.data?.user || profile.body.data);
    await go(page, '/dashboard', 2500);
    assert.match(await bodyText(page), new RegExp(unit));
    await clickText(page, 'main ul button', new RegExp('^Delete ' + unit));
    await waitFor(page, () => !!document.querySelector('[role=dialog]'));
    await clickText(page, '[role=dialog] button', /^(Cancel|No|Keep)/i);
    await sleep(600);
    assert.match(await bodyText(page), new RegExp(unit), 'cancelling keeps the report');
    await clickText(page, 'main ul button', new RegExp('^Delete ' + unit));
    await waitFor(page, () => !!document.querySelector('[role=dialog]'));
    await clickText(page, '[role=dialog] button', /^(Delete|Yes|Confirm)/i);
    await waitFor(page, (u) => !document.body.innerText.includes(u), unit, 10000);
    await page.close();
  });

  test('DASH-021 View on a row opens that report', async () => {
    const page = await openPage(browser, { as: 'consultant' });
    await go(page, '/dashboard', 2500);
    await page.evaluate(() => document.querySelector('main ul button[aria-label^="View "]').click());
    await waitFor(page, () => location.pathname.startsWith('/dpr/view/'), undefined, 10000);
    await page.close();
  });
});
