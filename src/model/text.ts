export function textWidth(text: string, size: number): number {
  let em = 0;
  for (const char of text) {
    if (char === " ") em += 0.32;
    else if (/[il.,:;'|!]/.test(char)) em += 0.3;
    else if (/[mwMW]/.test(char)) em += 0.92;
    else if (/[A-Z0-9_@%]/.test(char)) em += 0.7;
    else em += 0.6;
  }
  return em * size;
}

export function shorten(content: string, size: number, room: number): string {
  if (textWidth(content, size) <= room) return content;
  let cut = content;
  while (cut && textWidth(`${cut}…`, size) > room) cut = cut.slice(0, -1);
  return cut ? `${cut}…` : "";
}
