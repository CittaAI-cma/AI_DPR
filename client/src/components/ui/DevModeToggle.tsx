import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { isSuperAdmin } from '@/lib/rbac';
import { useClusterFormText } from '@/lib/clusterDprFormText';

interface DevModeToggleProps {
  on: boolean;
  onChange: (next: boolean) => void;
}

/** Admin-only switch. Hidden for every other role. */
export const DevModeToggle: React.FC<DevModeToggleProps> = ({ on, onChange }) => {
  const user = useAuthStore((s) => s.user);
  const tf = useClusterFormText();
  if (!isSuperAdmin(user?.role)) return null;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-sm font-medium ${
        on
          ? 'border-amber-400 bg-amber-50 text-amber-950'
          : 'border-border bg-background text-muted-foreground'
      }`}
    >
      <span>{tf('Dev mode')}</span>
      <span
        className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors ${
          on ? 'justify-end bg-amber-500' : 'justify-start bg-muted-foreground/30'
        }`}
        aria-hidden
      >
        <span className="h-4 w-4 rounded-full bg-white shadow" />
      </span>
    </button>
  );
};
