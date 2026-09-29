// @ts-nocheck
import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Maximize2, Sparkles, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useClusterFormText } from '@/lib/clusterDprFormText';
import { useAuthStore } from '@/store/authStore';
import { useIndividualDPRStore } from '@/store/individualDPRStore';
import { AISuggestionsService } from '@/services/aiSuggestions.service';
import { getUnitName } from '@/lib/individualDpr/toIndividualPayload';
import { BUSINESS_SKILLS, matchBusinessSkillLocal } from '@/lib/individualDpr/businessSkills';
import { useTranslation } from 'react-i18next';

type EditorKind = 'input' | 'textarea' | 'select';

const NON_IMPROVE_INPUT_TYPES = new Set([
  'number',
  'date',
  'datetime-local',
  'time',
  'month',
  'week',
  'file',
  'checkbox',
  'radio',
  'hidden',
  'color',
  'range',
]);

function canImproveKind(kind: EditorKind, inputType?: string) {
  if (kind === 'select') return false;
  if (kind === 'input' && inputType && NON_IMPROVE_INPUT_TYPES.has(inputType)) return false;
  return true;
}

async function resolveSkillMatch(
  text: string,
  context: Record<string, any>
): Promise<string | null> {
  const local = matchBusinessSkillLocal(text);
  if (local) return local;
  return AISuggestionsService.matchBusinessSkill(text, [...BUSINESS_SKILLS], context);
}

