#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';

const inputPath = path.resolve(__dirname, './all-variables.json');
const outputPath = path.resolve(__dirname, './theme-vars.css');

// Helper function to transform array format to nested object format
// Converts: { "color": [{ "name": "accent-dark", "value": "#007eb4" }] }
// To: { "color": { "accent-dark": { "type": "color", "value": "#007eb4" } } }
// Also handles composite tokens with groups:
// { "text": [{ "name": "2xl", "groups": [{ "name": "font-size", "value": "24px" }] }] }
function transformArrayToNestedObject(variables: any): any {
  const result: any = {};
  
  for (const [groupKey, items] of Object.entries(variables)) {
    if (Array.isArray(items)) {
      result[groupKey] = {};
      for (const item of items) {
        // Handle composite tokens with groups (e.g., text tokens with font-size and line-height)
        if (item.groups && Array.isArray(item.groups)) {
          for (const group of item.groups) {
            if (group.name && group.value !== undefined) {
              // Create a composite key: e.g., "text.2xl.font-size"
              const compositeKey = `${groupKey}.${item.name}.${group.name}`;
              // Store it in a nested structure
              if (!result[groupKey][item.name]) {
                result[groupKey][item.name] = {};
              }
              result[groupKey][item.name][group.name] = {
                type: group.name,
                value: group.value
              };
            }
          }
        } 
        // Handle simple tokens with direct values
        else if (item.name && item.value !== undefined) {
          result[groupKey][item.name] = {
            type: groupKey,
            value: item.value
          };
        }
      }
    } else {
      result[groupKey] = items;
    }
  }
  
  return result;
}

const raw = fs.readFileSync(inputPath, 'utf-8');

// Try new format first (collections array)
let tailwind: any;
let theme: any;

try {
  // Remove comments from the JSON file
  const cleanedRaw = raw.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  const data = JSON.parse(cleanedRaw);
  
  if (data.collections && Array.isArray(data.collections)) {
    // New format: { collections: [...] }
    const tailwindCollection = data.collections.find((c: any) => c.name === 'TailwindCSS');
    const themeCollection = data.collections.find((c: any) => c.name === 'Theme');
    
    if (!tailwindCollection || !themeCollection) {
      console.error('❌ Could not find TailwindCSS or Theme collections in the file.');
      console.error('Available collections:', data.collections.map((c: any) => c.name).join(', '));
      process.exit(1);
    }
    
    // Extract the Default mode from TailwindCSS
    const tailwindMode = tailwindCollection.modes.find((m: any) => m.name === 'Default');
    if (!tailwindMode) {
      console.error('❌ Could not find Default mode in TailwindCSS collection.');
      process.exit(1);
    }
    
    // Transform array format to nested object format for TailwindCSS
    tailwind = transformArrayToNestedObject(tailwindMode.variables);
    
    // For Theme, we need to handle the mode differently
    // Usually theme has modes like 'Default', 'BSW', etc.
    const defaultThemeMode = themeCollection.modes.find((m: any) => m.name === 'Default') || themeCollection.modes[0];
    if (!defaultThemeMode) {
      console.error('❌ Could not find any mode in Theme collection.');
      process.exit(1);
    }
    
    // Transform array format to nested object format for Theme
    const themeVariables = transformArrayToNestedObject(defaultThemeMode.variables);
    
    // Rename 'color' to 'colors' if it exists
    if (themeVariables.color) {
      themeVariables.colors = themeVariables.color;
      delete themeVariables.color;
    }
    
    theme = themeVariables;
    
    // Also extract variables from ALL other collections (like Mode collection)
    // Merge them into tailwind for processing
    for (const collection of data.collections) {
      if (collection.name !== 'TailwindCSS' && collection.name !== 'Theme') {
        const collectionMode = collection.modes.find((m: any) => m.name === 'Default') || collection.modes[0];
        if (collectionMode && collectionMode.variables) {
          const otherVars = transformArrayToNestedObject(collectionMode.variables);
          // Merge into tailwind object
          Object.assign(tailwind, otherVars);
        }
      }
    }
    
    console.log('✅ Successfully parsed collections format');
  } else {
    // Old format: try regex matching
    const rawWithMarker = raw + '    /*   */';
    const tailwindMatch = rawWithMarker.match(
      /\/\* 1\. TailwindCSS\.Default\.tokens\.json \*\/\s+({[\s\S]*?})\s+\/\*/
    );
    const themeMatch = rawWithMarker.match(
      /\/\* 2\. Theme\.Default\.tokens\.json \*\/\s+({[\s\S]*?})\s+\/\*/
    );

    if (!tailwindMatch || !themeMatch) {
      console.error('❌ Could not extract JSON sections using old format.');
      process.exit(1);
    }

    tailwind = JSON.parse(tailwindMatch[1]);
    theme = JSON.parse(themeMatch[1]);
    
    console.log('✅ Successfully parsed legacy format');
  }
} catch (error) {
  console.error('❌ Error parsing all-variables.json:', error);
  process.exit(1);
}

