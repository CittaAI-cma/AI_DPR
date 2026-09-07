import React from 'react';
import { useTranslation } from 'react-i18next';
import { SchemeExclusion } from '@/lib/ventureMatch/types';

interface VentureMatchStepExclusionsProps {
  excluded: SchemeExclusion[];
}

export const VentureMatchStepExclusions: React.FC<VentureMatchStepExclusionsProps> = ({
  excluded,
}) => {
  const { t } = useTranslation();
  if (!excluded.length) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-24">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        {t('ventureMatch.stepExclusionsTitle')}
      </h3>
      <div className="max-h-[min(40vh,320px)] overflow-y-auto space-y-2 pr-1">
        {excluded.map((scheme) => {
          const name = t(`ventureMatch.schemes.${scheme.code}.name`, { defaultValue: scheme.name });
          const reasons = scheme.criteria.map((item) => t(item.labelKey));
          const reason = reasons.join('; ');
          return (
            <div
              key={scheme.code}
              className="rounded-[12px] border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-foreground"
            >
              {reasons.length <= 1
                ? t('ventureMatch.stepExclusionBecause', { name, reason })
                : t('ventureMatch.stepExclusionBecauseMany', { name, reason })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
