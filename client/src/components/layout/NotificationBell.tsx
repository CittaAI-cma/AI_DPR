import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

type InboxItem = {
  id: string;
  kind: string;
  title: string;
  body: string;
  at: string;
  readAt?: string;
  smsStatus?: string;
};

export const NotificationBell: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<InboxItem[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await api.getNotifications(12);
      const data = response.data || {};
      setUnread(Number(data.unread) || 0);
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      /* keep last list */
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 60_000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const openItem = async (item: InboxItem) => {
    try {
      if (!item.readAt) await api.markNotificationRead(item.id);
    } catch {
      /* still navigate */
    }
    setOpen(false);
    await load();
    if (item.kind === 'retention_warning') {
      navigate('/dprs');
      return;
    }
    navigate('/account/privacy#notifications');
  };

  const markAll = async () => {
    try {
      await api.markNotificationRead('all');
      await load();
    } catch {
      /* ignore */
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="relative"
        aria-label={t('privacy.bellTitle')}
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) load();
        }}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-4 px-1 rounded-full bg-destructive text-white text-[10px] leading-4 text-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-lg border border-border bg-background shadow-lg z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <p className="text-sm font-medium">{t('privacy.bellTitle')}</p>
            {unread > 0 && (
              <button type="button" className="text-xs text-primary hover:underline" onClick={markAll}>
                {t('privacy.markAllRead')}
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-3 py-6 text-sm text-muted-foreground">{t('privacy.bellEmpty')}</li>
            ) : (
              items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openItem(item)}
                    className={`w-full text-left px-3 py-2.5 hover:bg-muted/60 ${item.readAt ? '' : 'bg-primary/5'}`}
                  >
                    <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{item.body}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {item.at ? new Date(item.at).toLocaleString('en-IN') : ''}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
          <button
            type="button"
            className="w-full text-center text-xs py-2 border-t border-border text-primary hover:bg-muted/40"
            onClick={() => {
              setOpen(false);
              navigate('/account/privacy#notifications');
            }}
          >
            {t('privacy.viewAllNotifications')}
          </button>
        </div>
      )}
    </div>
  );
};
