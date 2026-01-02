#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

const inputPath = path.resolve(__dirname, './theme-vars.css');
const outputPath = path.resolve(__dirname, './tailwind.config.ts');

const css = fs.readFileSync(inputPath, 'utf-8');

const theme: Record<string, Record<string, string>> = {
  fontSize: {},
  fontFamily: {},
  borderRadius: {},
  borderWidth: {},
  width: {},
  height: {},
  lineHeight: {},
  spacing: {},
  screens: {},
  colors: {},
};

const mapPrefixToThemeKey = (prefix: string): keyof typeof theme | null => {
  switch (prefix) {
    case 'text':
      return 'fontSize';
    case 'font':
      return 'fontFamily';
    case 'rounded':
      return 'borderRadius';
    case 'border':
      return 'borderWidth';
    case 'w':
      return 'width';
    case 'h':
      return 'height';
    case 'leading':
      return 'lineHeight';
    case 'spacing':
    case 'space':
      return 'spacing';
    default:
      return null;
  }
};

// Special handling for breakpoints (should go to screens)
const isBreakpoint = (varName: string): boolean => {
  return ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'].includes(varName);
};

css.split('\n').forEach((line) => {
  const match = line.trim().match(/^--([a-z0-9-]+):\s*([^;]+);/i);
  if (!match) return;

  const [_, varName, rawValue] = match;
  const value = rawValue.trim();
  const varValue = `var(--${varName})`;
  const parts = varName.split('-');
  const prefix = parts[0];
  const suffix = parts.slice(1).join('-');

  // Handle breakpoints specially
  if (isBreakpoint(varName)) {
    theme.screens[varName] = varValue;
    return;
  }

  // Handle font-family specially - format as array with fallbacks
  if (prefix === 'font') {
    // Skip font-size and font-weight - they don't belong in fontFamily
    if (suffix === 'size' || suffix === 'weight') {
      theme.colors[varName] = varValue;
      return;
    }
    
    // Handle actual font-family values
    if (suffix === 'family' || suffix.startsWith('heading-') || suffix.match(/^[a-z]+-[a-z]+$/)) {
      // Extract actual font name from the value for better naming
      // Use suffix if it's meaningful, otherwise extract from value
      let fontKey = suffix === 'family' ? 'heading' : suffix;
      
      // Determine fallback font based on font name
      let fallback = 'sans-serif';
      if (value.toLowerCase().includes('mono') || value.toLowerCase().includes('code')) {
        fallback = 'monospace';
      } else if (value.toLowerCase().includes('serif') && !value.toLowerCase().includes('sans')) {
        fallback = 'serif';
      }
      
      // Format as Tailwind expects: ["var(--font-family)", "fallback"]
      theme.fontFamily[fontKey] = `['${varValue}', '${fallback}']`;
      return;
    }
  }

  const themeKey = mapPrefixToThemeKey(prefix);

  if (themeKey && suffix) {
    theme[themeKey][suffix] = varValue;
  } else {
    // Everything else goes to colors
    theme.colors[varName] = varValue;
  }
});

// Remove empty theme blocks
Object.keys(theme).forEach((key) => {
  if (Object.keys(theme[key]).length === 0) {
    delete theme[key];
  }
});

// Build config as string
function buildObjectLiteral(
  obj: Record<string, any>,
  indent = 2,
  level = 0
): string {
  const space = ' '.repeat(indent);
  const innerIndent = ' '.repeat(indent + 2);
  const entries = Object.entries(obj);
  return `{\n${entries
    .map(([key, val], idx) => {
      const safeKey =
        /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) && !key.includes('-')
          ? key
          : `'${key}'`;
      const isLast = idx === entries.length - 1;
      if (typeof val === 'object') {
        return `${innerIndent}${safeKey}: ${buildObjectLiteral(
          val,
          indent + 2,
          level + 1
        )}${isLast ? '' : ','}`;
      } else {
        // Check if value is already formatted as array (for fontFamily)
        if (val.startsWith('[')) {
          return `${innerIndent}${safeKey}: ${val}${isLast ? '' : ','}`;
        }
        return `${innerIndent}${safeKey}: '${val}'${isLast ? '' : ','}`;
      }
    })
    .join('\n')}\n${space}}`;
}

const configString = `module.exports = {
  theme: {
    extend: ${buildObjectLiteral(theme, 6)}
  }
};
`;

// Format with Prettier
prettier
  .format(configString, {
    parser: 'babel',
    singleQuote: true,
    trailingComma: 'all',
    semi: true,
  })
  .then((formatted) => {
    fs.writeFileSync(outputPath, formatted);
    console.log(`✅ Tailwind theme extension written to ${outputPath}`);
  });
