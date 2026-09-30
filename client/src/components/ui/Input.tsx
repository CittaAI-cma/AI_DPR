// @ts-nocheck
import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const NAV_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
]);

/** Digits and a single decimal point. Blocks letters, including e/E from Shift+E. */
export function sanitizeNumericString(value: string): string {
  const cleaned = String(value ?? '').replace(/[^\d.]/g, '');
  const dot = cleaned.indexOf('.');
  if (dot === -1) return cleaned;
  return cleaned.slice(0, dot + 1) + cleaned.slice(dot + 1).replace(/\./g, '');
}

export function blockNonNumericKey(event: React.KeyboardEvent<HTMLInputElement>) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (NAV_KEYS.has(event.key)) return;
  if (event.key === '.') {
    if (event.currentTarget.value.includes('.')) event.preventDefault();
    return;
  }
  if (!/^\d$/.test(event.key)) event.preventDefault();
}

export function blockNonNumericBeforeInput(event: React.FormEvent<HTMLInputElement>) {
  const data = event.nativeEvent?.data;
  if (data == null || data === '') return;
  if (!/^[\d.]+$/.test(data)) {
    event.preventDefault();
    return;
  }
  if (data.includes('.') && event.currentTarget.value.includes('.')) event.preventDefault();
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      type,
      step,
      inputMode,
      onChange,
      onKeyDown,
      onPaste,
      onBeforeInput,
      ...props
    },
    ref
  ) => {
    const numeric = type === 'number';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          inputMode={numeric ? inputMode || 'decimal' : inputMode}
          step={numeric ? step ?? 'any' : step}
          className={cn(
            'flex h-10 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-600 focus-visible:ring-red-600',
            className
          )}
          ref={ref}
          onKeyDown={(event) => {
            if (numeric && !event.defaultPrevented) blockNonNumericKey(event);
            onKeyDown?.(event);
          }}
          onBeforeInput={(event) => {
            if (numeric && !event.defaultPrevented) blockNonNumericBeforeInput(event);
            onBeforeInput?.(event);
          }}
          onPaste={(event) => {
            if (numeric) {
              const pasted = event.clipboardData.getData('text');
              const cleaned = sanitizeNumericString(pasted);
              if (cleaned !== pasted) {
                event.preventDefault();
                const el = event.currentTarget;
                const start = el.selectionStart ?? el.value.length;
                const end = el.selectionEnd ?? el.value.length;
                const next = sanitizeNumericString(
                  el.value.slice(0, start) + cleaned + el.value.slice(end)
                );
                const setter = Object.getOwnPropertyDescriptor(
                  window.HTMLInputElement.prototype,
                  'value'
                )?.set;
                setter?.call(el, next);
                el.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
            onPaste?.(event);
          }}
          onChange={(event) => {
            if (numeric) {
              const cleaned = sanitizeNumericString(event.target.value);
              if (cleaned !== event.target.value) event.target.value = cleaned;
            }
            onChange?.(event);
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm font-medium text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
