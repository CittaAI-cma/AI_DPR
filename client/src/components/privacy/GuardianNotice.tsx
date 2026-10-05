import React from 'react';
import { useTranslation } from 'react-i18next';

export const GuardianNotice = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => {
    const { t } = useTranslation();
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ${className || ''}`}
        role="alert"
      >
        {t('privacy.guardianMessage')}
      </div>
    );
  }
);
GuardianNotice.displayName = 'GuardianNotice';

