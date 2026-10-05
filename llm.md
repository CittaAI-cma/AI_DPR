# How Fill this step calls the model

## Problem

**Fill this step** used to send one model call per question. A step with eight questions sent the same long instructions eight times, and each call also pasted every earlier step in full. A full DPR was dozens of calls. Most of the tokens were repeated input, not the answers. The calls also ran one after another, so the wait was the sum of every question.

A wrong rupee figure is worse than a blank. The model was free to invent a project cost when the form had no amount yet, and a failed question was not separated from the ones that succeeded.

## Solution we use

**Fill this step** now batches the current step.

1. Skip questions that already have an answer. An untouched `0` or a blank row still counts as empty.
2. Send one call for the short and structured questions on that step (numbers, dates, dropdowns, and JSON lists).
3. Send a second call only when that step also has long write-ups. Those fields are `executiveSummary`, `processOfManufacture`, `sectorDescription`, `presentActivities`, `targetMarket`, `existingDemand`, `geography`, `landDetails`, `impactNote`, and `waterAndEffluent`. They share that second call. Two calls is the ceiling for a step, not a quota.
4. Send a facts card instead of the earlier steps: unit name, district, location, products, and rupee amounts already entered. Money is in ₹ Lakhs. If the card has no amount, money answers are `0`. The model is told not to invent a project cost.
5. Ask for JSON that matches a schema (`field` plus `suggestion` string). The static instructions stay in the system message so the provider can cache that prefix.
6. Check each returned value in code. Numbers have to parse. Dates have to be real calendar days from 1990 to 2100. Lists and objects have to match their shape. A cost is kept only when it is within five times the amounts already on the facts card. Machinery line items use that same ceiling. A long answer under 40 words is rejected.
7. Retry a failed question once, on its own. A second failure stays blank. The user fills that box. Do not retry the rest of the batch.

The model for these calls is `gpt-4o-mini`. Short batches use a lower temperature and a 2,500 token cap. Long batches use a 4,000 token cap. Each call logs `llm.step` on the server with the step, `short` or `long`, the field count, and `inputTokens` / `outputTokens`.

Regenerating one suggestion is still one call. It uses the same facts card, schema, and checks. If the check fails, that suggestion stays blank.

Cluster **Generate Suggestions** is unchanged: one call for the whole current step, with the previous cluster steps included.

The OpenAI Batch API is not used for **Fill this step**. The person is waiting on that click. Batch pricing fits a background job, not this button.
