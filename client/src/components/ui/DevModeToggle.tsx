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
      className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm font-medium ${
        on
          ? 'border-amber-400 bg-amber-50 text-amber-950'
          : 'border-border bg-background text-muted-foreground'
      }`}
    >
      <span>{tf('Dev mode')}</span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          on ? 'bg-amber-500' : 'bg-muted-foreground/30'
        }`}
        aria-hidden
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            on ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
};
