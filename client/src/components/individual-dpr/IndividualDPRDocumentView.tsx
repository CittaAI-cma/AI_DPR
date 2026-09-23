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
      <table className="w-full border-collapse text-sm mb-4">
        <thead>
          <tr style={{ backgroundColor: '#F3F4F6' }}>
            <th
              className="border px-3 py-2 text-left w-2/5"
              style={{ borderColor: '#1F2937' }}
            >
              {tf('Question')}
            </th>
            <th className="border px-3 py-2 text-left" style={{ borderColor: '#1F2937' }}>
              {tf('Answer')}
            </th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => {
            const raw = readDocField(field, data);
            return (
              <tr key={field.path}>
                <td className="border px-3 py-2 align-top font-medium" style={{ borderColor: '#1F2937' }}>
                  {tf(field.label)}
                </td>
                <td className="border px-3 py-2 align-top whitespace-pre-wrap" style={{ borderColor: '#1F2937' }}>
                  {fieldHit(field.path, formatDocValue(raw), trackFieldHits)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="text-gray-900 dpr-document" style={{ color: '#1F2937' }}>
      <div className="mb-10 pb-8" style={{ borderBottom: '2px solid #1F2937' }}>
        <h1 className="text-3xl font-bold text-center tracking-wide mb-2">DETAILED PROJECT REPORT</h1>
        <h2 className="text-xl font-semibold text-center mb-1">{tf('On')}</h2>
        <h2 className="text-xl font-semibold text-center">{tf(cover.actionLine)}</h2>
        <h2 className="text-2xl font-bold text-center uppercase my-2" style={{ color: '#059669' }}>
          {fieldHit('step1.unitName', cover.unitName || 'UNIT NAME', trackFieldHits)}
        </h2>
        <p className="text-center font-semibold">{cover.underLine}</p>
        <div className="mt-6 max-w-md mx-auto text-sm space-y-1">
          <p>
            <span className="font-semibold">{tf('District')}: </span>
            {fieldHit('step1.district', step1.district || '—', trackFieldHits)}
          </p>
          <p>
            <span className="font-semibold">{tf('Location')}: </span>
            {fieldHit('step1.location', step1.location || '—', trackFieldHits)}
          </p>
          {extras.entrepreneurName && (
            <p>
              <span className="font-semibold">{tf('Entrepreneur name')}: </span>
              {fieldHit('schemeExtras.entrepreneurName', extras.entrepreneurName, trackFieldHits)}
            </p>
          )}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-bold mb-3">{tf('Table of Contents')}</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F3F4F6' }}>
              <th className="border px-3 py-2 text-left w-16" style={{ borderColor: '#1F2937' }}>
                #
              </th>
              <th className="border px-3 py-2 text-left" style={{ borderColor: '#1F2937' }}>
                {tf('Section')}
              </th>
            </tr>
          </thead>
          <tbody>
            {steps.map((def) => (
              <tr
                key={def.id}
                className={onSectionClick ? 'cursor-pointer hover:bg-muted/40' : undefined}
                onClick={() => onSectionClick?.(def.n)}
              >
                <td className="border px-3 py-2" style={{ borderColor: '#1F2937' }}>
                  {def.n}
                </td>
                <td className="border px-3 py-2" style={{ borderColor: '#1F2937' }}>
                  {tf(sectionTitleFromStep(def))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {steps.map((def) => {
        const heading = `${def.n}. ${tf(sectionTitleFromStep(def))}`;
        if (def.id === 'uploads' || def.contentStep === 18) {
          return (
            <div key={def.id} id={`individual-section-${def.n}`} className="mb-10">
              <h2 className="text-xl font-bold mb-3">{heading}</h2>
              {uploads.length === 0 ? (
                <p className="text-sm">—</p>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr style={{ backgroundColor: '#F3F4F6' }}>
                      <th className="border px-3 py-2 text-left" style={{ borderColor: '#1F2937' }}>
                        {tf('Document')}
                      </th>
                      <th className="border px-3 py-2 text-left w-32" style={{ borderColor: '#1F2937' }}>
                        {tf('Status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map((u) => {
                      const present = !!(uploadStore[u.id] || uploadStore[u.label]);
                      return (
                        <tr key={u.id}>
                          <td className="border px-3 py-2" style={{ borderColor: '#1F2937' }}>
                            {tf(u.label)}
                          </td>
                          <td className="border px-3 py-2" style={{ borderColor: '#1F2937' }}>
                            {tf(present ? 'Uploaded' : 'Pending')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        }

        const fields = getIndividualDocFields(def.contentStep, schemeCode, budget);
        return (
          <div key={def.id} id={`individual-section-${def.n}`} className="mb-10">
            <h2 className="text-xl font-bold mb-3">{heading}</h2>
            {renderQaTable(fields)}
          </div>
        );
      })}
    </div>
  );
};
