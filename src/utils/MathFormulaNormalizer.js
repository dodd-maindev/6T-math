/**
 * Utility to convert raw LaTeX math strings into human-readable Unicode mathematical expressions.
 */
export class MathFormulaNormalizer {
  /**
   * Normalizes mathematical expressions for text-only environments like Excel spreadsheets.
   * @param {string} text - Raw text possibly containing LaTeX notations.
   * @returns {string} Cleaned text with Unicode math symbols.
   */
  static normalize(text = '') {
    if (!text) return '';

    return text
      // Fractions \frac{a}{b} -> a/b
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
      .replace(/\\frac\s+([a-zA-Z0-9]+)\s+([a-zA-Z0-9]+)/g, '$1/$2')
      // Greek & Geometry symbols
      .replace(/\\Delta\b/g, 'Δ')
      .replace(/\\alpha\b/g, 'α')
      .replace(/\\beta\b/g, 'β')
      .replace(/\\pi\b/g, 'π')
      .replace(/\\angle\b/g, '∠')
      .replace(/\\widehat\{([^{}]+)\}/g, '∠$1')
      // Trigonometric & Logarithmic functions
      .replace(/\\cos\b/g, 'cos')
      .replace(/\\sin\b/g, 'sin')
      .replace(/\\tan\b/g, 'tan')
      .replace(/\\cot\b/g, 'cot')
      .replace(/\\log\b/g, 'log')
      .replace(/\\ln\b/g, 'ln')
      // Degree symbols
      .replace(/\^\{\\circ\}|\^\\circ|\\circ/g, '°')
      // Exponents and roots
      .replace(/\^2\b/g, '²')
      .replace(/\^3\b/g, '³')
      .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
      // Relational and arithmetic operators
      .replace(/\\approx\b/g, '≈')
      .replace(/\\le\b|\\leq\b/g, '≤')
      .replace(/\\ge\b|\\geq\b/g, '≥')
      .replace(/\\ne\b|\\neq\b/g, '≠')
      .replace(/\\pm\b/g, '±')
      .replace(/\\cdot\b/g, '·')
      .replace(/\\times\b/g, '×')
      .replace(/\\in\b/g, '∈')
      // Remove text wrappers and dollar delimiters
      .replace(/\\text\{([^{}]+)\}/g, '$1')
      .replace(/\\mathbb\{([^{}]+)\}/g, '$1')
      .replace(/\\mathbf\{([^{}]+)\}/g, '$1')
      .replace(/\$+/g, '')
      .replace(/\\([a-zA-Z]+)/g, '$1')
      .trim();
  }
}

export default MathFormulaNormalizer;
