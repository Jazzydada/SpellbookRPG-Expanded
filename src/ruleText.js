// A small, text-only format: paragraphs, headings, bullet lists and tables.
// No HTML is evaluated; everything is rendered as React text nodes.
export function parseRuleText(text) {
  const lines = text.replace(/\r/g, '').split('\n');
  const blocks = [];
  const isBullet = line => /^\s*[-•]\s+/.test(line);
  const isTable = line => /^\s*\|.*\|\s*$/.test(line);
  const isHeading = line => /^#{1,4}\s+/.test(line);
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (isHeading(line)) {
      blocks.push({ type: 'heading', text: line.replace(/^#+\s+/, '') }); i++; continue;
    }
    if (isTable(line)) {
      const rows = [];
      while (i < lines.length && isTable(lines[i])) {
        const row = lines[i++].trim().slice(1, -1).split('|').map(cell => cell.trim());
        if (!row.every(cell => /^:?-+:?$/.test(cell))) rows.push(row);
      }
      blocks.push({ type: 'table', rows }); continue;
    }
    if (isBullet(line)) {
      const items = [];
      while (i < lines.length && isBullet(lines[i])) items.push(lines[i++].replace(/^\s*[-•]\s+/, ''));
      blocks.push({ type: 'list', items }); continue;
    }
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !isHeading(lines[i]) && !isBullet(lines[i]) && !isTable(lines[i])) paragraph.push(lines[i++].trim());
    blocks.push({ type: 'paragraph', text: paragraph.join('\n') });
  }
  return blocks;
}
