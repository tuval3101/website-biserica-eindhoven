const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const renderInline = (value) => {
  let output = escapeHtml(value);
  output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" decoding="async">');
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  output = output.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  return output;
};

const isTableDelimiter = (line) => /^\s*\|?[\s:|-]+\|[\s:|.-]+\|?\s*$/.test(line);

const renderTable = (lines) => {
  const rows = lines.map((line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => renderInline(cell.trim()))
  );
  const [head, , ...body] = rows;
  const headHtml = `<thead><tr>${head.map((cell) => `<th>${cell}</th>`).join("")}</tr></thead>`;
  const bodyHtml = `<tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>`;
  return `<table>${headHtml}${bodyHtml}</table>`;
};

export const markdownToHtml = (markdown) => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = null;
  let blockquote = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list) {
      html.push(`<${list.type}>${list.items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${list.type}>`);
      list = null;
    }
  };

  const flushBlockquote = () => {
    if (blockquote.length) {
      html.push(`<blockquote>${blockquote.map((line) => `<p>${renderInline(line)}</p>`).join("")}</blockquote>`);
      blockquote = [];
    }
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushBlockquote();
      continue;
    }

    if (trimmed.includes("|") && lines[index + 1] && isTableDelimiter(lines[index + 1])) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const tableLines = [trimmed, lines[index + 1].trim()];
      index += 2;
      while (lines[index] && lines[index].includes("|")) {
        tableLines.push(lines[index].trim());
        index += 1;
      }
      index -= 1;
      html.push(renderTable(tableLines));
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      flushBlockquote();
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(unordered[1]);
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      flushBlockquote();
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(ordered[1]);
      continue;
    }

    const quote = trimmed.match(/^>\s?(.+)$/);
    if (quote) {
      flushParagraph();
      flushList();
      blockquote.push(quote[1]);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushBlockquote();
  return html.join("\n");
};
