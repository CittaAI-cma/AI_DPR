import React, { useLayoutEffect, useRef } from 'react';
import { getIndividualCoverLines } from '@/lib/individualDpr/coverTitle';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import {
  extractIndividualDocData,
  extractSchemeCode,
  formatDocValue,
  getIndividualDocFields,
  getIndividualUploads,
  getSchemeDocSteps,
  readDocField,
  sectionTitleFromStep,
  type IndividualDocField,
} from '@/lib/individualDpr/individualDocModel';
import { getSchemeUiTemplate } from '@/lib/individualDpr/schemeUiTemplate';
import {
  applySectionOrder,
  layoutOrder,
  pageEdgeMm,
  pictureIdFromToken,
  resizeImageBox,
  resolveDocumentStyle,
  styleCssVars,
  type DocumentStyle,
  type ImageBox,
  type ImageHandle,
} from '@/lib/individualDpr/documentStyle';
import { normalizeCmepProjections } from '@/lib/individualDpr/cmepProjections';
import {
  CMEP_COST_HEADS,
  deriveCmepBankSheets,
  normalizeCostPhasing,
  normalizeMachineryItems,
  normalizeProductMix,
  normalizePromoters,
  normalizeRawMaterials,
  normalizeRisks,
  normalizeStaffRoles,
  normalizeUtilisationYears,
} from '@/lib/individualDpr/cmepBankPack';
import { normalizeMilestones } from '@/lib/dprAiFieldNormalize';

const NARRATIVE_FIELDS = new Set([
  'executiveSummary',
  'processOfManufacture',
  'sectorDescription',
  'presentActivities',
  'geography',
  'targetMarket',
  'existingDemand',
  'landDetails',
  'waterAndEffluent',
  'impactNote',
]);
import { isKycUploaded } from '@/lib/privacy/kycField';

export interface IndividualDPRDocumentViewProps {
  dpr: any;
  project?: any;
  viewLanguage?: 'english' | 'telugu';
  trackFieldHits?: boolean;
  onSectionClick?: (localStep: number) => void;
  /** When set, this DPR wears the saved style and section order. */
  documentStyle?: DocumentStyle | null;
  activeSectionId?: string | null;
  /** Drag a picture handle in the live report. Slot is cover, annexure, or a section id. */
  onImageFrame?: (slot: string, box: ImageBox) => void;
  /** Type straight into the live document. Path is stepN.field or stepN.field[i].key. */
  onEditField?: (path: string, text: string) => void;
  /** Type a text block that was inserted into a section. */
  onEditBlock?: (sectionId: string, blockId: string, text: string) => void;
}

const IMAGE_HANDLES: ImageHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

function SlotFigure({
  src,
  frame,
  onFrame,
}: {
  src: string;
  frame: ImageBox;
  onFrame?: (box: ImageBox) => void;
}) {
  const tf = useClusterFormText();
  const boxRef = React.useRef<HTMLDivElement>(null);
  const onPointerDown = (handle: ImageHandle) => (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!onFrame) return;
    event.preventDefault();
    event.stopPropagation();
    const box = boxRef.current;
    const host = box?.parentElement?.parentElement;
    if (!box || !host) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const maxW = host.getBoundingClientRect().width || box.getBoundingClientRect().width;
    const measuredH = (box.getBoundingClientRect().height / maxW) * 100;
    const start = { ...frame, h: frame.h > 0 ? frame.h : measuredH };
    const move = (moveEvent: PointerEvent) => {
      const dx = ((moveEvent.clientX - startX) / maxW) * 100;
      const dy = ((moveEvent.clientY - startY) / maxW) * 100;
      onFrame(resizeImageBox(start, handle, dx, dy));
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  };

  return (
    <figure className="dpr-slot-figure">
      <div
        ref={boxRef}
        className={onFrame ? 'dpr-slot-box is-live' : 'dpr-slot-box'}
        style={{
          width: `${frame.w}%`,
          marginLeft: frame.x ? `${frame.x}%` : undefined,
          marginTop: frame.y ? `${frame.y}%` : undefined,
          aspectRatio: frame.h ? `${frame.w} / ${frame.h}` : undefined,
        }}
      >
        <img src={src} alt="" style={frame.h ? { height: '100%', objectFit: 'fill' } : undefined} />
        {onFrame
          ? IMAGE_HANDLES.map((handle) => (
            <button
              key={handle}
              type="button"
              className={`dpr-slot-handle is-${handle}`}
              aria-label={tf('Resize picture')}
              title={tf('Resize picture')}
              onPointerDown={onPointerDown(handle)}
            />
          ))
          : null}
      </div>
    </figure>
  );
}