const tokenMap: Record<string, string> = {};
const outputMap: Map<string, string> = new Map(); // CSS var -> resolved value

// Keys that should be suffixed with 'px'
const pxUnitPaths = [
  'font.size.',
  'font-size.',
  'radius.',
  'border-radius.',
  'border-width.',
  'width.',
  'height.',
  'line-height.',
  'spacing.',
  'letter-spacing.',
];

// Flatten Tailwind tokens into tokenMap
function flattenTokens(obj: any, prefix = '') {
  for (const key in obj) {
    const val = obj[key];
    if (val?.type && val?.value !== undefined) {
      tokenMap[`${prefix}${key}`] = val.value;
    } else if (typeof val === 'object') {
      flattenTokens(val, `${prefix}${key}.`);
    }
  }
}

flattenTokens(tailwind);

// Resolve token references recursively
function resolveToken(value: unknown, depth = 0): string {
  const str = String(value);
  if (!str.startsWith('{') || depth > 10) return str;
  const key = str.replace(/[{}]/g, '');
  const resolved = tokenMap[key];
  if (!resolved) {
    console.warn(`⚠️ Unresolved: ${key}`);
    return str;
  }
  return resolveToken(resolved, depth + 1);
}

// Returns true if this key requires 'px' suffix
function requiresPx(key: string): boolean {
  return pxUnitPaths.some((prefix) => key.startsWith(prefix));
}

// Resolve and apply px suffix if required
function resolveWithPx(key: string, tokenValue: string): string {
  const value = resolveToken(tokenValue);
  
  // Check if value already has a unit (px, rem, em, %, etc.)
  const hasUnit = /\d+(px|rem|em|%|vh|vw|vmin|vmax|ch|ex)$/.test(value);
  
  // Only add px if required and value doesn't already have a unit
  if (requiresPx(key) && !hasUnit && !isNaN(Number(value))) {
    return `${value}px`;
  }
  
  return value;
}

// Sanitize CSS variable name by replacing commas with periods
// (e.g., 'h-3,5' -> 'h-3.5', 'w-2,5' -> 'w-2.5')
// Also prefix numeric-only names to make them valid CSS (e.g., '0' -> 'spacing-0', '30' -> 'alpha-30')
function sanitizeCssVarName(name: string, context: string = ''): string {
  // Replace commas with periods to handle decimal values
  let sanitized = name.replace(/,/g, '.');
  
  // If the name doesn't start with a digit, it's already valid
  if (!/^\d/.test(sanitized)) {
    return sanitized;
  }
  
  // Check if name already has a non-numeric prefix (e.g., "huron-blue")
  // In this case, it's already valid CSS
  const hasNonNumericPrefix = /^[a-zA-Z]/.test(sanitized.split('-')[0]);
  if (hasNonNumericPrefix) {
    return sanitized;
  }
  
  // CSS custom properties cannot start with a digit - add appropriate prefix
  // Determine prefix based on context
  if (context === 'alpha') {
    return `alpha-${sanitized}`;
  } else if (context === 'spacing') {
    return `spacing-${sanitized}`;
  } else if (context === 'breakpoint') {
    return `breakpoint-${sanitized}`;
  } else if (/^\d+(-\d+)?$/.test(sanitized)) {
    // For pure numeric values without context, default to spacing
    return `spacing-${sanitized}`;
  } else {
    // For other numeric-starting values (like 2xl), add generic prefix
    return `breakpoint-${sanitized}`;
  }
}

