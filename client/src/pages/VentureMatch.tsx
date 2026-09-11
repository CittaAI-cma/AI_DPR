import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { VentureMatchCard } from '@/components/venture-match/VentureMatchCard';
import {
  VentureMatchHelpBubble,
  VentureMatchHelpTrigger,
} from '@/components/venture-match/VentureMatchHelpBubble';
import { VentureMatchResults } from '@/components/venture-match/VentureMatchResults';
import { VentureMatchStepExclusions } from '@/components/venture-match/VentureMatchStepExclusions';
import { QUESTIONS, STORAGE_KEY } from '@/lib/ventureMatch/questions';
import { evaluate, excludedSchemes, remainingCount } from '@/lib/ventureMatch/evaluate';
import { saveHandoff } from '@/lib/ventureMatch/mapToDpr';
import { OWNER_EXCLUSIVE_TAGS, OwnerTag, QuestionId, VentureMatchAnswers } from '@/lib/ventureMatch/types';

function isExclusiveOwner(id: string): boolean {
  return OWNER_EXCLUSIVE_TAGS.includes(id as OwnerTag);
}

interface SavedProgress {
  answers: VentureMatchAnswers;
  step: number;
  done?: boolean;
}

export const VentureMatch: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<VentureMatchAnswers>({});
  const [done, setDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SavedProgress;
        setAnswers(parsed.answers || {});
        setStep(parsed.step || 0);
        setDone(!!parsed.done);
      } catch {
        /* ignore */
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: SavedProgress = { answers, step, done };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [answers, step, done, hydrated]);

  useEffect(() => {
    setHelpOpen(false);
  }, [step]);

  const question = QUESTIONS[step];
  const result = useMemo(() => evaluate(answers), [answers]);
  const remaining = remainingCount(answers, question?.id);
  const stepExcluded = useMemo(
    () => excludedSchemes(answers, question?.id),
    [answers, question?.id]
  );

  const goNext = (nextAnswers: VentureMatchAnswers) => {
    if (step >= QUESTIONS.length - 1) {
      setAnswers(nextAnswers);
      setDone(true);
      return;
    }
    setAnswers(nextAnswers);
    setStep(step + 1);
  };

  const applyHelpOptions = (optionIds: string[]) => {
    if (!question) return;
    const valid = optionIds.filter((id) => question.optionIds.includes(id));
    if (!valid.length) return;
    if (question.multi) {
      const exclusive = valid.find(isExclusiveOwner);
      const owners = exclusive
        ? ([exclusive] as OwnerTag[])
        : (valid.filter((id) => !isExclusiveOwner(id)) as OwnerTag[]);
      if (!owners.length) return;
      goNext({ ...answers, owner: owners });
      return;
    }
    goNext({ ...answers, [question.id]: valid[0] } as VentureMatchAnswers);
  };

  const handleSelect = (optionId: string) => {
    if (!question) return;
    if (question.multi) {
      const current = new Set(answers.owner || []);
      if (isExclusiveOwner(optionId)) {
        setAnswers({
          ...answers,
          owner: current.has(optionId as OwnerTag) ? [] : [optionId as OwnerTag],
        });
        return;
      }
      OWNER_EXCLUSIVE_TAGS.forEach((tag) => current.delete(tag));
      if (current.has(optionId as OwnerTag)) current.delete(optionId as OwnerTag);
      else current.add(optionId as OwnerTag);
      setAnswers({ ...answers, owner: Array.from(current) as OwnerTag[] });
      return;
    }

    const next = { ...answers, [question.id]: optionId } as VentureMatchAnswers;
    goNext(next);
  };

  const handleOwnerContinue = () => {
    if (!answers.owner?.length) return;
    if (step >= QUESTIONS.length - 1) {
      setDone(true);
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (done) {
      setDone(false);
      setStep(QUESTIONS.length - 1);
      return;
    }
    if (step > 0) setStep(step - 1);
    else navigate('/dashboard');
  };

  const handleRestart = () => {
    setAnswers({});
    setStep(0);
    setDone(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleCreateDprForScheme = (schemeCode: string) => {
    saveHandoff(answers, result.matches);
    navigate(`/individual-dpr/create?new=true&scheme=${encodeURIComponent(schemeCode)}`);
  };

  const handleCreateDpr = () => {
    saveHandoff(answers, result.matches);
    navigate('/individual-dpr/create?new=true');
  };

  const selected = question ? answers[question.id as QuestionId] : undefined;

  if (!hydrated) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <Button variant="ghost" className="gap-2" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
          <LanguageToggle />
        </div>
        <h1 className="text-2xl font-bold mb-6">{t('ventureMatch.title')}</h1>

        {done ? (
          <VentureMatchResults
            result={result}
            onCreateDpr={handleCreateDpr}
            onCreateDprForScheme={handleCreateDprForScheme}
            onRestart={handleRestart}
          />
        ) : (
          question && (
            <>
              <VentureMatchCard
                question={question}
                index={step}
                total={QUESTIONS.length}
                selected={selected as string | string[] | undefined}
                remaining={remaining}
                onSelect={handleSelect}
                onContinue={handleOwnerContinue}
                helpTrigger={<VentureMatchHelpTrigger onClick={() => setHelpOpen(true)} />}
              />
              <VentureMatchStepExclusions excluded={stepExcluded} />
              <VentureMatchHelpBubble
                question={question}
                answers={answers}
                onApply={applyHelpOptions}
                open={helpOpen}
                onOpenChange={setHelpOpen}
              />
            </>
          )
        )}
      </div>
    </Layout>
  );
};
