import { SCHEMES, blocksAllSchemes, shouldShowOwnershipHint } from './schemes';
import {
  EvaluateResult,
  QuestionId,
  SchemeCriterion,
  SchemeExclusion,
  SchemeMatch,
  VentureMatchAnswers,
} from './types';

const STATUS_ORDER = { fail: 0, unknown: 1, pass: 2 } as const;

export function sortCriteria(criteria: SchemeCriterion[]): SchemeCriterion[] {
  return [...criteria].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
}

function activityBlockCriterion(): SchemeCriterion {
  return {
    id: 'activity',
    questionId: 'activity',
    labelKey: 'ventureMatch.criteria.mustBeEnterprise',
    status: 'fail',
  };
}

export function evaluate(answers: VentureMatchAnswers): EvaluateResult {
  const matches: SchemeMatch[] = [];
  const excluded: SchemeExclusion[] = [];
  const blocked = blocksAllSchemes(answers);

  for (const scheme of SCHEMES) {
    const criteria: SchemeCriterion[] = scheme.criteria.map((criterion) => ({
      id: criterion.id,
      questionId: criterion.questionId,
      labelKey: criterion.labelKey,
      status: criterion.test(answers),
    }));

    if (blocked) {
      const activityCrit = criteria.find((c) => c.questionId === 'activity');
      if (activityCrit) activityCrit.status = 'fail';
      else criteria.unshift(activityBlockCriterion());
    }

    const hasFail = criteria.some((c) => c.status === 'fail');
    const hasPass = criteria.some((c) => c.status === 'pass');

    if (hasFail) {
      excluded.push({
        code: scheme.code,
        name: scheme.name,
        kind: scheme.kind,
        criteria: sortCriteria(criteria),
      });
    } else if (hasPass) {
      matches.push({
        code: scheme.code,
        name: scheme.name,
        kind: scheme.kind,
        benefit: scheme.benefit(answers),
      });
    }
  }

  return {
    matches,
    excluded,
    showOwnershipHint: shouldShowOwnershipHint(answers),
  };
}

export function remainingCount(
  answers: VentureMatchAnswers,
  ignoreQuestionId?: QuestionId
): number {
  const scoped: VentureMatchAnswers = { ...answers };
  if (ignoreQuestionId) delete scoped[ignoreQuestionId];
  if (blocksAllSchemes(scoped)) return 0;
  return SCHEMES.filter((scheme) =>
    scheme.criteria.every((criterion) => criterion.test(scoped) !== 'fail')
  ).length;
}
