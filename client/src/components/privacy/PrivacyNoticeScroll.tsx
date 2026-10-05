import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PrivacyNoticeArticle } from './PrivacyNoticeArticle';

interface PrivacyNoticeScrollProps {
  reachedEnd: boolean;
  onReachedEnd: () => void;
}

export const PrivacyNoticeScroll: React.FC<PrivacyNoticeScrollProps> = ({
  reachedEnd,
  onReachedEnd,
}) => {
  const { t, i18n } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const checkBottom = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight + 8) {
      onReachedEnd();
      return;
    }
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 16) {
      onReachedEnd();
    }
  }, [onReachedEnd]);

  useEffect(() => {
    const el = scrollerRef.current;
    const sentinel = bottomRef.current;
    if (!el || !sentinel) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onReachedEnd();
        }
      },
      { root: el, threshold: 0.6 }
    );
    io.observe(sentinel);
    el.addEventListener('scroll', checkBottom, { passive: true });
    const raf = requestAnimationFrame(checkBottom);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('scroll', checkBottom);
    };
  }, [checkBottom, onReachedEnd, i18n.language]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t('privacy.mustRead')}</p>
      <div
        ref={scrollerRef}
        className="h-52 overflow-y-auto rounded-md border border-border bg-background p-3"
        tabIndex={0}
        role="region"
        aria-label={t('privacy.noticeLink')}
      >
        <PrivacyNoticeArticle language={i18n.language} compact />
        <div ref={bottomRef} className="h-2" data-notice-end />
      </div>
      <p className={`text-xs font-medium ${reachedEnd ? 'text-emerald-700' : 'text-red-700'}`}>
        {reachedEnd ? t('privacy.noticeRead') : t('privacy.scrollToEnable')}
      </p>
    </div>
  );
};
