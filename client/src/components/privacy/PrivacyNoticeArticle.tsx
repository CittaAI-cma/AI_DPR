import React from 'react';
import { getPrivacyNoticeCopy } from '@/lib/privacy/noticeCopy';

export const PrivacyNoticeArticle: React.FC<{ language: string; compact?: boolean }> = ({
  language,
  compact = false,
}) => {
  const copy = getPrivacyNoticeCopy(language);
  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      {!compact && (
        <>
          <h1 className="text-3xl font-bold mb-2">{copy.title}</h1>
          <p className="text-sm text-muted-foreground mb-8">{copy.updated}</p>
        </>
      )}
      {compact && (
        <p className="text-xs font-medium text-muted-foreground">{copy.updated}</p>
      )}
      {copy.sections.map((section) => (
        <section key={section.id}>
          <h2 className={compact ? 'text-sm font-semibold mb-1' : 'text-lg font-semibold mb-2'}>
            {section.heading}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/90">{section.body}</p>
        </section>
      ))}
      <p className={compact ? 'text-[11px] text-muted-foreground' : 'mt-10 text-xs text-muted-foreground'}>
        {copy.notLegal}
      </p>
    </div>
  );
};
