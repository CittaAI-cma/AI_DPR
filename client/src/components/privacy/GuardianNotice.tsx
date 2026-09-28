import React from 'react';
import { useTranslation } from 'react-i18next';

export const GuardianNotice: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 ${className || ''}`}
      role="alert"
    >
      {t('privacy.guardianMessage')}
    </div>
  );
};