function FieldExpandModal({
  open,
  title,
  kind,
  draft,
  setDraft,
  inputType,
  placeholder,
  selectChildren,
  onConfirm,
  onCancel,
  enableSkillMatch = false,
}: {
  open: boolean;
  title?: string;
  kind: EditorKind;
  draft: string;
  setDraft: (v: string) => void;
  inputType?: string;
  placeholder?: string;
  selectChildren?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  enableSkillMatch?: boolean;
}) {
  const tf = useClusterFormText();
  const { t } = useTranslation();
  const titleId = useId();
  const editorRef = useRef<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement | null>(null);
  const [improving, setImproving] = useState(false);
  const [matching, setMatching] = useState(false);
  const { user } = useAuthStore();
  const aiAllowed = !!user?.privacy?.aiAssist;
  const data = useIndividualDPRStore((s) => s.data);
  // Step 1 (cover / basics) is manual — no AI improve on any field.
  const onStep1 = (data?.currentStep ?? 1) === 1;
  const showImprove = canImproveKind(kind, inputType) && !onStep1 && !enableSkillMatch;
  const showMatchSkill = !!enableSkillMatch && canImproveKind(kind, inputType);
  const busy = improving || matching;

  useEffect(() => {
    if (!open) {
      setImproving(false);
      setMatching(false);
      return;
    }
    const tmr = window.setTimeout(() => editorRef.current?.focus?.(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(tmr);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onCancel, onConfirm]);

  const matchContext = () => {
    const step1 = data?.step1 || {};
    return {
      unitName: getUnitName(step1),
      district: step1.district || '',
      location: step1.location || '',
      schemeCode: data?.matchedSchemeCode || null,
    };
  };

  const handleImprove = async () => {
    if (!aiAllowed) {
      toast.error(t('privacy.aiOffWarning'));
      return;
    }
    const text = String(draft || '').trim();
    if (!text) {
      toast.error(tf('Type something first, then Improve this.'));
      return;
    }
    setImproving(true);
    try {
      const step1 = data?.step1 || {};
      const improved = await AISuggestionsService.improveFieldText(
        title || 'field',
        text,
        {
          fieldLabel: title || '',
          schemeCode: data?.matchedSchemeCode || null,
          unitName: getUnitName(step1),
          clusterName: step1.clusterName || '',
          district: step1.district || '',
          location: step1.location || '',
          natureOfBusiness: step1.natureOfBusiness || '',
        }
      );
      if (!improved) {
        toast.error(tf('Could not improve this text. Try again.'));
        return;
      }
      setDraft(improved);
      toast.success(tf('Improved — review, then Confirm to save.'));
    } catch (error) {
      console.error(error);
      toast.error(tf('Could not improve this text. Try again.'));
    } finally {
      setImproving(false);
    }
  };

  const handleMatchSkill = async () => {
    const text = String(draft || '').trim();
    if (!text) {
      toast.error(tf('Type what you do first, then Match me.'));
      return;
    }
    // Local keyword match works offline / without AI consent
    const local = matchBusinessSkillLocal(text);
    if (local) {
      setDraft(local);
      toast.success(tf('Matched to: {skill}').replace('{skill}', local));
      return;
    }
    if (!aiAllowed) {
      toast.error(t('privacy.aiOffWarning'));
      return;
    }
    setMatching(true);
    try {
      const skill = await resolveSkillMatch(text, matchContext());
      if (!skill) {
        toast.error(tf('Could not match a skill. Try again with a clearer description.'));
        return;
      }
      setDraft(skill);
      toast.success(tf('Matched to: {skill}').replace('{skill}', skill));
    } catch (error) {
      console.error(error);
      toast.error(tf('Could not match a skill. Try again with a clearer description.'));
    } finally {
      setMatching(false);
    }
  };

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label={tf('Cancel')}
        onClick={onCancel}
      />
      <div className="relative z-10 flex w-full max-w-3xl max-h-[90vh] flex-col rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p id={titleId} className="text-base font-semibold text-foreground truncate">
              {title || tf('Edit field')}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tf('Edit the full text, then Confirm to save or Cancel to discard.')}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={tf('Cancel')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-4 py-4 sm:px-5">
          {kind === 'textarea' && (
            <textarea
              ref={editorRef as React.RefObject<HTMLTextAreaElement>}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              disabled={busy}
              className="w-full min-h-[50vh] rounded-lg border border-input bg-background px-4 py-3 text-base leading-relaxed ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
          )}
          {kind === 'input' && (
            <input
              ref={editorRef as React.RefObject<HTMLInputElement>}
              type={inputType && inputType !== 'file' ? inputType : 'text'}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              disabled={busy}
              className="w-full h-14 rounded-lg border border-input bg-background px-4 py-3 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
          )}
          {kind === 'select' && (
            <select
              ref={editorRef as React.RefObject<HTMLSelectElement>}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full min-h-[3.5rem] rounded-lg border border-input bg-background px-4 py-3 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              size={Math.min(12, React.Children.count(selectChildren) || 8)}
            >
              {selectChildren}
            </select>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            {showMatchSkill && (
              <Button
                type="button"
                variant="outline"
                onClick={handleMatchSkill}
                disabled={busy}
                className="gap-1.5"
              >
                {matching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {matching ? tf('Matching…') : tf('Match me')}
              </Button>
            )}
            {showImprove && (
              <Button
                type="button"
                variant="outline"
                onClick={handleImprove}
                disabled={busy}
                className="gap-1.5"
              >
                {improving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {improving ? tf('Improving…') : tf('Improve this')}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
              {tf('Cancel')}
            </Button>
            <Button type="button" onClick={onConfirm} disabled={busy}>
              {tf('Confirm')}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function useExpandEditor(
  value: unknown,
  onChange?: (e: any) => void
) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const openEditor = (e?: React.SyntheticEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setDraft(value == null ? '' : String(value));
    setOpen(true);
  };

  const cancel = () => setOpen(false);

  const confirm = () => {
    if (onChange) {
      onChange({
        target: { value: draft },
        currentTarget: { value: draft },
      });
    }
    setOpen(false);
  };

  return { open, draft, setDraft, openEditor, cancel, confirm };
}

function ExpandHint() {
  return (
    <span
      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/70"
      aria-hidden
    >
      <Maximize2 className="h-3.5 w-3.5" />
    </span>
  );
}

/** Drop-in for `@/components/ui/Input` — click opens enlarged editor. */
export const ExpandableInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & {
    enableSkillMatch?: boolean;
    expandTitle?: string;
    /** Display transform only — stored value stays as `value`. */
    formatDisplay?: (value: string) => string;
  }
>(
  (
    {
      className,
      onChange,
      value,
      defaultValue,
      type,
      placeholder,
      label,
      error,
      disabled,
      readOnly,
      onFocus,
      onClick,
      enableSkillMatch = false,
      expandTitle,
      formatDisplay,
      ...props
    },
    ref
  ) => {
    const tf = useClusterFormText();
    const resolvedValue = value ?? defaultValue ?? '';
    const displayValue =
      formatDisplay && resolvedValue !== '' && resolvedValue != null
        ? formatDisplay(String(resolvedValue))
        : resolvedValue;
    const { open, draft, setDraft, openEditor, cancel, confirm } = useExpandEditor(resolvedValue, onChange);

    // Native file / checkbox / radio stay as-is
    if (type === 'file' || type === 'checkbox' || type === 'radio' || type === 'hidden') {
      return (
        <Input
          ref={ref}
          className={className}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          type={type}
          placeholder={placeholder}
          label={label}
          error={error}
          disabled={disabled}
          readOnly={readOnly}
          onFocus={onFocus}
          onClick={onClick}
          {...props}
        />
      );
    }

    const modalTitle =
      expandTitle || (typeof label === 'string' ? label : undefined) || tf('Edit field');

    return (
      <>
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium mb-2">{label}</label>
          )}
          <div className="relative w-full">
            <input
              ref={ref}
              className={cn(
                'flex h-10 w-full rounded-[10px] border border-input bg-background px-3 py-2 pr-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
                error && 'border-destructive',
                className
              )}
              onChange={onChange}
              value={displayValue}
              defaultValue={defaultValue}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              readOnly
              onFocus={(e) => {
                if (!disabled) openEditor(e);
                onFocus?.(e);
              }}
              onClick={(e) => {
                if (!disabled) openEditor(e);
                onClick?.(e);
              }}
              {...props}
            />
            {!disabled && <ExpandHint />}
          </div>
          {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
        </div>
        <FieldExpandModal
          open={open}
          title={modalTitle}
          kind="input"
          draft={draft}
          setDraft={setDraft}
          inputType={type}
          placeholder={placeholder}
          onConfirm={confirm}
          onCancel={cancel}
          enableSkillMatch={enableSkillMatch}
        />
      </>
    );
  }
);
ExpandableInput.displayName = 'ExpandableInput';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

/** Drop-in for native `<textarea>` — click opens enlarged editor. */
export const ExpandableTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, value, defaultValue, placeholder, label, disabled, readOnly, onFocus, onClick, ...props }, ref) => {
    const tf = useClusterFormText();
    const resolvedValue = value ?? defaultValue ?? '';
    const { open, draft, setDraft, openEditor, cancel, confirm } = useExpandEditor(resolvedValue, onChange);

    return (
      <>
        <div className="relative w-full">
          <textarea
            ref={ref}
            className={cn('pr-8 cursor-pointer', className)}
            onChange={onChange}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            readOnly
            onFocus={(e) => {
              if (!disabled) openEditor(e);
              onFocus?.(e);
            }}
            onClick={(e) => {
              if (!disabled) openEditor(e);
              onClick?.(e);
            }}
            {...props}
          />
          {!disabled && (
            <span className="pointer-events-none absolute right-2 top-2 text-muted-foreground/70" aria-hidden>
              <Maximize2 className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
        <FieldExpandModal
          open={open}
          title={label || tf('Edit field')}
          kind="textarea"
          draft={draft}
          setDraft={setDraft}
          placeholder={placeholder}
          onConfirm={confirm}
          onCancel={cancel}
        />
      </>
    );
  }
);
ExpandableTextarea.displayName = 'ExpandableTextarea';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

/** Drop-in for native `<select>` — click opens enlarged editor. */
export const ExpandableSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, onChange, value, defaultValue, children, label, disabled, onFocus, onClick, ...props }, ref) => {
    const tf = useClusterFormText();
    const resolvedValue = value ?? defaultValue ?? '';
    const { open, draft, setDraft, openEditor, cancel, confirm } = useExpandEditor(resolvedValue, onChange);

    return (
      <>
        <div className="relative w-full">
          <select
            ref={ref}
            className={cn('pr-9 cursor-pointer', className)}
            onChange={onChange}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            onMouseDown={(e) => {
              if (disabled) return;
              // Prevent native dropdown; open enlarged editor instead
              e.preventDefault();
              openEditor(e);
            }}
            onFocus={(e) => {
              if (!disabled) openEditor(e);
              onFocus?.(e);
            }}
            onClick={(e) => {
              if (!disabled) openEditor(e);
              onClick?.(e);
            }}
            {...props}
          >
            {children}
          </select>
          {!disabled && <ExpandHint />}
        </div>
        <FieldExpandModal
          open={open}
          title={label || tf('Edit field')}
          kind="select"
          draft={draft}
          setDraft={setDraft}
          selectChildren={children}
          onConfirm={confirm}
          onCancel={cancel}
        />
      </>
    );
  }
);
ExpandableSelect.displayName = 'ExpandableSelect';
