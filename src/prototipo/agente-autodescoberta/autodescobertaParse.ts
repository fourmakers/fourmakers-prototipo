/** Parse de tags no texto bruto do agente (alinhado ao doc técnico e ao protótipo JSX). */

export function parseTag(text: string, tag: string): string[] {
  const match = text.match(new RegExp(`\\[${tag}:\\s*([^\\]]+)\\]`));
  if (!match) return [];
  return match[1]
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

export function stripAgentTags(text: string): string {
  return text
    .replace(/\[TECNICAS:[^\]]*\]/g, "")
    .replace(/\[COMPORTAMENTAIS:[^\]]*\]/g, "")
    .replace(/\[CARGOS:[^\]]*\]/g, "")
    .replace(/\[SHOW_VALUES\]/g, "")
    .trim();
}
