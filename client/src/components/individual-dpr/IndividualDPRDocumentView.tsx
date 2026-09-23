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

export interface IndividualDPRDocumentViewProps {
  dpr: any;
  project?: any;
  viewLanguage?: 'english' | 'telugu';
  trackFieldHits?: boolean;
  onSectionClick?: (localStep: number) => void;
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
}) => {
  const tf = useClusterFormText();
  const data = extractIndividualDocData(dpr, project);
  const schemeCode = extractSchemeCode(dpr, project, data);
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

  const renderQaTable = (fields: IndividualDocField[]) => {
    if (!fields.length) return null;
    return (
      <table className="individual-qa">
        <colgroup>
          <col style={{ width: '36%' }} />
          <col style={{ width: '64%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>{tf('Question')}</th>
            <th>{tf('Answer')}</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => {
            const raw = readDocField(field, data);
            return (
              <tr key={field.path}>
                <td className="q">{tf(field.label)}</td>
                <td className="a">{fieldHit(field.path, formatDocValue(raw), trackFieldHits)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dpr-document individual-dpr-document">
      <header className="individual-cover">
        <p className="cover-kicker">DETAILED PROJECT REPORT</p>
        <p className="cover-on">{tf('On')}</p>
        <p className="cover-action">{tf(cover.actionLine)}</p>
        <h1 className="cover-unit">
          {fieldHit('step1.unitName', cover.unitName || 'UNIT NAME', trackFieldHits)}
        </h1>
        <p className="cover-scheme">{cover.underLine}</p>
        <div className="cover-meta">
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
      </header>

      <section className="individual-toc">
        <h2>{tf('Table of Contents')}</h2>
        <table className="individual-qa toc">
          <colgroup>
            <col style={{ width: '12%' }} />
            <col style={{ width: '88%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>{tf('Section')}</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((def) => (
              <tr
                key={def.id}
                className={onSectionClick ? 'is-clickable' : undefined}
                onClick={() => onSectionClick?.(def.n)}
              >
                <td className="num">{def.n}</td>
                <td>{tf(sectionTitleFromStep(def))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {steps.map((def) => {
        const heading = `${def.n}. ${tf(sectionTitleFromStep(def))}`;
        if (def.id === 'uploads' || def.contentStep === 18) {
          return (
            <section key={def.id} id={`individual-section-${def.n}`} className="individual-sec">
              <h2>{heading}</h2>
              {uploads.length === 0 ? (
                <p className="empty">—</p>
              ) : (
                <table className="individual-qa">
                  <colgroup>
                    <col style={{ width: '72%' }} />
                    <col style={{ width: '28%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>{tf('Document')}</th>
                      <th>{tf('Status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map((u) => {
                      const present = !!(uploadStore[u.id] || uploadStore[u.label]);
                      return (
                        <tr key={u.id}>
                          <td>{tf(u.label)}</td>
                          <td>{tf(present ? 'Uploaded' : 'Pending')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>
          );
        }

        const fields = getIndividualDocFields(def.contentStep, schemeCode, budget);
        return (
          <section key={def.id} id={`individual-section-${def.n}`} className="individual-sec">
            <h2>{heading}</h2>
            {renderQaTable(fields)}
          </section>
        );
      })}
    </div>
  );
};
