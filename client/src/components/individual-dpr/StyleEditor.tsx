// @ts-nocheck
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Eye, EyeOff, GripVertical, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageSheet } from '@/components/individual-dpr/PageSheet';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import {
  FONT_CHOICES,
  MARGIN_MAX,
  MARGIN_MIN,
  PRESET_IDS,
  PRESET_LABELS,
  applyPreset,
  contrastOk,
  defaultStyleForScheme,
  insertPicture,
  layoutOrder,
  moveSection,
  pageEdgeMm,
  pageWidthMm,
  pictureToken,
  styleProblems,
  type DocumentStyle,
  type DocPresetId,
  type PageSize,
  type TypeRole,
} from '@/lib/individualDpr/documentStyle';

const PAGE_SIZES: PageSize[] = ['A4', 'A3', 'Letter', 'Legal'];
const ROLE_KEYS = ['cover', 'sectionTitle', 'body', 'table', 'caption'] as const;

const ROLE_LABELS: Record<(typeof ROLE_KEYS)[number], string> = {
  cover: 'Cover',
  sectionTitle: 'Section title',
  body: 'Body',
  table: 'Table',
  caption: 'Caption',
};

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Choose an image file.'));
      return;
    }
    if (file.size > 350_000) {
      reject(new Error('Use an image under 350 KB.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.readAsDataURL(file);
  });
}

