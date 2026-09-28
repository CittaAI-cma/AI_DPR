import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PRIVACY_NOTICE_VERSION } from '@/lib/privacy/constants';
import { PrivacyNoticeScroll } from './PrivacyNoticeScroll';

export interface ConsentValues {
  accountConsent: boolean;
  aiAssist: boolean;
  analytics: boolean;
  noticeRead: boolean;
}

interface ConsentFieldsProps {
  value: ConsentValues;
  onChange: (next: ConsentValues) => void;
  idPrefix?: string;
}

export const ConsentFields: React.FC<ConsentFieldsProps> = ({
  value,
  onChange,
  idPrefix = 'consent',
}) => {
  const { t, i18n } = useTranslation();
  const langRef = useRef(i18n.language);

  useEffect(() => {
    if (langRef.current === i18n.language) return;
    langRef.current = i18n.language;
    onChange({ ...value, noticeRead: false, accountConsent: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
      <PrivacyNoticeScroll
        reachedEnd={value.noticeRead}
        onReachedEnd={() => {
          if (!value.noticeRead) onChange({ ...value, noticeRead: true });
        }}
      />

      <label className={`flex items-start gap-3 ${value.noticeRead ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
        <input
          id={`${idPrefix}-account`}
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={value.accountConsent}
          disabled={!value.noticeRead}
          onChange={(e) => {
            if (!value.noticeRead) return;
            onChange({ ...value, accountConsent: e.target.checked });
          }}
          required
        />
        <span>
          {t('privacy.accountConsent')}{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            {t('privacy.noticeLink')}
          </a>{' '}
          {t('privacy.accountConsentAfter')}.
        </span>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          id={`${idPrefix}-ai`}
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={value.aiAssist}
          onChange={(e) => onChange({ ...value, aiAssist: e.target.checked })}
        />
        <span>
          {t('privacy.aiConsent')}
          {!value.aiAssist && (
            <span className="block mt-1 text-xs text-amber-800">{t('privacy.aiOffWarning')}</span>
          )}
        </span>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          id={`${idPrefix}-analytics`}
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={value.analytics}
          onChange={(e) => onChange({ ...value, analytics: e.target.checked })}
        />
        <span>{t('privacy.analyticsConsent')}</span>
      </label>
      <p className="text-xs text-muted-foreground">{t('privacy.noticeVersion', { version: PRIVACY_NOTICE_VERSION })}</p>
    </div>
  );
};
