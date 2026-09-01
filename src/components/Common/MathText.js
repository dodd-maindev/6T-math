import React from 'react';
import katex from 'katex';

/**
 * Renders LaTeX formulas safely. Returns HTML string.
 */
const renderKatex = (latex, displayMode = false) => {
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode });
  } catch (_) {
    return latex;
  }
};

/**
 * Normalizes plain mathematical expressions (like x^2, x >= 2) into LaTeX if not enclosed in $.
 */
const normalizeTextToMath = (text = '') => {
  // If text contains $...$, split by $
  if (text.includes('$')) {
    const parts = text.split(/(\$[^$]+\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const mathContent = part.slice(1, -1);
        const html = renderKatex(mathContent);
        return <span key={index} dangerouslySetInnerHTML={{ __html: html }} className="inline-block mx-0.5" />;
      }
      return <span key={index}>{part}</span>;
    });
  }

  // Fallback auto-detection for common math patterns (x^2, >=, <=, \sqrt)
  const mathRegex = /(\b[a-zA-Z]\^[0-9]+|\b[a-zA-Z]\s*(?:>=|<=|>|<|=)\s*[0-9-]+|\b[a-zA-Z]\^[0-9]+\s*[+-]\s*[0-9a-zA-Z]+|\b[a-zA-Z]\^[0-9]+\s*[+-]\s*[a-zA-Z]\s*[+-]\s*[0-9]+\s*=\s*[0-9]+)/g;
  const tokens = text.split(mathRegex);

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
