import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import { cmepProjectionColumns } from '@/lib/individualDpr/cmepProjections';
import {
  normalizeProductMix,
  normalizeRawMaterials,
  normalizeRisks,
  normalizeStaffRoles,
  normalizeUtilisationYears,
  workingCapitalFromBuildup,
  type ProductMixRow,
  type RawMaterialRow,
  type RiskRow,
  type StaffRoleRow,
} from '@/lib/individualDpr/cmepBankPack';

function RowList<T>({
  title,
  rows,
  onChange,
  blank,
  render,
  addLabel,
}: {
  title: string;
  rows: T[];
  onChange: (next: T[]) => void;
  blank: T;
  render: (row: T, index: number, update: (patch: Partial<T>) => void) => React.ReactNode;
  addLabel: string;
}) {
  const tf = useClusterFormText();
  return (
    <div className="space-y-2 border rounded-md p-4">
      <h4 className="font-semibold">{tf(title)}</h4>
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
          {render(row, index, (patch) => onChange(rows.map((item, i) => (i === index ? { ...item, ...patch } : item))))}
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(rows.filter((_, i) => i !== index))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => onChange([...rows, blank])}>
        <Plus className="h-4 w-4" />
        {tf(addLabel)}
      </Button>
    </div>
  );
}

export function ProductMixEditor({ value, onChange }: { value: unknown; onChange: (next: ProductMixRow[]) => void }) {
  const tf = useClusterFormText();
  const rows = normalizeProductMix(value);
  return (
    <RowList
      title="Products, share of output and selling price"
      rows={rows}
      onChange={onChange}
      blank={{ name: '', sharePercent: 0, sellingPrice: 0 }}
      addLabel="Add product"
      render={(row, _index, update) => (
        <>
          <Input className="md:col-span-2" value={row.name} placeholder={tf('Product')} onChange={(e) => update({ name: e.target.value })} />
          <Input type="number" value={row.sharePercent || ''} placeholder={tf('Share of output (%)')} onChange={(e) => update({ sharePercent: parseFloat(e.target.value) || 0 })} />
          <Input className="md:col-span-2" type="number" value={row.sellingPrice || ''} placeholder={tf('Selling price (₹)')} onChange={(e) => update({ sellingPrice: parseFloat(e.target.value) || 0 })} />
        </>
      )}
    />
  );
}

export function RawMaterialEditor({ value, onChange }: { value: unknown; onChange: (next: RawMaterialRow[]) => void }) {
  const tf = useClusterFormText();
  const rows = normalizeRawMaterials(value);
  return (
    <RowList
      title="Raw materials"
      rows={rows}
      onChange={onChange}
      blank={{ name: '', use: '', basis: '' }}
      addLabel="Add raw material"
      render={(row, _index, update) => (
        <>
          <Input className="md:col-span-2" value={row.name} placeholder={tf('Material')} onChange={(e) => update({ name: e.target.value })} />
          <Input className="md:col-span-2" value={row.use} placeholder={tf('Use')} onChange={(e) => update({ use: e.target.value })} />
          <Input value={row.basis} placeholder={tf('How it is bought')} onChange={(e) => update({ basis: e.target.value })} />
        </>
      )}
    />
  );
}

export function StaffRoleEditor({ value, onChange }: { value: unknown; onChange: (next: StaffRoleRow[]) => void }) {
  const tf = useClusterFormText();
  const rows = normalizeStaffRoles(value);
  return (
    <RowList
      title="Staff by role and monthly pay"
      rows={rows}
      onChange={onChange}
      blank={{ role: '', count: 0, monthlyPay: 0 }}
      addLabel="Add role"
      render={(row, _index, update) => (
        <>
          <Input className="md:col-span-3" value={row.role} placeholder={tf('Role')} onChange={(e) => update({ role: e.target.value })} />
          <Input type="number" value={row.count || ''} placeholder={tf('Number of people')} onChange={(e) => update({ count: parseFloat(e.target.value) || 0 })} />
          <Input type="number" value={row.monthlyPay || ''} placeholder={tf('Monthly pay (₹)')} onChange={(e) => update({ monthlyPay: parseFloat(e.target.value) || 0 })} />
        </>
      )}
    />
  );
}

export function RiskEditor({ value, onChange }: { value: unknown; onChange: (next: RiskRow[]) => void }) {
  const tf = useClusterFormText();
  const rows = normalizeRisks(value);
  return (
    <RowList
      title="Risks and how they will be handled"
      rows={rows}
      onChange={onChange}
      blank={{ risk: '', mitigation: '' }}
      addLabel="Add risk"
      render={(row, _index, update) => (
        <>
          <Input className="md:col-span-2" value={row.risk} placeholder={tf('Risk')} onChange={(e) => update({ risk: e.target.value })} />
          <Input className="md:col-span-3" value={row.mitigation} placeholder={tf('How it will be handled')} onChange={(e) => update({ mitigation: e.target.value })} />
        </>
      )}
    />
  );
}

export function UtilisationYearEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: Array<{ label: string; percent: number }>) => void;
}) {
  const tf = useClusterFormText();
  const saved = normalizeUtilisationYears(value);
  const projected = cmepProjectionColumns().filter((col) => col.period === 'projected');
  const rows = projected.map((col) => ({
    label: col.label,
    percent: saved.find((row) => row.label === col.label)?.percent || 0,
  }));
  return (
    <div className="space-y-2 border rounded-md p-4">
      <h4 className="font-semibold">{tf('Capacity utilisation by projected year')}</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {rows.map((row) => (
          <div key={row.label}>
            <label className="block text-xs font-medium mb-1">{row.label}</label>
            <Input
              type="number"
              value={row.percent || ''}
              placeholder="%"
              onChange={(e) =>
                onChange(rows.map((item) => (item.label === row.label ? { ...item, percent: parseFloat(e.target.value) || 0 } : item)))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const WC_FIELDS: Array<[string, string]> = [
  ['wcRawStock', 'Raw material stock (₹ Lakhs)'],
  ['wcWip', 'Work in progress (₹ Lakhs)'],
  ['wcFinished', 'Finished goods (₹ Lakhs)'],
  ['wcReceivables', 'Receivables (₹ Lakhs)'],
  ['wcSupplierCredit', 'Supplier credit (₹ Lakhs)'],
  ['wcCash', 'Cash (₹ Lakhs)'],
];

export function WorkingCapitalBuildupEditor({
  step,
  onChange,
}: {
  step: Record<string, unknown>;
  onChange: (patch: Record<string, number>) => void;
}) {
  const tf = useClusterFormText();
  const edit = (field: string, value: number) => {
    const next = { ...step, [field]: value };
    onChange({ [field]: value, workingCapitalMargin: workingCapitalFromBuildup(next) });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4">
      <h4 className="md:col-span-2 font-semibold">{tf('Working capital buildup')}</h4>
      <p className="md:col-span-2 text-sm text-muted-foreground">
        {tf('Stock, work in progress, finished goods, receivables and cash, less supplier credit.')}
      </p>
      {WC_FIELDS.map(([field, label]) => (
        <div key={field}>
          <label className="block text-sm font-medium mb-2">{tf(label)}</label>
          <Input type="number" value={(step[field] as number) || ''} onChange={(e) => edit(field, parseFloat(e.target.value) || 0)} />
        </div>
      ))}
    </div>
  );
}