export function StyleEditor({
  style,
  schemeCode,
  steps,
  activeSectionId,
  onActiveSection,
  onChange,
  onSave,
  onClose,
  saving,
  canSaveSchemeDefault,
  onSaveSchemeDefault,
  language,
  onLanguage,
  hasTelugu,
  renderEditor,
  editNonce,
  editStepN,
  onEditSection,
  children,
}) {
  const tf = useClusterFormText();
  const past = useRef<DocumentStyle[]>([]);
  const future = useRef<DocumentStyle[]>([]);
  const [historyTick, setHistoryTick] = useState(0);
  const [dragId, setDragId] = useState<string | null>(null);
  const [panel, setPanel] = useState(null);
  const [editStep, setEditStep] = useState(null);
  const [zoom, setZoom] = useState(0.55);
  const [fitWidth, setFitWidth] = useState(true);
  const fitWidthRef = useRef(true);
  const [slot, setSlot] = useState('cover');
  const [imageError, setImageError] = useState('');
  const [pendingPictures, setPendingPictures] = useState([]);
  const [pictureName, setPictureName] = useState('');
  const [deletePictureId, setDeletePictureId] = useState('');
  const [wideTable, setWideTable] = useState(false);
  const [blockedColor, setBlockedColor] = useState('');
  const [paneWidths, setPaneWidths] = useState({ sections: 200, style: 240, edit: 300 });
  const centerRef = useRef<HTMLDivElement>(null);
  const clampPane = (value, min, max) => Math.min(max, Math.max(min, value));

  const startPaneResize = (key) => (event) => {
    event.preventDefault();
    const startX = event.clientX;
    const start = { ...paneWidths };
    const move = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      setPaneWidths(() => {
        const next = { ...start };
        if (key === 'sections') {
          const grown = clampPane(start.sections + dx, 160, 480);
          const styleWidth = start.style - (grown - start.sections);
          if (styleWidth >= 200 && styleWidth <= 560) {
            next.sections = grown;
            next.style = styleWidth;
          }
        }
        if (key === 'style') next.style = clampPane(start.style + dx, 200, 560);
        if (key === 'edit') next.edit = clampPane(start.edit - dx, 240, 720);
        return next;
      });
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  };

  const paneHandle = (key) => (
    <div
      role="separator"
      aria-orientation="vertical"
      title={tf('Drag to resize')}
      onPointerDown={startPaneResize(key)}
      className="group relative hidden w-2 shrink-0 cursor-col-resize bg-slate-200 hover:bg-teal-600 lg:block"
    />
  );

  const applyFit = () => {
    const box = centerRef.current;
    if (!box || !fitWidthRef.current) return;
    const probe = document.createElement('div');
    probe.style.cssText = `width:${pageWidthMm(style.pageSize)}mm;height:0;position:absolute;visibility:hidden;pointer-events:none`;
    box.appendChild(probe);
    const pagePx = probe.offsetWidth;
    box.removeChild(probe);
    if (!pagePx) return;
    const available = Math.max(120, box.clientWidth - 24);
    const next = Math.min(1.35, Math.max(0.22, available / pagePx));
    setZoom(Math.round(next * 100) / 100);
  };

  useLayoutEffect(() => {
    fitWidthRef.current = fitWidth;
    const box = centerRef.current;
    if (!box) return;
    applyFit();
    const observer = new ResizeObserver(() => applyFit());
    observer.observe(box);
    return () => observer.disconnect();
  }, [style.pageSize, fitWidth, panel]);

  const openEdit = (step) => {
    if (!renderEditor || !step) return;
    setEditStep(step);
    setPanel('edit');
    onActiveSection?.(step.id);
    onEditSection?.(step);
  };

  useEffect(() => {
    if (!editNonce || editStepN == null) return;
    const step = steps.find((item) => item.n === editStepN);
    if (step) openEdit(step);
  }, [editNonce]);

  const commit = (next: DocumentStyle) => {
    past.current.push(style);
    if (past.current.length > 30) past.current.shift();
    future.current = [];
    setHistoryTick((n) => n + 1);
    onChange(next);
  };

  const undo = () => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(style);
    setHistoryTick((n) => n + 1);
    onChange(prev);
  };

  const redo = () => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(style);
    setHistoryTick((n) => n + 1);
    onChange(next);
  };

  useEffect(() => {
    const root = centerRef.current;
    if (!root) return;
    const tables = root.querySelectorAll('.cmep-fin-table');
    let tight = false;
    tables.forEach((table) => {
      const wrap = table.parentElement;
      if (wrap && table.scrollWidth > wrap.clientWidth + 8) tight = true;
    });
    setWideTable(tight);
  }, [style, zoom, children]);

  const problems = styleProblems(style, { telugu: language === 'telugu', wideTable });
  const problemFor = (key: string) => problems.find((item) => item.key === key)?.message;
  const blocking = problems.some((item) => item.key.startsWith('margin') || ['primary', 'header', 'table', 'border'].includes(item.key));

  const setColor = (key: 'primary' | 'header' | 'table' | 'border', value: string) => {
    const ok = key === 'table' ? contrastOk('#ffffff', value) : contrastOk(value, '#ffffff');
    if (!ok) {
      setBlockedColor(key);
      return;
    }
    setBlockedColor('');
    commit({ ...style, colors: { ...style.colors, [key]: value } });
  };

  const setRole = (key: (typeof ROLE_KEYS)[number], patch: Partial<TypeRole>) => {
    commit({ ...style, [key]: { ...style[key], ...patch } });
  };

  const setMargin = (side: keyof DocumentStyle['marginMm'], raw: string) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    const value = Math.min(MARGIN_MAX, Math.max(MARGIN_MIN, n));
    commit({ ...style, marginMm: { ...style.marginMm, [side]: value } });
  };

  const onDrop = (targetId: string) => {
    if (!dragId) return;
    const order = layoutOrder(steps, style);
    commit({ ...style, sectionOrder: moveSection(order, steps, dragId, targetId) });
    setDragId(null);
    onActiveSection?.(null);
  };

  const toggleHidden = (id: string) => {
    const hidden = new Set(style.hiddenSectionIds);
    if (hidden.has(id)) hidden.delete(id);
    else hidden.add(id);
    commit({ ...style, hiddenSectionIds: [...hidden] });
  };

  const orderedIds = layoutOrder(steps, style);
  const pictureById = new Map((style.pictures || []).map((picture) => [picture.id, picture]));
  const sidebarRows = orderedIds.reduce((acc, token) => {
    if (token.startsWith('pic:')) {
      const picture = pictureById.get(token.slice(4));
      if (picture) acc.rows.push({ kind: 'picture', picture });
      return acc;
    }
    const step = steps.find((item) => item.id === token);
    if (!step) return acc;
    const hidden = style.hiddenSectionIds.includes(step.id);
    const num = hidden ? '–' : acc.next;
    acc.rows.push({ kind: 'section', step, hidden, num });
    if (!hidden) acc.next += 1;
    return acc;
  }, { rows: [], next: 1 }).rows;

  const sheet = (
    <PageSheet
      pageSize={style.pageSize}
      edgeTopMm={pageEdgeMm(style.marginMm.top)}
      edgeBottomMm={pageEdgeMm(style.marginMm.bottom)}
      className="mx-auto shadow-lg"
    >
      {children}
    </PageSheet>
  );

  const sectionsPanel = (
    <aside className="flex h-full min-h-0 flex-col border-border bg-white lg:border-r">
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <p className="text-sm font-semibold">{tf('Sections')}</p>
        <button
          type="button"
          className="text-xs font-medium text-primary"
          onClick={() => commit({
            ...style,
            hiddenSectionIds: [],
            sectionOrder: layoutOrder(steps, { ...style, sectionOrder: steps.map((step) => step.id) }),
          })}
        >
          {tf('Original order')}
        </button>
      </div>
      <ol className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {sidebarRows.map((row) => {
          if (row.kind === 'picture') {
            const { picture } = row;
            const token = pictureToken(picture.id);
            const hot = dragId === token;
            return (
              <li
                key={token}
                draggable
                onDragStart={() => setDragId(token)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onDrop(token)}
                onDragEnd={() => setDragId(null)}
                className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm ${
                  hot ? 'border-teal-600 bg-teal-50' : 'border-transparent bg-slate-50'
                } ${picture.hidden ? 'opacity-45' : ''}`}
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-400" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-left">{picture.name}</span>
                <button
                  type="button"
                  className="rounded p-1 text-slate-500 hover:bg-white"
                  title={picture.hidden ? tf('Show picture') : tf('Hide picture')}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => commit({
                    ...style,
                    pictures: style.pictures.map((item) => (
                      item.id === picture.id ? { ...item, hidden: !item.hidden } : item
                    )),
                  })}
                >
                  {picture.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  className="rounded p-1 text-red-700 hover:bg-white"
                  title={tf('Delete picture')}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => setDeletePictureId(picture.id)}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            );
          }
          const { step, hidden, num } = row;
          const hot = dragId === step.id || activeSectionId === step.id;
          return (
            <li
              key={step.id}
              draggable
              onDragStart={() => {
                setDragId(step.id);
                onActiveSection?.(step.id);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => onDrop(step.id)}
              onDragEnd={() => {
                setDragId(null);
                onActiveSection?.(null);
              }}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm ${
                hot ? 'border-teal-600 bg-teal-50' : 'border-transparent bg-slate-50'
              } ${hidden ? 'opacity-45' : ''}`}
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-400" aria-hidden />
              <span className="w-5 shrink-0 text-xs text-slate-500">{num}</span>
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => openEdit(step)}
              >
                {tf(step.title)}
              </button>
              <button
                type="button"
                className="rounded p-1 text-slate-500 hover:bg-white"
                title={hidden ? tf('Show section') : tf('Hide section')}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => toggleHidden(step.id)}
              >
                {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );

  const stylePanel = (
    <aside className="flex h-full min-h-0 flex-col bg-white lg:border-l">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{tf('Presets')}</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => commit(applyPreset(style, id as DocPresetId))}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                  style.preset === id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white'
                }`}
              >
                {tf(PRESET_LABELS[id])}
              </button>
            ))}
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tf('Page')}</legend>
          <label className="block text-xs">
            {tf('Page size')}
            <select
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
              value={style.pageSize}
              onChange={(event) => commit({ ...style, pageSize: event.target.value })}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </label>
          <p className="text-xs text-slate-500">{tf('Portrait for the write-up.')}</p>
          <label className={`flex items-start gap-2 text-xs ${problemFor('wide') ? 'text-red-700' : ''}`}>
            <input
              type="checkbox"
              className="mt-0.5"
              checked={style.wideTablesLandscape}
              onChange={(event) => commit({ ...style, wideTablesLandscape: event.target.checked })}
            />
            <span>{tf('Landscape for wide money tables')}</span>
          </label>
          {problemFor('wide') ? <p className="text-xs font-medium text-red-700">{tf(problemFor('wide'))}</p> : null}
          <div className="grid grid-cols-2 gap-2">
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
              <label key={side} className="text-xs capitalize">
                {tf(side)} (mm)
                <input
                  type="number"
                  min={MARGIN_MIN}
                  max={MARGIN_MAX}
                  className={`mt-1 w-full rounded-md border px-2 py-1.5 text-sm ${problemFor(`margin-${side}`) ? 'border-red-500' : ''}`}
                  value={style.marginMm[side]}
                  onChange={(event) => setMargin(side, event.target.value)}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tf('Type')}</legend>
          {ROLE_KEYS.map((key) => (
            <div key={key} className={`rounded-md border p-2 ${problemFor('body-font') && key === 'body' ? 'border-red-500' : 'border-slate-200'}`}>
              <p className="mb-1 text-xs font-medium">{tf(ROLE_LABELS[key])}</p>
              <div className="grid grid-cols-3 gap-1">
                <select
                  className="rounded border px-1 py-1 text-xs"
                  value={style[key].family}
                  onChange={(event) => setRole(key, { family: event.target.value })}
                >
                  {FONT_CHOICES.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={8}
                  max={36}
                  className="rounded border px-1 py-1 text-xs"
                  value={style[key].size}
                  onChange={(event) => setRole(key, { size: Number(event.target.value) })}
                />
                <select
                  className="rounded border px-1 py-1 text-xs"
                  value={style[key].weight}
                  onChange={(event) => setRole(key, { weight: Number(event.target.value) })}
                >
                  <option value={400}>{tf('Regular')}</option>
                  <option value={600}>{tf('Semibold')}</option>
                  <option value={700}>{tf('Bold')}</option>
                </select>
              </div>
            </div>
          ))}
          {problemFor('body-font') ? <p className="text-xs font-medium text-red-700">{tf(problemFor('body-font'))}</p> : null}
          <label className="block text-xs">
            {tf('Alignment')}
            <select
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
              value={style.align}
              onChange={(event) => commit({ ...style, align: event.target.value })}
            >
              <option value="left">{tf('Left')}</option>
              <option value="justify">{tf('Justified')}</option>
            </select>
          </label>
          <label className="block text-xs">
            {tf('Line spacing')}
            <input
              type="number"
              step="0.05"
              min={1}
              max={2}
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
              value={style.lineHeight}
              onChange={(event) => commit({ ...style, lineHeight: Number(event.target.value) })}
            />
          </label>
          <label className="block text-xs">
            {tf('Space between paragraphs')} (pt)
            <input
              type="number"
              min={0}
              max={24}
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
              value={style.paragraphGap}
              onChange={(event) => commit({ ...style, paragraphGap: Number(event.target.value) })}
            />
          </label>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tf('Colors')}</legend>
          {([
            ['primary', 'Primary'],
            ['header', 'Header'],
            ['table', 'Table header'],
            ['border', 'Borders'],
          ] as const).map(([key, label]) => (
            <label key={key} className={`flex items-center justify-between gap-2 text-xs ${problemFor(key) || blockedColor === key ? 'text-red-700' : ''}`}>
              <span>{tf(label)}</span>
              <input
                type="color"
                value={style.colors[key]}
                onChange={(event) => setColor(key, event.target.value)}
                className={`h-8 w-12 rounded border ${problemFor(key) || blockedColor === key ? 'border-red-500' : ''}`}
              />
            </label>
          ))}
          {blockedColor ? (
            <p className="text-xs font-medium text-red-700">{tf('That color would hide the text, so it was not applied.')}</p>
          ) : null}
          {['primary', 'header', 'table', 'border'].map((key) =>
            problemFor(key) ? <p key={key} className="text-xs font-medium text-red-700">{tf(problemFor(key))}</p> : null
          )}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tf('Header and footer')}</legend>
          <label className="block text-xs">
            {tf('Logo place')}
            <select
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
              value={style.logoAlign}
              onChange={(event) => commit({ ...style, logoAlign: event.target.value })}
            >
              <option value="left">{tf('Left')}</option>
              <option value="center">{tf('Center')}</option>
              <option value="right">{tf('Right')}</option>
            </select>
          </label>
          <label className="block text-xs">
            {tf('Agency name')}
            <input
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
              value={style.agencyName}
              onChange={(event) => commit({ ...style, agencyName: event.target.value })}
            />
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={style.headerLine}
              onChange={(event) => commit({ ...style, headerLine: event.target.checked })}
            />
            {tf('Thin line under the header')}
          </label>
          <label className="block text-xs">
            {tf('Page numbers')}
            <select
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
              value={style.pageNumberStyle}
              onChange={(event) => commit({ ...style, pageNumberStyle: event.target.value })}
            >
              <option value="plain">3</option>
              <option value="of">{tf('Page 3 of 12')}</option>
            </select>
          </label>
          <label className="block text-xs">
            {tf('Logo')}
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-xs"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (!file) return;
                try {
                  const url = await readImageFile(file);
                  commit({ ...style, logoDataUrl: url });
                  setImageError('');
                } catch (error) {
                  setImageError(error?.message || 'Could not read that image.');
                }
              }}
            />
          </label>
          {style.logoDataUrl ? (
            <button type="button" className="text-xs text-red-700" onClick={() => commit({ ...style, logoDataUrl: '' })}>
              {tf('Remove logo')}
            </button>
          ) : null}
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tf('Watermark')}</legend>
          <input
            className="w-full rounded-md border px-2 py-1.5 text-sm"
            value={style.watermark}
            onChange={(event) => commit({ ...style, watermark: event.target.value })}
          />
          <label className="block text-xs">
            {tf('How faint')}
            <input
              type="range"
              min={0.04}
              max={0.4}
              step={0.01}
              className="mt-1 w-full"
              value={style.watermarkOpacity}
              onChange={(event) => commit({ ...style, watermarkOpacity: Number(event.target.value) })}
            />
          </label>
          <label className="block text-xs">
            {tf('Angle')}
            <input
              type="number"
              min={-90}
              max={90}
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm"
              value={style.watermarkAngle}
              onChange={(event) => commit({ ...style, watermarkAngle: Number(event.target.value) })}
            />
          </label>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tf('Tables')}</legend>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={style.tableStriped}
              onChange={(event) => commit({ ...style, tableStriped: event.target.checked })}
            />
            {tf('Striped rows')}
          </label>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">{tf('Pictures')}</legend>
          <p className="text-xs text-slate-500">{tf('Choose where a new picture starts. Name it, then drag it in Sections.')}</p>
          <select className="w-full rounded-md border px-2 py-1.5 text-sm" value={slot} onChange={(event) => setSlot(event.target.value)}>
            <option value="cover">{tf('Cover')}</option>
            {steps.map((step) => (
              <option key={step.id} value={`after:${step.id}`}>{tf('After')} {tf(step.title)}</option>
            ))}
            <option value="annexure">{tf('Annexure')}</option>
          </select>
          <input
            type="file"
            accept="image/*"
            multiple
            className="block w-full text-xs"
            onChange={async (event) => {
              const files = [...(event.target.files || [])];
              event.target.value = '';
              if (!files.length) return;
              const place = slot === 'cover' || slot === 'annexure' ? slot : slot.slice('after:'.length);
              const next = [];
              for (const file of files) {
                try {
                  const src = await readImageFile(file);
                  const suggested = file.name.replace(/\.[^.]+$/, '').slice(0, 80) || 'Picture';
                  next.push({ src, suggested, place });
                } catch (error) {
                  setImageError(error?.message || 'Could not read that image.');
                }
              }
              if (!next.length) return;
              setImageError('');
              setPendingPictures(next);
              setPictureName(next[0].suggested);
            }}
          />
          {imageError ? <p className="text-xs font-medium text-red-700">{tf(imageError)}</p> : null}
        </fieldset>
      </div>
    </aside>
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-slate-100">
      <div className="flex flex-wrap items-center gap-2 border-b bg-white px-3 py-2">
        <Button type="button" variant="ghost" size="sm" onClick={undo} disabled={historyTick < 0 || !past.current.length}>{tf('Undo')}</Button>
        <Button type="button" variant="ghost" size="sm" onClick={redo} disabled={historyTick < 0 || !future.current.length}>{tf('Redo')}</Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            past.current = [];
            future.current = [];
            setHistoryTick((n) => n + 1);
            onChange(defaultStyleForScheme(schemeCode));
          }}
        >
          {tf('Reset')}
        </Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>{tf('Close')}</Button>
          {canSaveSchemeDefault ? (
            <Button type="button" variant="outline" size="sm" onClick={onSaveSchemeDefault} disabled={saving || blocking}>
              {tf('Save as the scheme default')}
            </Button>
          ) : null}
          <Button type="button" size="sm" onClick={onSave} disabled={saving || blocking}>
            {saving ? tf('Saving') : tf('Save on this DPR')}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b bg-white px-3 py-2 lg:hidden">
        <Button type="button" variant="outline" size="sm" className="shrink-0 whitespace-nowrap" onClick={() => setPanel(panel === 'sections' ? null : 'sections')}>{tf('Sections')}</Button>
        <Button type="button" variant="outline" size="sm" className="shrink-0 whitespace-nowrap" onClick={() => setPanel(panel === 'style' ? null : 'style')}>{tf('Style')}</Button>
        {renderEditor ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 whitespace-nowrap"
            onClick={() => openEdit(editStep || steps[0])}
          >
            {tf('Fill & edit')}
          </Button>
        ) : null}
      </div>
      <div className="relative min-h-0 flex-1">
        <div className="flex h-full min-h-0">
          <div style={{ width: paneWidths.sections }} className="hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r bg-white pt-3 lg:flex">
            <div className="min-h-0 flex-1 overflow-hidden">
              {sectionsPanel}
            </div>
          </div>
          {paneHandle('sections')}
          <div style={{ width: paneWidths.style }} className="hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r bg-white pt-3 lg:flex">
            <div className="min-h-0 flex-1 overflow-hidden">
              {stylePanel}
            </div>
          </div>
          {paneHandle('style')}
          <div className="flex h-full min-h-0 min-w-[280px] flex-1 flex-col pt-3">
            <div className="flex items-center justify-between gap-2 border-b bg-white/80 px-3 py-1.5">
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { fitWidthRef.current = false; setFitWidth(false); setZoom((z) => Math.max(0.22, Math.round((z - 0.05) * 100) / 100)); }}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center text-xs">{Math.round(zoom * 100)}%</span>
                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { fitWidthRef.current = false; setFitWidth(false); setZoom((z) => Math.min(1.35, Math.round((z + 0.05) * 100) / 100)); }}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-7 whitespace-nowrap px-2 text-xs" onClick={() => { fitWidthRef.current = true; setFitWidth(true); }}>
                  {tf('Fit page')}
                </Button>
              </div>
              <select
                className="h-8 rounded-md border px-2 text-xs"
                value={language}
                onChange={(event) => onLanguage?.(event.target.value)}
              >
                <option value="english">{tf('English')}</option>
                <option value="telugu" disabled={hasTelugu === false}>{tf('Telugu')}</option>
              </select>
            </div>
            <div ref={centerRef} className="min-h-0 flex-1 overflow-auto bg-slate-100 p-3">
              <div style={{ zoom }}>{sheet}</div>
            </div>
          </div>
          {renderEditor ? paneHandle('edit') : null}
          {renderEditor ? (
            <div style={{ width: paneWidths.edit }} className="hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-l bg-white pt-3 lg:flex">
              <div className="border-b px-3 py-2">
                <p className="text-sm font-semibold">{tf('Fill & edit')}</p>
                <p className="truncate text-xs text-slate-500">{tf((editStep || steps[0])?.title || '')}</p>
              </div>
              <div className="fill-edit-scroll min-h-0 flex-1 overflow-y-auto p-3">
                {(editStep || steps[0]) ? renderEditor(editStep || steps[0]) : null}
              </div>
            </div>
          ) : null}
        </div>
        {panel === 'sections' ? (
          <div className="absolute inset-y-0 left-0 z-30 w-72 max-w-[90%] overflow-hidden border-r bg-white shadow-xl lg:hidden">
            {sectionsPanel}
          </div>
        ) : null}
        {panel === 'style' ? (
          <div className="absolute inset-y-0 right-0 z-30 w-80 max-w-[90%] overflow-hidden border-l bg-white shadow-xl lg:hidden">
            {stylePanel}
          </div>
        ) : null}
        {panel === 'edit' && editStep && renderEditor ? (
          <div className="absolute inset-y-0 left-0 z-30 flex w-[min(40rem,92%)] max-w-full flex-col border-r bg-white shadow-xl lg:hidden">
            <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
              <p className="min-w-0 truncate text-sm font-semibold">{tf(editStep.title)}</p>
              <button type="button" className="shrink-0 text-xs font-medium text-slate-600" onClick={() => setPanel(null)}>
                {tf('Close')}
              </button>
            </div>
            <div className="fill-edit-scroll min-h-0 flex-1 overflow-y-auto p-3">
              {renderEditor(editStep)}
            </div>
          </div>
        ) : null}
      </div>
      {pendingPictures[0] ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form
            className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              const name = pictureName.trim().slice(0, 80);
              const pending = pendingPictures[0];
              if (!name || !pending) return;
              const picture = {
                id: `pic_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
                name,
                src: pending.src,
                hidden: false,
                place: pending.place,
                frame: { w: 100, h: 0, x: 0, y: 0 },
              };
              commit(insertPicture(style, steps, picture));
              const rest = pendingPictures.slice(1);
              setPendingPictures(rest);
              setPictureName(rest[0]?.suggested || '');
            }}
          >
            <p className="text-sm font-semibold">{tf('Name this picture')}</p>
            <p className="mt-1 text-xs text-slate-500">{tf('This name is how you find it in Sections.')}</p>
            <input
              className="mt-3 w-full rounded-md border px-2 py-1.5 text-sm"
              value={pictureName}
              autoFocus
              onChange={(event) => setPictureName(event.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const rest = pendingPictures.slice(1);
                  setPendingPictures(rest);
                  setPictureName(rest[0]?.suggested || '');
                }}
              >
                {tf('Cancel')}
              </Button>
              <Button type="submit" size="sm" disabled={!pictureName.trim()}>{tf('Save')}</Button>
            </div>
          </form>
        </div>
      ) : null}
      {deletePictureId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl">
            <p className="text-sm font-semibold">{tf('Delete this image?')}</p>
            <p className="mt-1 text-xs text-slate-500">
              {(style.pictures || []).find((picture) => picture.id === deletePictureId)?.name}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setDeletePictureId('')}>
                {tf('Cancel')}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  const pictures = (style.pictures || []).filter((picture) => picture.id !== deletePictureId);
                  commit({ ...style, pictures, sectionOrder: layoutOrder(steps, { ...style, pictures }) });
                  setDeletePictureId('');
                }}
              >
                {tf('Delete')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
