import React from 'react';
import { Input } from '@/components/ui/Input';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import {
  CMEP_LINE_ITEMS,
  type CmepLineKey,
  type CmepYearColumn,
} from '@/lib/individualDpr/cmepProjections';

type CmepProjectionTableProps = {
  columns: CmepYearColumn[];
  readOnly?: boolean;
  onChange?: (next: CmepYearColumn[]) => void;
};

function displayAmount(value: number): string {
  if (!value) return '–';
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export const CmepProjectionTable: React.FC<CmepProjectionTableProps> = ({
  columns,
  readOnly = false,
  onChange,
}) => {
  const tf = useClusterFormText();
  const previous = columns.filter((col) => col.period === 'previous');
  const projected = columns.filter((col) => col.period === 'projected');

  const update = (index: number, key: CmepLineKey, value: number) => {
    if (!onChange) return;
    onChange(columns.map((col, i) => (i === index ? { ...col, [key]: value } : col)));
  };

  return (
    <div className="cmep-fin-sheet">
      <div className="cmep-fin-banner">
        <span>{tf('Financial projections')}</span>
      </div>
      <p className="cmep-fin-unit">{tf('Rs. In Lakhs')}</p>
      <div className="cmep-fin-scroll">
        <table className="cmep-fin-table">
          <thead>
            <tr>
              <th className="cmep-fin-sl" rowSpan={2}>
                {tf('Sl. No.')}
              </th>
              <th className="cmep-fin-particulars" rowSpan={2}>
                {tf('Year')} →
                <br />
                {tf('Particulars')} ↓
              </th>
              {previous.length > 0 && (
                <th colSpan={previous.length} className="cmep-fin-group">
                  {tf('Previous')}
                </th>
              )}
              {projected.length > 0 && (
                <th colSpan={projected.length} className="cmep-fin-group cmep-fin-group-projected">
                  {tf('Projected')}
                </th>
              )}
            </tr>
            <tr>
              {columns.map((col) => (
                <th key={col.label} className="cmep-fin-year">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CMEP_LINE_ITEMS.map((line, lineIndex) => (
              <tr key={line.key}>
                <td className="cmep-fin-sl">{lineIndex + 1}</td>
                <td className="cmep-fin-particulars">{tf(line.label)}</td>
                {columns.map((col, colIndex) => (
                  <td key={`${col.label}-${line.key}`} className="cmep-fin-amt">
                    {readOnly ? (
                      displayAmount(col[line.key])
                    ) : (
                      <Input
                        type="number"
                        value={col[line.key] || ''}
                        onChange={(e) => update(colIndex, line.key, parseFloat(e.target.value) || 0)}
                        aria-label={`${line.label} ${col.label}`}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