// Extract final token name (e.g., 'text-4xl') from path
// Also converts commas to periods for decimal values (e.g., 'h-3,5' -> 'h-3.5')
// Note: This is used by extractReferences for theme variables
function extractShortName(path: string): string {
  const parts = path.split('.');
  const lastName = parts[parts.length - 1];
  const parent = parts.length > 1 ? parts[parts.length - 2] : '';
  // Replace commas with periods to handle decimal values properly
  return sanitizeCssVarName(lastName, parent);
}

// Recursively extract generic theme values and collect their tailwind references
function extractReferences(obj: any): void {
  for (const [_, val] of Object.entries(obj)) {
    if (
      (val as any)?.type &&
      typeof (val as any).value === 'string' &&
      (val as any).value.startsWith('{')
    ) {
      const refPath = (val as any).value.replace(/[{}]/g, '');
      const short = extractShortName(refPath);
      if (!outputMap.has(short)) {
        // Skip variables with dots in the name (e.g., h-0.5, w-1.5) as they cause errors
        if (!short.includes('.')) {
          const resolved = resolveWithPx(refPath, (val as any).value);
          outputMap.set(short, resolved);
        }
      }
    } else if (typeof val === 'object') {
      extractReferences(val);
    }
  }
}

// Build light/dark color CSS blocks
function buildColorBlock(mode: 'light' | 'dark'): string[] {
  const suffix = mode === 'dark' ? '-dark' : '-light';
  const lines: string[] = [];

  for (const [key, val] of Object.entries(theme.colors)) {
    if (key.endsWith(suffix)) {
      // Create the base variable (without suffix)
      // e.g., accent-dark becomes --accent in .dark section
      const baseKey = key.replace(suffix, '');
      const baseVarName = `--${sanitizeCssVarName(baseKey, 'color')}`;
      lines.push(`  ${baseVarName}: ${resolveToken((val as any).value)};`);
    }
  }

  return lines;
}

// Run reference scan (generic variables from Theme)
const themeWithoutColors = { ...theme };
delete themeWithoutColors.colors;

extractReferences(themeWithoutColors);

// Add all color variables with -dark and -light suffixes to outputMap
// This ensures they're available as CSS variables in :root
if (theme.colors) {
  for (const [key, val] of Object.entries(theme.colors)) {
    if (key.endsWith('-dark') || key.endsWith('-light')) {
      const sanitizedKey = sanitizeCssVarName(key, 'color');
      if (!outputMap.has(sanitizedKey)) {
        // Skip variables with dots in the name as they cause errors
        if (!sanitizedKey.includes('.')) {
          outputMap.set(sanitizedKey, resolveToken((val as any).value));
        }
      }
    }
  }
}

// Extract all TailwindCSS variables with direct values
function extractTailwindVariables(obj: any, prefix = ''): void {
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && 'type' in val && 'value' in val) {
      // This is a leaf token with a direct value
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const parts = fullKey.split('.');
      const lastName = parts[parts.length - 1];
      const parent = parts.length > 1 ? parts[parts.length - 2] : '';
      const grandparent = parts.length > 2 ? parts[parts.length - 3] : '';
      
      // Determine the short name with proper context-aware sanitization
      let shortName: string;
      
      // Handle color shades (e.g., amber-50, blue-100)
      if (grandparent === 'tailwind-colors' || grandparent === 'custom-colors') {
        shortName = sanitizeCssVarName(`${parent}-${lastName}`, parent);
      } else {
        // Pass parent as context for proper prefixing
        shortName = sanitizeCssVarName(lastName, parent);
      }
      
      // Skip if already added by reference extraction
      if (!outputMap.has(shortName)) {
        // Skip variables with dots in the name (e.g., h-0.5, w-1.5) as they cause errors
        if (shortName.includes('.')) {
          continue;
        }
        
        const tokenValue = String((val as any).value);
        const resolved = resolveWithPx(fullKey, tokenValue);
        outputMap.set(shortName, resolved);
      }
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      // Recurse into nested objects
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      extractTailwindVariables(val, newPrefix);
    }
  }
}

