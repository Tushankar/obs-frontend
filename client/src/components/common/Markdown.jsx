// Minimal markdown renderer shared by public CMS pages and news articles.
// Supports: #/##/### headings, > blockquote, - bullets, **bold**, plain
// paragraphs, blank-line spacing. Deliberately tiny — no dependency.

function inline(text, keyBase) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={`${keyBase}-${i}`} className="font-semibold text-ink">{p.slice(2, -2)}</strong>
      : p
  );
}

export default function Markdown({ content }) {
  if (!content) return null;
  const lines = String(content).split('\n');
  const out = [];
  let list = null; // accumulate consecutive bullets into one <ul>

  const flushList = (key) => {
    if (list?.length) out.push(<ul key={`ul-${key}`} className="my-3 list-disc space-y-1 pl-6 text-[14.5px] leading-relaxed text-ink-soft">{list}</ul>);
    list = null;
  };

  lines.forEach((line, idx) => {
    const t = line.trim();
    if (t.startsWith('- ')) {
      (list = list || []).push(<li key={idx}>{inline(t.slice(2), idx)}</li>);
      return;
    }
    flushList(idx);
    if (t.startsWith('### ')) out.push(<h3 key={idx} className="mb-2 mt-5 text-lg font-bold text-ink">{inline(t.slice(4), idx)}</h3>);
    else if (t.startsWith('## ')) out.push(<h2 key={idx} className="mb-2.5 mt-6 text-xl font-bold text-ink">{inline(t.slice(3), idx)}</h2>);
    else if (t.startsWith('# ')) out.push(<h1 key={idx} className="mb-3 mt-6 text-2xl font-black text-ink">{inline(t.slice(2), idx)}</h1>);
    else if (t.startsWith('> ')) out.push(<blockquote key={idx} className="my-4 rounded-r border-l-4 border-brand bg-brand-soft p-4 italic text-ink-soft">{inline(t.slice(2), idx)}</blockquote>);
    else if (t === '') out.push(<div key={idx} className="h-3" />);
    else out.push(<p key={idx} className="my-2.5 text-[14.5px] leading-relaxed text-ink-soft">{inline(line, idx)}</p>);
  });
  flushList('end');
  return <div>{out}</div>;
}
