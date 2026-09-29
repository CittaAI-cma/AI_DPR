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
import { isKycUploaded } from '@/lib/privacy/kycField';

export interface IndividualDPRDocumentViewProps {
  dpr: any;
  project?: any;
  viewLanguage?: 'english' | 'telugu';
  trackFieldHits?: boolean;
  onSectionClick?: (localStep: number) => void;
}

const SHORT_FIELD_NAMES = new Set([
  'unitName',
  'district',
  'location',
  'yearOfEstablishment',
  'entrepreneurName',
  'entrepreneurAge',
  'craft',
  'loanTranche',
  'trainingStage',
  'covOrLor',
  'vendingType',
  'workplaceType',
  'fssai',
  'unitStage',
  'odopAligned',
  'sectorType',
  'land',
  'building',
  'machinery',
  'utilitiesAndInfrastructure',
  'preliminaryAndPreOperative',
  'workingCapitalMargin',
  'ownContribution',
  'bankLoan',
  'subsidy',
  'startDate',
  'endDate',
  'irr',
  'npv',
  'dscr',
  'upiQr',
  'dailySales',
  'yearsVending',
  'yearsPractising',
]);

function fieldHit(
  path: string,
  children: React.ReactNode,
  track: boolean
): React.ReactNode {
  if (!track) return children;
  return <span data-dpr-field={path}>{children}</span>;
}

function isExpansiveField(field: IndividualDocField, formatted: string): boolean {
  if (SHORT_FIELD_NAMES.has(field.name)) return false;
  if (formatted === '—' || formatted.length <= 48) return false;
  // Multi-line / paragraph answers get the wide PDF block
  if (formatted.includes('\n') || formatted.length > 48) return true;
  // Description-ish labels
  const label = field.label.toLowerCase();
  return (
    label.includes('description') ||
    label.includes('intro') ||
    label.includes('summary') ||
    label.includes('process') ||
    label.includes('analysis') ||
    label.includes('importance') ||
    label.includes('justification') ||
    label.includes('gap') ||
    label.includes('story') ||
    label.includes('activity')
  );
}

export const IndividualDPRDocumentView: React.FC<IndividualDPRDocumentViewProps> = ({
  dpr,
  project,
  viewLanguage = 'english',
  trackFieldHits = false,
  onSectionClick,
}) => {
  const tf = useClusterFormText();
  const data = extractIndividualDocData(dpr, project);
  const schemeCode = extractSchemeCode(dpr, project, data);
  const schemeUi = getSchemeUiTemplate(schemeCode);
  const steps = getSchemeDocSteps(schemeCode);
  const step1 = data.step1 || {};
  const extras = data.schemeExtras || {};
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

    const shortFields: Array<{ field: IndividualDocField; text: string }> = [];
    const longFields: Array<{ field: IndividualDocField; text: string }> = [];

    for (const field of fields) {
      const raw = readDocField(field, data);
      const text = formatDocValue(raw);
      if (isExpansiveField(field, text)) longFields.push({ field, text });
      else shortFields.push({ field, text });
    }

    return (
      <div className="individual-sec-body">
        {shortFields.length > 0 && (
          <dl className="individual-meta-grid">
            {shortFields.map(({ field, text }) => (
              <div key={field.path} className="individual-meta-item">
                <dt>{tf(field.label)}</dt>
                <dd>
                  {fieldHit(
                    field.path,
                    text === '—' ? tf('Not filled') : tf(text),
                    trackFieldHits
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {longFields.map(({ field, text }) => (
          <article key={field.path} className="individual-qa-block">
            <h3 className="individual-qa-q">{tf(field.label)}</h3>
            <div className={`individual-qa-a${text === '—' ? ' is-empty' : ''}`}>
              {fieldHit(
                field.path,
                text === '—' ? tf('Not filled yet — complete this in the form.') : text,
                trackFieldHits
              )}
            </div>
          </article>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`dpr-document individual-dpr-document${schemeUi ? ` ${schemeUi.documentClass}` : ''}`}
    >
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

      <section className="individual-toc">
        <h2 className="individual-sec-title">
          <span className="individual-sec-num">0</span>
          {tf('Table of Contents')}
        </h2>
        <ol className="individual-toc-list">
          {steps.map((def) => (
            <li
              key={def.id}
              className={onSectionClick ? 'is-clickable' : undefined}
              onClick={() => onSectionClick?.(def.n)}
            >
              <span className="toc-num">{def.n}</span>
              <span className="toc-label">{tf(sectionTitleFromStep(def))}</span>
            </li>
          ))}
        </ol>
      </section>

      {steps.map((def) => {
        const title = tf(sectionTitleFromStep(def));
        if (def.id === 'uploads' || def.contentStep === 18) {
          return (
            <section key={def.id} id={`individual-section-${def.n}`} className="individual-sec">
              <h2 className="individual-sec-title">
                <span className="individual-sec-num">{def.n}</span>
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
            </section>
          );
        }

        const fields = getIndividualDocFields(def.contentStep, schemeCode, budget);
        return (
          <section key={def.id} id={`individual-section-${def.n}`} className="individual-sec">
            <h2 className="individual-sec-title">
              <span className="individual-sec-num">{def.n}</span>
              {title}
            </h2>
            {renderSectionFields(fields)}
          </section>
        );
      })}

      {schemeUi?.id === 'PMEGP' ? (
        <footer className="pmegp-doc-footer">
          <span>PMEGP · Bank-unit Detailed Project Report</span>
          <span>Confidential — for lending appraisal</span>
        </footer>
      ) : null}
    </div>
  );
};