function fieldHit(
  path: string,
  children: React.ReactNode,
  track: boolean
): React.ReactNode {
  if (!track) return children;
  return <span data-dpr-field={path}>{children}</span>;
}

function isPlainValue(value: unknown): boolean {
  return value == null || value === '' || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function EditableDocText({
  path,
  display,
  placeholder,
  onEdit,
  multiline,
  track,
}: {
  path: string;
  display: string;
  placeholder: string;
  onEdit: (path: string, text: string) => void;
  multiline?: boolean;
  track?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const focused = useRef(false);
  const shown = !display || display === '—' ? '' : display;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || focused.current) return;
    if (el.textContent !== shown) el.textContent = shown;
  }, [shown]);
  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      spellCheck
      data-dpr-field={track ? path : undefined}
      data-placeholder={placeholder}
      className="dpr-inline-edit"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      onFocus={() => { focused.current = true; }}
      onBlur={() => {
        focused.current = false;
        onEdit(path, ref.current?.textContent ?? '');
      }}
      onKeyDown={(event) => {
        if (!multiline && event.key === 'Enter') {
          event.preventDefault();
          (event.currentTarget as HTMLElement).blur();
        }
      }}
    />
  );
}

export const IndividualDPRDocumentView: React.FC<IndividualDPRDocumentViewProps> = ({
  dpr,
  project,
  viewLanguage = 'english',
  trackFieldHits = false,
  onSectionClick,
  documentStyle,
  activeSectionId = null,
  onImageFrame,
  onEditField,
  onEditBlock,
}) => {
  const tf = useClusterFormText();
  const data = extractIndividualDocData(dpr, project);
  const schemeCode = extractSchemeCode(dpr, project, data);
  const schemeUi = getSchemeUiTemplate(schemeCode);
  const catalogSteps = getSchemeDocSteps(schemeCode);
  const extras = data.schemeExtras || {};
  const explicitStyle = documentStyle !== undefined ? documentStyle : extras.documentStyle;
  const style = explicitStyle ? resolveDocumentStyle(explicitStyle, schemeCode) : null;
  const steps = style ? applySectionOrder(catalogSteps, style) : catalogSteps;
  const step1 = data.step1 || {};
  const cover = getIndividualCoverLines(
    step1,
    schemeCode,
    viewLanguage === 'telugu' ? 'te' : 'en'
  );
  const budget = data.ventureMatchAnswers?.budget;
  const uploads = getIndividualUploads(schemeCode, data);
  const uploadStore = data.step18 || data.uploads || {};

  const typeHere = tf('Type here');
  const renderBlocks = (sectionId: string) => {
    const blocks = style?.sectionBlocks?.[sectionId] || [];
    if (!blocks.length) return null;
    return blocks.map((block) => {
      if (block.kind === 'text') {
        return (
          <div key={block.id} className="individual-qa-a mt-2">
            {onEditBlock ? (
              <EditableDocText
                path={`block:${sectionId}:${block.id}`}
                display={block.text || '—'}
                placeholder={typeHere}
                multiline
                onEdit={(_path, text) => onEditBlock(sectionId, block.id, text)}
              />
            ) : (block.text || '—')}
          </div>
        );
      }
      if (block.hidden) return null;
      return (
        <SlotFigure
          key={block.id}
          src={block.src}
          frame={block.frame}
          onFrame={onImageFrame ? (box) => onImageFrame(`block:${sectionId}:${block.id}`, box) : undefined}
        />
      );
    });
  };
  const editableValue = (path: string, display: string, raw: unknown, multiline = false) => {
    if (onEditField && isPlainValue(raw)) {
      return (
        <EditableDocText
          path={path}
          display={display}
          placeholder={typeHere}
          onEdit={onEditField}
          multiline={multiline}
          track={trackFieldHits}
        />
      );
    }
    return fieldHit(path, display === '—' ? '—' : tf(display), trackFieldHits);
  };

  const renderSectionFields = (fields: IndividualDocField[]) => {
    if (!fields.length) {
      return <p className="individual-empty">{tf('No answers for this section yet.')}</p>;
    }

    const blocks: React.ReactNode[] = [];
      let particulars: IndividualDocField[] = [];
      const flushParticulars = () => {
        if (!particulars.length) return;
        const rows = particulars;
        particulars = [];
        blocks.push(
          <table key={rows.map((field) => field.path).join('|')} className="individual-particulars">
            <thead>
              <tr>
                <th>{tf('Particular')}</th>
                <th>{tf('Details')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((field) => {
                const text = formatDocValue(readDocField(field, data));
                const empty = text === '—';
                return (
                  <tr key={field.path}>
                    <td className="part">{tf(field.label)}</td>
                    <td className={empty ? 'is-empty' : ''}>
                      {editableValue(field.path, text, readDocField(field, data))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      };
      const prose = (field: IndividualDocField, text: string) => (
        <article key={field.path} className="individual-qa-block">
          <h3 className="individual-qa-q">{tf(field.label)}</h3>
          <div className={`individual-qa-a${text === '—' ? ' is-empty' : ''}`}>
            {editableValue(field.path, text, readDocField(field, data), true)}
          </div>
        </article>
      );
      const dataTable = (key: string, title: string, headers: string[], body: string[][], cellPaths?: Array<Array<string | null>>) => {
        const rows = body.length ? body : (cellPaths?.length ? cellPaths.map(() => headers.map(() => '')) : []);
        return (
        <table key={key} className="individual-particulars">
          <caption className="individual-qa-q">{tf(title)}</caption>
          <thead>
            <tr>{headers.map((header) => <th key={header}>{tf(header)}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row, index) => (
              <tr key={index}>{row.map((cell, cellIndex) => {
                const cellPath = cellPaths?.[index]?.[cellIndex];
                return (
                  <td key={cellIndex}>
                    {cellPath && onEditField ? (
                      <EditableDocText path={cellPath} display={cell || '—'} placeholder={typeHere} onEdit={onEditField} track={trackFieldHits} />
                    ) : (cell || '—')}
                  </td>
                );
              })}</tr>
            )) : (
              <tr><td colSpan={headers.length}>—</td></tr>
            )}
          </tbody>
        </table>
        );
      };
      const editPaths = (base: string, keys: Array<string | null>, count: number) => {
        if (!onEditField) return undefined;
        const rows = Math.max(count, 1);
        return Array.from({ length: rows }, (_, index) => keys.map((key) => (key ? `${base}[${index}].${key}` : null)));
      };

      for (const field of fields) {
        const raw = readDocField(field, data);
        if (field.name === 'yearProjections' && schemeCode !== 'AP_CMEP') {
          flushParticulars();
          const years = Array.isArray(raw) ? raw : [];
          blocks.push(dataTable(
            field.path,
            field.label,
            ['Year', 'Sales (₹ Lakhs)', 'Raw material', 'Wages', 'Power', 'Net profit'],
            years.map((row) => {
              const item = row && typeof row === 'object' ? row as Record<string, unknown> : {};
              return [
                item.year != null ? `Year ${item.year}` : String(item.label || ''),
                String(item.sales ?? ''),
                String(item.rm ?? ''),
                String(item.wages ?? ''),
                String(item.power ?? ''),
                String(item.netProfit ?? ''),
              ];
            }),
            editPaths(field.path, [null, 'sales', 'rm', 'wages', 'power', 'netProfit'], years.length)
          ));
          continue;
        }
        if (field.name === 'yearProjections' && schemeCode === 'AP_CMEP') {
          flushParticulars();
          const columns = normalizeCmepProjections(raw);
          const amount = (value: number) => (Number.isInteger(value) ? String(value) : String(Math.round(value * 100) / 100));
          blocks.push(dataTable(
            field.path,
            'Sales and operating costs (₹ Lakhs)',
            ['Year', 'Sales', 'Raw material', 'Wages', 'Power', 'Salaries', 'Rent', 'Maintenance', 'Admin'],
            columns.map((col) => [col.label, amount(col.sales), amount(col.rm), amount(col.wages), amount(col.power), amount(col.salaries), amount(col.rent), amount(col.maintenance), amount(col.admin)])
          ));
          blocks.push(dataTable(
            `${field.path}.profit`,
            'Interest, depreciation and profit (₹ Lakhs)',
            ['Year', 'Interest', 'Depreciation', 'Tax', 'Net profit'],
            columns.map((col) => [col.label, amount(col.interest), amount(col.depreciation), amount(col.tax), amount(col.netProfit)])
          ));
          const derived = deriveCmepBankSheets({ step12: data.step12, step13: data.step13, step15: data.step15 });
          blocks.push(
            <table key="cmep-repay" className="individual-particulars">
              <caption className="individual-qa-q">{tf('Repayment, break-even and DSCR')}</caption>
              <thead>
                <tr>
                  <th>{tf('Particular')}</th>
                  <th>{tf('Details')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Term loan (₹ Lakhs)', amount(derived.repayment.amount)],
                  ['Interest rate (% per year)', amount(derived.repayment.rate)],
                  ['Moratorium (months)', String(derived.repayment.moratoriumMonths || 0)],
                  ['Loan tenure (months)', String(derived.repayment.tenureMonths || 0)],
                  ['Indicative EMI (₹ Lakhs)', amount(derived.repayment.emi)],
                  ['Break-even sales (₹ Lakhs)', amount(derived.breakEvenSales)],
                  ['Break-even capacity (%)', amount(derived.breakEvenCapacity)],
                  ['Average DSCR', amount(derived.averageDscr)],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td className="part">{tf(label)}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
          blocks.push(dataTable(
            'cmep-dscr',
            'DSCR by year (₹ Lakhs)',
            ['Year', 'Cash profit', 'Repayment', 'DSCR'],
            derived.dscr.map((row) => [row.label, amount(row.cashProfit), amount(row.repayment), amount(row.ratio)])
          ));
          derived.depreciation.forEach((asset) => {
            blocks.push(dataTable(
              `cmep-dep-${asset.asset}`,
              `${asset.asset} — depreciation ${Math.round(asset.rate * 100)}%`,
              ['Year', 'Opening', 'Additions', 'Depreciation', 'Closing'],
              asset.years.map((year) => [year.label, amount(year.opening), amount(year.additions), amount(year.depreciation), amount(year.closing)])
            ));
          });
          continue;
        }
        if (field.name === 'productMix') {
          flushParticulars();
          const mix = normalizeProductMix(raw);
          blocks.push(dataTable(field.path, field.label, ['Product', 'Share of output (%)', 'Selling price (₹)'], mix.map((row) => [row.name, String(row.sharePercent || ''), String(row.sellingPrice || '')]), editPaths(field.path, ['name', 'sharePercent', 'sellingPrice'], mix.length)));
          continue;
        }
        if (field.name === 'rawMaterialItems') {
          flushParticulars();
          const materials = normalizeRawMaterials(raw);
          blocks.push(dataTable(field.path, field.label, ['Material', 'Use', 'How it is bought'], materials.map((row) => [row.name, row.use, row.basis]), editPaths(field.path, ['name', 'use', 'basis'], materials.length)));
          continue;
        }
        if (field.name === 'staffRoles') {
          flushParticulars();
          const roles = normalizeStaffRoles(raw);
          blocks.push(dataTable(field.path, field.label, ['Role', 'Number of people', 'Monthly pay (₹)'], roles.map((row) => [row.role, String(row.count || ''), String(row.monthlyPay || '')]), editPaths(field.path, ['role', 'count', 'monthlyPay'], roles.length)));
          continue;
        }
        if (field.name === 'risks') {
          flushParticulars();
          const risks = normalizeRisks(raw);
          blocks.push(dataTable(field.path, field.label, ['Risk', 'How it will be handled'], risks.map((row) => [row.risk, row.mitigation]), editPaths(field.path, ['risk', 'mitigation'], risks.length)));
          continue;
        }
        if (field.name === 'utilisationByYear') {
          flushParticulars();
          const utilisation = normalizeUtilisationYears(raw);
          blocks.push(dataTable(field.path, field.label, ['Year', 'Capacity utilisation (%)'], utilisation.map((row) => [row.label, String(row.percent || '')]), editPaths(field.path, ['label', 'percent'], utilisation.length)));
          continue;
        }
        if (field.name === 'milestones') {
          flushParticulars();
          const milestones = normalizeMilestones(raw);
          blocks.push(dataTable(field.path, field.label, ['Activity', 'Time', 'Start', 'End'], milestones.map((row) => [row.activity, row.timeRequired, row.startDate, row.endDate]), editPaths(field.path, ['activity', 'timeRequired', 'startDate', 'endDate'], milestones.length)));
          continue;
        }
        if (field.name === 'promoters') {
          flushParticulars();
          const promoters = normalizePromoters(raw).filter((row) => onEditField || row.name || row.phone);
          blocks.push(dataTable(field.path, field.label, ['Name', 'Relation', 'Age', 'Education', 'Experience (years)', 'Phone'], promoters.map((row) => [row.name, row.relationName, row.age, row.education, row.experienceYears, row.phone]), editPaths(field.path, ['name', 'relationName', 'age', 'education', 'experienceYears', 'phone'], promoters.length)));
          continue;
        }
        if (field.name === 'machineryItems') {
          flushParticulars();
          const items = normalizeMachineryItems(raw);
          const detailed = schemeCode === 'AP_CMEP';
          const headers = ['Description', 'New / used', 'Supplier', 'Qty', 'Unit cost (₹ Lakhs)'];
          if (detailed) headers.push('GST', 'Transport', 'Installation', 'Life (years)', 'Yearly maintenance');
          const machineKeys = ['description', 'condition', 'supplier', 'quantity', 'unitCost'];
          if (detailed) machineKeys.push('gst', 'transport', 'installation', 'lifeYears', 'annualMaintenance');
          blocks.push(dataTable(field.path, field.label, headers, items.map((row) => {
            const cells = [row.description, row.condition, row.supplier, String(row.quantity || ''), String(row.unitCost || '')];
            if (detailed) cells.push(String(row.gst || ''), String(row.transport || ''), String(row.installation || ''), String(row.lifeYears || ''), String(row.annualMaintenance || ''));
            return cells;
          }), editPaths(field.path, machineKeys, items.length)));
          continue;
        }
        if (field.name === 'costPhasing') {
          flushParticulars();
          const phasing = normalizeCostPhasing(raw, data.step12);
          blocks.push(dataTable(field.path, field.label, ['Particulars', 'Already incurred', 'To be incurred', 'Total'], CMEP_COST_HEADS.map((head) => {
            const cell = phasing[head.key];
            return [tf(head.label), String(cell.incurred || 0), String(cell.proposed || 0), String((cell.incurred || 0) + (cell.proposed || 0))];
          })));
          continue;
        }
        const text = formatDocValue(raw);
        if (NARRATIVE_FIELDS.has(field.name) || (text !== '—' && text.length > 160)) {
          flushParticulars();
          blocks.push(prose(field, text));
          continue;
        }
        particulars.push(field);
      }
      flushParticulars();
      return <div className="individual-sec-body">{blocks}</div>;
  };

  const pageNumber =
    style?.pageNumberStyle === 'of' ? tf('Page 1 of …') : '1';

  return (
    <div
      className={`dpr-document individual-dpr-document${schemeUi ? ` ${schemeUi.documentClass}` : ''}${
        style ? ' dpr-styled' : ''
      }${style?.tableStriped ? ' dpr-striped' : ''}${style?.wideTablesLandscape ? ' dpr-wide-landscape' : ''}`}
      style={style ? styleCssVars(style) : undefined}
      data-dpr-styled={style ? '1' : undefined}
      data-page-size={style?.pageSize}
      data-page-edge-top={style ? String(pageEdgeMm(style.marginMm.top)) : undefined}
      data-page-edge-bottom={style ? String(pageEdgeMm(style.marginMm.bottom)) : undefined}
      data-wide-landscape={style?.wideTablesLandscape ? '1' : undefined}
      data-page-numbers={style?.pageNumberStyle}
    >
      {style?.watermark ? (
        <div className="dpr-watermark" aria-hidden="true">
          {style.watermark}
        </div>
      ) : null}
      {style && (style.agencyName || style.logoDataUrl || style.headerLine) ? (
        <div
          className={`dpr-style-header is-${style.logoAlign}${style.headerLine ? ' has-line' : ''}`}
        >
          {style.logoDataUrl ? <img src={style.logoDataUrl} alt="" className="dpr-style-logo" /> : null}
          {style.agencyName ? <span>{style.agencyName}</span> : null}
        </div>
      ) : null}
      <header className="individual-cover">
        {schemeUi?.id === 'PMEGP' ? (
          <>
            <div className="pmegp-flag-band" aria-hidden="true" />
            <div className="pmegp-cover-top">
              <div className="pmegp-agency">
                <span className="pmegp-agency-mark">KVIC</span>
                <span className="pmegp-agency-text">Khadi &amp; Village Industries Commission</span>
              </div>
              <p className="cover-pack-badge">{tf(schemeUi.badge)}</p>
            </div>
          </>
        ) : schemeUi ? (
          <p className="cover-pack-badge">{tf(schemeUi.badge)}</p>
        ) : null}
        <p className="cover-kicker">{schemeUi ? tf(schemeUi.coverKicker) : 'DETAILED PROJECT REPORT'}</p>
        <p className="cover-on">{tf('On')}</p>
        <p className="cover-action">{tf(cover.actionLine)}</p>
        <h1 className="cover-unit">
          {onEditField
            ? editableValue('step1.unitName', String(step1.unitName || step1.clusterName || '').trim() || '—', step1.unitName || step1.clusterName || '')
            : fieldHit('step1.unitName', cover.unitName || 'UNIT NAME', trackFieldHits)}
        </h1>
        <div className="cover-scheme-block">
          <p className="cover-scheme">{cover.underLine}</p>
          {schemeUi ? <p className="cover-tagline">{tf(schemeUi.tagline)}</p> : null}
        </div>
        <div className={`cover-meta${schemeUi?.id === 'PMEGP' ? ' pmegp-cover-meta' : ''}`}>
          <div>
            <span>{tf('District')}</span>
            {editableValue('step1.district', step1.district || '—', step1.district)}
          </div>
          <div>
            <span>{tf('Location')}</span>
            {editableValue('step1.location', step1.location || '—', step1.location)}
          </div>
          {(extras.entrepreneurName || onEditField) && (
            <div>
              <span>{tf('Entrepreneur name')}</span>
              {editableValue('schemeExtras.entrepreneurName', extras.entrepreneurName || '—', extras.entrepreneurName)}
            </div>
          )}
        </div>
        {schemeUi?.id === 'PMEGP' ? <div className="pmegp-cover-rule" aria-hidden="true" /> : null}
      </header>

      <section className="individual-toc">
        <h2 className="individual-sec-title">
          <span className="individual-sec-num">0</span>
          {tf('Table of Contents')}
        </h2>
        <ol className="individual-toc-list">
          {(style ? layoutOrder(catalogSteps, style) : catalogSteps.map((step) => step.id)).flatMap((token) => {
            if (pictureIdFromToken(token)) return [];
            const custom = style?.customSections?.find((item) => item.id === token);
            if (custom) {
              if (style?.hiddenSectionIds.includes(custom.id)) return [];
              return [{ id: custom.id, title: custom.title, n: 0, custom: true }];
            }
            const def = catalogSteps.find((step) => step.id === token);
            if (!def || style?.hiddenSectionIds.includes(def.id)) return [];
            return [{ id: def.id, title: sectionTitleFromStep(def), n: def.n, custom: false }];
          }).map((entry, index) => (
            <li
              key={entry.id}
              className={onSectionClick && !entry.custom ? 'is-clickable' : undefined}
              onClick={() => { if (!entry.custom) onSectionClick?.(entry.n); }}
            >
              <span className="toc-num">{style ? index + 1 : entry.n}</span>
              <span className="toc-label">{entry.custom ? entry.title : tf(entry.title)}</span>
            </li>
          ))}
        </ol>
      </section>

      {(style ? layoutOrder(catalogSteps, style) : catalogSteps.map((step) => step.id)).map((token) => {
        const custom = style?.customSections?.find((item) => item.id === token);
        if (custom) {
          if (style?.hiddenSectionIds.includes(custom.id)) return null;
          const customNum = (style ? layoutOrder(catalogSteps, style) : []).filter((item) => {
            if (pictureIdFromToken(item)) return false;
            if (style?.hiddenSectionIds.includes(item)) return false;
            return true;
          }).indexOf(custom.id) + 1;
          return (
            <section key={custom.id} data-dpr-section={custom.id} className="individual-sec">
              <h2 className="individual-sec-title">
                <span className="individual-sec-num">{customNum}</span>
                {custom.title}
              </h2>
              {renderBlocks(custom.id)}
            </section>
          );
        }
        const picId = pictureIdFromToken(token);
        if (picId) {
          const picture = style?.pictures?.find((item) => item.id === picId);
          if (!picture || picture.hidden) return null;
          return (
            <SlotFigure
              key={picture.id}
              src={picture.src}
              frame={picture.frame}
              onFrame={onImageFrame ? (box) => onImageFrame(picture.id, box) : undefined}
            />
          );
        }
        const def = catalogSteps.find((step) => step.id === token);
        if (!def || style?.hiddenSectionIds.includes(def.id)) return null;
        const title = tf(sectionTitleFromStep(def));
        const num = style ? steps.findIndex((step) => step.id === def.id) + 1 : def.n;
        const hot = activeSectionId === def.id;
        if (def.id === 'uploads' || def.contentStep === 18) {
          return (
            <section key={def.id} id={`individual-section-${def.n}`} data-dpr-section={def.id} className={`individual-sec${hot ? ' dpr-sec-hot' : ''}`}>
              <h2 className="individual-sec-title">
                <span className="individual-sec-num">{num}</span>
                {title}
              </h2>
              {uploads.length === 0 ? (
                <p className="individual-empty">—</p>
              ) : (
                <ul className="individual-doc-list">
                  {uploads.map((u) => {
                    const present = isKycUploaded(uploadStore[u.id] || uploadStore[u.label]);
                    return (
                      <li key={u.id} className={present ? 'is-uploaded' : 'is-pending'}>
                        <span className="doc-label">{tf(u.label)}</span>
                        <span className="doc-status">{tf(present ? 'Uploaded' : 'Pending')}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              {renderBlocks(def.id)}
            </section>
          );
        }
        const fields = getIndividualDocFields(def.contentStep, schemeCode, budget);
        return (
          <section key={def.id} id={`individual-section-${def.n}`} data-dpr-section={def.id} className={`individual-sec${hot ? ' dpr-sec-hot' : ''}`}>
            <h2 className="individual-sec-title">
              <span className="individual-sec-num">{num}</span>
              {title}
            </h2>
            {renderSectionFields(fields)}
            {renderBlocks(def.id)}
          </section>
        );
      })}

      {style ? (
        <footer className="dpr-style-footer">
          <span>{style.agencyName}</span>
          <span>{pageNumber}</span>
        </footer>
      ) : null}

      {schemeUi?.id === 'PMEGP' && !style ? (
        <footer className="pmegp-doc-footer">
          <span>PMEGP · Bank-unit Detailed Project Report</span>
          <span>Confidential — for lending appraisal</span>
        </footer>
      ) : null}
    </div>
  );
};
