import React from 'react';
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
  imageWidthPct,
  pageEdgeMm,
  resolveDocumentStyle,
  styleCssVars,
  type DocumentStyle,
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
  /** Drag the picture edge in the live report. Slot is cover, annexure, or a section id. */
  onImageWidth?: (slot: string, pct: number) => void;
}

function SlotFigure({
  src,
  widthPct,
  onWidth,
}: {
  src: string;
  widthPct: number;
  onWidth?: (pct: number) => void;
}) {
  const tf = useClusterFormText();
  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!onWidth) return;
    event.preventDefault();
    event.stopPropagation();
    const figure = event.currentTarget.parentElement;
    const host = figure?.parentElement;
    if (!figure || !host) return;
    const startX = event.clientX;
    const startW = figure.getBoundingClientRect().width;
    const maxW = host.getBoundingClientRect().width || startW;
    const move = (moveEvent: PointerEvent) => {
      const nextPx = Math.min(maxW, Math.max(maxW * 0.2, startW + (moveEvent.clientX - startX)));
      onWidth(Math.round((nextPx / maxW) * 100));
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  };

  return (
    <figure className="dpr-slot-figure" style={{ width: `${widthPct}%` }}>
      <img src={src} alt="" />
      {onWidth ? (
        <button
          type="button"
          className="dpr-slot-resize"
          aria-label={tf('Resize picture')}
          title={tf('Resize picture')}
          onPointerDown={onPointerDown}
        />
      ) : null}
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

export const IndividualDPRDocumentView: React.FC<IndividualDPRDocumentViewProps> = ({
  dpr,
  project,
  viewLanguage = 'english',
  trackFieldHits = false,
  onSectionClick,
  documentStyle,
  activeSectionId = null,
  onImageWidth,
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
                      {fieldHit(field.path, empty ? '—' : tf(text), trackFieldHits)}
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
            {fieldHit(field.path, text === '—' ? '—' : text, trackFieldHits)}
          </div>
        </article>
      );
      const dataTable = (key: string, title: string, headers: string[], body: string[][]) => (
        <table key={key} className="individual-particulars">
          <caption className="individual-qa-q">{tf(title)}</caption>
          <thead>
            <tr>{headers.map((header) => <th key={header}>{tf(header)}</th>)}</tr>
          </thead>
          <tbody>
            {body.length ? body.map((row, index) => (
              <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell || '—'}</td>)}</tr>
            )) : (
              <tr><td colSpan={headers.length}>—</td></tr>
            )}
          </tbody>
        </table>
      );

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
            })
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
          blocks.push(dataTable(field.path, field.label, ['Product', 'Share of output (%)', 'Selling price (₹)'], normalizeProductMix(raw).map((row) => [row.name, String(row.sharePercent || ''), String(row.sellingPrice || '')])));
          continue;
        }
        if (field.name === 'rawMaterialItems') {
          flushParticulars();
          blocks.push(dataTable(field.path, field.label, ['Material', 'Use', 'How it is bought'], normalizeRawMaterials(raw).map((row) => [row.name, row.use, row.basis])));
          continue;
        }
        if (field.name === 'staffRoles') {
          flushParticulars();
          blocks.push(dataTable(field.path, field.label, ['Role', 'Number of people', 'Monthly pay (₹)'], normalizeStaffRoles(raw).map((row) => [row.role, String(row.count || ''), String(row.monthlyPay || '')])));
          continue;
        }
        if (field.name === 'risks') {
          flushParticulars();
          blocks.push(dataTable(field.path, field.label, ['Risk', 'How it will be handled'], normalizeRisks(raw).map((row) => [row.risk, row.mitigation])));
          continue;
        }
        if (field.name === 'utilisationByYear') {
          flushParticulars();
          blocks.push(dataTable(field.path, field.label, ['Year', 'Capacity utilisation (%)'], normalizeUtilisationYears(raw).map((row) => [row.label, String(row.percent || '')])));
          continue;
        }
        if (field.name === 'milestones') {
          flushParticulars();
          blocks.push(dataTable(field.path, field.label, ['Activity', 'Time', 'Start', 'End'], normalizeMilestones(raw).map((row) => [row.activity, row.timeRequired, row.startDate, row.endDate])));
          continue;
        }
        if (field.name === 'promoters') {
          flushParticulars();
          blocks.push(dataTable(field.path, field.label, ['Name', 'Relation', 'Age', 'Education', 'Experience (years)', 'Phone'], normalizePromoters(raw).filter((row) => row.name || row.phone).map((row) => [row.name, row.relationName, row.age, row.education, row.experienceYears, row.phone])));
          continue;
        }
        if (field.name === 'machineryItems') {
          flushParticulars();
          const items = normalizeMachineryItems(raw);
          const detailed = schemeCode === 'AP_CMEP';
          const headers = ['Description', 'New / used', 'Supplier', 'Qty', 'Unit cost (₹ Lakhs)'];
          if (detailed) headers.push('GST', 'Transport', 'Installation', 'Life (years)', 'Yearly maintenance');
          blocks.push(dataTable(field.path, field.label, headers, items.map((row) => {
            const cells = [row.description, row.condition, row.supplier, String(row.quantity || ''), String(row.unitCost || '')];
            if (detailed) cells.push(String(row.gst || ''), String(row.transport || ''), String(row.installation || ''), String(row.lifeYears || ''), String(row.annualMaintenance || ''));
            return cells;
          })));
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
          {fieldHit('step1.unitName', cover.unitName || 'UNIT NAME', trackFieldHits)}
        </h1>
        <div className="cover-scheme-block">
          <p className="cover-scheme">{cover.underLine}</p>
          {schemeUi ? <p className="cover-tagline">{tf(schemeUi.tagline)}</p> : null}
        </div>
        <div className={`cover-meta${schemeUi?.id === 'PMEGP' ? ' pmegp-cover-meta' : ''}`}>
          <div>
            <span>{tf('District')}</span>
            {fieldHit('step1.district', step1.district || '—', trackFieldHits)}
          </div>
          <div>
            <span>{tf('Location')}</span>
            {fieldHit('step1.location', step1.location || '—', trackFieldHits)}
          </div>
          {extras.entrepreneurName && (
            <div>
              <span>{tf('Entrepreneur name')}</span>
              {fieldHit('schemeExtras.entrepreneurName', extras.entrepreneurName, trackFieldHits)}
            </div>
          )}
        </div>
        {schemeUi?.id === 'PMEGP' ? <div className="pmegp-cover-rule" aria-hidden="true" /> : null}
      </header>
      {style?.images.cover ? (
        <SlotFigure
          src={style.images.cover}
          widthPct={style ? imageWidthPct(style, 'cover') : 100}
          onWidth={onImageWidth ? (pct) => onImageWidth('cover', pct) : undefined}
        />
      ) : null}

      <section className="individual-toc">
        <h2 className="individual-sec-title">
          <span className="individual-sec-num">0</span>
          {tf('Table of Contents')}
        </h2>
        <ol className="individual-toc-list">
          {steps.map((def, index) => (
            <li
              key={def.id}
              className={onSectionClick ? 'is-clickable' : undefined}
              onClick={() => onSectionClick?.(def.n)}
            >
              <span className="toc-num">{style ? index + 1 : def.n}</span>
              <span className="toc-label">{tf(sectionTitleFromStep(def))}</span>
            </li>
          ))}
        </ol>
      </section>

      {steps.map((def, index) => {
        const title = tf(sectionTitleFromStep(def));
        const num = style ? index + 1 : def.n;
        const hot = activeSectionId === def.id;
        const afterImage = style?.images.after?.[def.id];
        if (def.id === 'uploads' || def.contentStep === 18) {
          return (
            <section key={def.id} id={`individual-section-${def.n}`} className={`individual-sec${hot ? ' dpr-sec-hot' : ''}`}>
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
              {afterImage ? (
                <SlotFigure
                  src={afterImage}
                  widthPct={style ? imageWidthPct(style, def.id) : 100}
                  onWidth={onImageWidth ? (pct) => onImageWidth(def.id, pct) : undefined}
                />
              ) : null}
            </section>
          );
        }

        const fields = getIndividualDocFields(def.contentStep, schemeCode, budget);
        return (
          <section key={def.id} id={`individual-section-${def.n}`} className={`individual-sec${hot ? ' dpr-sec-hot' : ''}`}>
            <h2 className="individual-sec-title">
              <span className="individual-sec-num">{num}</span>
              {title}
            </h2>
            {renderSectionFields(fields)}
            {afterImage ? (
              <SlotFigure
                src={afterImage}
                widthPct={style ? imageWidthPct(style, def.id) : 100}
                onWidth={onImageWidth ? (pct) => onImageWidth(def.id, pct) : undefined}
              />
            ) : null}
          </section>
        );
      })}

      {style?.images.annexure ? (
        <section className="individual-sec">
          <h2 className="individual-sec-title">
            <span className="individual-sec-num">{steps.length + 1}</span>
            {tf('Annexure')}
          </h2>
          <SlotFigure
            src={style.images.annexure}
            widthPct={style ? imageWidthPct(style, 'annexure') : 100}
            onWidth={onImageWidth ? (pct) => onImageWidth('annexure', pct) : undefined}
          />
        </section>
      ) : null}

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