// Extract composite variables (like text with font-size and line-height)
// For text.2xl.font-size, create CSS variable --text-2xl with the font-size value
function extractCompositeVariables(obj: any): void {
  // Look for text tokens specifically
  if (obj.text && typeof obj.text === 'object') {
    for (const [sizeName, sizeValue] of Object.entries(obj.text)) {
      if (sizeValue && typeof sizeValue === 'object') {
        // Check if it has font-size
        const fontSize = (sizeValue as any)['font-size'];
        if (fontSize && fontSize.value) {
          const varName = sanitizeCssVarName(`text-${sizeName}`, 'text');
          if (!outputMap.has(varName) && !varName.includes('.')) {
            outputMap.set(varName, String(fontSize.value));
          }
        }
        
        // Also extract line-height if it exists and is different
        const lineHeight = (sizeValue as any)['line-height'];
        if (lineHeight && lineHeight.value) {
          const varName = sanitizeCssVarName(`text-${sizeName}-line-height`, 'text');
          if (!outputMap.has(varName) && !varName.includes('.')) {
            outputMap.set(varName, String(lineHeight.value));
          }
        }
      }
    }
  }
  
  // Look for heading tokens (heading-lg, heading-md, etc.)
  Object.keys(obj).forEach(key => {
    if (key.startsWith('heading-') && typeof obj[key] === 'object') {
      for (const [headingName, headingValue] of Object.entries(obj[key])) {
        if (headingValue && typeof headingValue === 'object') {
          // Extract font-family for headings
          const fontFamily = (headingValue as any)['font-family'];
          if (fontFamily && fontFamily.value) {
            const varName = sanitizeCssVarName(`font-${key}-${headingName}`, 'heading');
            if (!outputMap.has(varName) && !varName.includes('.')) {
              outputMap.set(varName, String(fontFamily.value));
            }
          }
          
          // Extract font-size for headings
          const fontSize = (headingValue as any)['font-size'];
          if (fontSize && fontSize.value) {
            const varName = sanitizeCssVarName(`${key}-${headingName}-size`, 'heading');
            if (!outputMap.has(varName) && !varName.includes('.')) {
              outputMap.set(varName, String(fontSize.value));
            }
          }
          
          // Extract font-weight for headings
          const fontWeight = (headingValue as any)['font-weight'];
          if (fontWeight && fontWeight.value) {
            const varName = sanitizeCssVarName(`${key}-${headingName}-weight`, 'heading');
            if (!outputMap.has(varName) && !varName.includes('.')) {
              outputMap.set(varName, String(fontWeight.value));
            }
          }
        }
      }
    }
  });
  
  // Extract standalone font-family values
  if (obj['font-family'] && typeof obj['font-family'] === 'object') {
    for (const [fontName, fontValue] of Object.entries(obj['font-family'])) {
      if (fontValue && typeof fontValue === 'object' && (fontValue as any).value) {
        const cleanName = fontName.toLowerCase().replace(/\s+/g, '-');
        const varName = sanitizeCssVarName(`font-${cleanName}`, 'font-family');
        if (!outputMap.has(varName) && !varName.includes('.')) {
          outputMap.set(varName, String((fontValue as any).value));
        }
      }
    }
  }
}

// Extract all TailwindCSS variables (border-radius, height, line-height, etc.)
extractTailwindVariables(tailwind);

// Extract composite variables (text with font-size and line-height) from both collections
extractCompositeVariables(tailwind);
extractCompositeVariables(theme);

// Generate CSS output
const rootCss = [
  ':root {',
  ...buildColorBlock('light'),
  ...Array.from(outputMap.entries()).map(([key, val]) => `  --${key}: ${val};`),
  '}',
];

const darkCss = ['', '.dark {', ...buildColorBlock('dark'), '}'];

// Write CSS file
fs.writeFileSync(outputPath, [...rootCss, ...darkCss, ''].join('\n'));
console.log(`✅ theme-vars.css written to ${outputPath}`);
