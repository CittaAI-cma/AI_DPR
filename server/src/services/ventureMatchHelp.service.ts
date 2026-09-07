// @ts-nocheck
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type HelpMessage = { role: 'user' | 'assistant'; content: string };

export type HelpResult =
  | {
      mode: 'ask';
      assistantMessage: string;
      suggestedUserReplies: string[];
    }
  | {
      mode: 'recommend';
      assistantMessage: string;
      optionIds: string[];
      confidence: 'high' | 'low';
    };

function extractJson(text: string): any {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced ? fenced[1] : text).trim();
  try {
    return JSON.parse(raw);
  } catch {
    const objectMatch = raw.match(/\{[\s\S]*\}/);
    if (!objectMatch) return null;
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      return null;
    }
  }
}

function userTurnCount(messages: HelpMessage[]): number {
  return messages.filter((m) => m.role === 'user').length;
}

export class VentureMatchHelpService {
  static async help(input: {
    questionId: string;
    optionIds: string[];
    optionLabels: Record<string, string>;
    questionTitle: string;
    questionLabel: string;
    answersSoFar: Record<string, any>;
    messages: HelpMessage[];
    language: 'en' | 'te';
  }): Promise<HelpResult> {
    const allowed = new Set(input.optionIds || []);
    const lang = input.language === 'te' ? 'te' : 'en';
    const langRule =
      lang === 'te'
        ? 'Write assistantMessage and suggestedUserReplies entirely in Telugu script (తెలుగు). Do not use Hindi or English except option id codes.'
        : 'Write assistantMessage and suggestedUserReplies in simple English.';

    const turns = userTurnCount(input.messages || []);
    const mustRecommendSoon = turns >= 4;

    const system = `You help an Andhra Pradesh MSME entrepreneur pick a Scheme Finder multiple-choice answer.
You are not a general chatbot. You only clarify the current question, then map their situation to allowed option ids.

${langRule}

Current question id: ${input.questionId}
Question heading: ${input.questionLabel}
Question text: ${input.questionTitle}
Allowed option ids and labels: ${JSON.stringify(input.optionLabels)}
Previous answers (context only): ${JSON.stringify(input.answersSoFar || {})}

Rules:
- Return JSON only. No markdown.
- Never invent option ids. Only use ids from the allowed list.
- Read negation carefully. "I don't own a company" / "I work on my own" is sole owner, not a company.
- Do not match on a single keyword if the sentence means the opposite.
- Ask at most ONE short clarifying question per turn (mode "ask").
- suggestedUserReplies: 2 short example answers the user might tap (same language as assistantMessage).
- When you are reasonably sure, use mode "recommend" with optionIds.
- For questionId "owner": optionIds may be several tags (female, sc, st, bc, pwd). Never combine generalMale with any other tag. If they are a general-category man only, optionIds is ["generalMale"].
- For all other questions, optionIds must have exactly one id.
- If still unclear after several turns, recommend the closest fit with confidence "low" and tell them they can tap a different option on the card.
${mustRecommendSoon ? '- You MUST use mode "recommend" this turn (pick the best allowed id).' : ''}

JSON shapes:
{"mode":"ask","assistantMessage":"...","suggestedUserReplies":["...","..."]}
{"mode":"recommend","assistantMessage":"...","optionIds":["id"],"confidence":"high"}`;

    const transcript = (input.messages || [])
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 500,
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content:
            transcript ||
            'The user does not know which option to choose. Start by asking one simple clarifying question.',
        },
      ],
    });

    const parsed = extractJson(response.choices[0]?.message?.content || '');
    return this.normalize(parsed, allowed, lang, input.optionLabels);
  }

  private static normalize(
    parsed: any,
    allowed: Set<string>,
    lang: 'en' | 'te',
    labels: Record<string, string>
  ): HelpResult {
    const fallbackAsk: HelpResult = {
      mode: 'ask',
      assistantMessage:
        lang === 'te'
          ? 'మీ పరిస్థితి ఒక వాక్యంలో చెప్పండి. నేను సరైన ఎంపిక చూపిస్తాను.'
          : 'In one sentence, tell me your situation. I will point to the right choice.',
      suggestedUserReplies:
        lang === 'te' ? ['నాకు తెలియదు', 'సహాయం చేయండి'] : ['I am not sure', 'Help me pick'],
    };

    if (!parsed || typeof parsed !== 'object') return fallbackAsk;

    if (parsed.mode === 'recommend') {
      const raw = Array.isArray(parsed.optionIds) ? parsed.optionIds : [parsed.optionIds];
      let optionIds = raw.map((id: any) => String(id || '').trim()).filter((id: string) => allowed.has(id));
      if (optionIds.includes('generalMale')) optionIds = ['generalMale'];
      if (!optionIds.length) return fallbackAsk;
      const names = optionIds.map((id: string) => labels[id] || id).join(', ');
      const confidence = parsed.confidence === 'low' ? 'low' : 'high';
      const assistantMessage =
        typeof parsed.assistantMessage === 'string' && parsed.assistantMessage.trim()
          ? parsed.assistantMessage.trim()
          : lang === 'te'
            ? `దీనికి సరిపోయే ఎంపిక: ${names}`
            : `The matching choice is: ${names}`;
      return { mode: 'recommend', assistantMessage, optionIds, confidence };
    }

    const assistantMessage =
      typeof parsed.assistantMessage === 'string' && parsed.assistantMessage.trim()
        ? parsed.assistantMessage.trim()
        : fallbackAsk.assistantMessage;
    const suggested = Array.isArray(parsed.suggestedUserReplies)
      ? parsed.suggestedUserReplies.map((s: any) => String(s || '').trim()).filter(Boolean).slice(0, 4)
      : fallbackAsk.suggestedUserReplies;
    return {
      mode: 'ask',
      assistantMessage,
      suggestedUserReplies: suggested.length ? suggested : fallbackAsk.suggestedUserReplies,
    };
  }
}
