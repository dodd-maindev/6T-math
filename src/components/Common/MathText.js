import React from 'react';
import katex from 'katex';

/**
 * Safely renders LaTeX formula into HTML using KaTeX.
 */
const renderKatex = (latex, displayMode = false) => {
  try {
    return katex.renderToString(latex.trim(), { throwOnError: false, displayMode });
  } catch (_) {
    return latex;
  }
};

/**
 * Preprocesses text by detecting LaTeX delimiters, parenthesized LaTeX, and bare backslash commands.
 */
const preprocessMathText = (raw = '') => {
  if (!raw) return '';
  let str = String(raw);

  // 1. Convert LaTeX delimiters \( ... \) and \[ ... \]
  str = str.replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');
  str = str.replace(/\\\[([\s\S]*?)\\\]/g, '$$$$$1$$$$');

  // 2. Wrap parenthesized LaTeX expressions: (\widehat{...}) -> ($\widehat{...}$)
  str = str.replace(/\(([^$()]*?\\[a-zA-Z]+[^$()]*?)\)/g, '($$$1$$)');

  // 3. Scan parts outside $...$ and auto-wrap bare LaTeX commands (\Delta, \frac, \sim, etc.)
  const parts = str.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);
  return parts.map(part => {
    if ((part.startsWith('$') && part.endsWith('$')) || (part.startsWith('$$') && part.endsWith('$$'))) {
      return part;
    }
    return part
      .replace(/((?:\\[a-zA-Z]+(?:\{[^{}]*\}|\^\{[^{}]*\}|_\{[^{}]*\}|[0-9a-zA-Z^_]+)*|\b[a-zA-Z]\b|\d+)\s*(?:[=+\-*/~<>:]\s*(?:\\[a-zA-Z]+(?:\{[^{}]*\}|\^\{[^{}]*\}|_\{[^{}]*\}|[0-9a-zA-Z^_]+)*|\b[a-zA-Z]\b|\d+)\s*)+)/g, (m) => {
        return m.includes('\\') ? `$${m.trim()}$` : m;
      })
      .replace(/(\\[a-zA-Z]+(?:\{[^{}]*\}|\^\{[^{}]*\}|_\{[^{}]*\}|[0-9a-zA-Z^_]+)*)/g, '$$$1$$');
  }).join('');
};

/**
 * Normalizes and renders math formulas inside strings.
 */
const normalizeTextToMath = (text = '') => {
  const preprocessed = preprocessMathText(text);

  if (preprocessed.includes('$')) {
    const parts = preprocessed.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const html = renderKatex(part.slice(2, -2), true);
        return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="block my-1 text-center" />;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        const html = renderKatex(part.slice(1, -1), false);
        return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="inline-block mx-0.5" />;
      }
      return <span key={index}>{part}</span>;
    });
  }

  // Fallback for simple algebraic patterns like x^2, >=, <=
  const mathRegex = /(\b[a-zA-Z]\^[0-9]+|\b[a-zA-Z]\s*(?:>=|<=|>|<|=)\s*[0-9-]+)/g;
  const tokens = preprocessed.split(mathRegex);

  return tokens.map((token, idx) => {
    if (mathRegex.test(token)) {
      const latex = token.replace(/>=/g, '\\ge ').replace(/<=/g, '\\le ');
      const html = renderKatex(latex);
      return <span key={idx} dangerouslySetInnerHTML={{ __html: html }} className="inline-block mx-0.5" />;
    }
    return <span key={idx}>{token}</span>;
  });
};

/**
 * MathText Component: Automatically renders LaTeX and embedded math formulas using KaTeX.
 */
export const MathText = ({ content = '', className = '' }) => {
  if (!content) return null;
  return <span className={className}>{normalizeTextToMath(String(content))}</span>;
};

export default MathText;
