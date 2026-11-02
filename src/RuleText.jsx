import React from 'react';
import { parseRuleText } from './ruleText.js';

function LabeledText({ text }) {
  const label = text.match(/^([^:\n]{1,80}:)\s/);
  return label ? <><strong>{label[1]}</strong>{text.slice(label[1].length)}</> : text;
}

export default function RuleText({ text }) {
  return <div className="spell-rules" style={{ fontSize: '0.85rem', lineHeight: 1.7, overflowWrap: 'anywhere' }}>
    {parseRuleText(text).map((block, index) => {
      if (block.type === 'heading') return <h4 key={index} style={{ margin: '1.1rem 0 0.35rem', fontSize: '0.9rem', color: '#fcd34d' }}>{block.text}</h4>;
      if (block.type === 'list') return <ul key={index} style={{ paddingLeft: '1.3rem', margin: '0.5rem 0' }}>{block.items.map((item, i) => <li key={i}><LabeledText text={item} /></li>)}</ul>;
      if (block.type === 'table') return <div key={index} style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.8rem' }}>
          <thead><tr>{block.rows[0].map((cell, i) => <th key={i} scope="col" style={{ textAlign: 'left', padding: '0.4rem', borderBottom: '1px solid #64748b', color: '#fcd34d' }}>{cell}</th>)}</tr></thead>
          <tbody>{block.rows.slice(1).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} style={{ padding: '0.4rem', borderBottom: '1px solid #334155', verticalAlign: 'top' }}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>;
      return <p key={index} style={{ margin: '0.65rem 0', whiteSpace: 'pre-line' }}><LabeledText text={block.text} /></p>;
    })}
  </div>;
}
