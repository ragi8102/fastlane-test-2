# Guide: Using the Figma to Code Generation Plugin

> **Note:** This guide shows you how to use the pre-built Figma plugin included in this project. You need Figma developer access to install and run local plugins.

This document outlines the steps to export design tokens (variables) from Figma and integrate them into your Next.js project using the **FastLane - Extract Variables** plugin (already developed and included in the `figma/` directory).

## 📁 Project Setup

Ensure your project has the following structure:

```text
your-nextjs-project/
├── figma/
├── src/
│   └── styles/
└── tailwind.config.ts
```

> **Important:** You need to have the Figma edit access (full access)

## Step 1: Build and Install the Figma Plugin (Locally)

The plugin code is already provided in the `figma/` directory. You just need to use it in your Figma application.

1. **Open terminal** in your IDE navigate to the `figma/` folder:

   ```bash
   cd figma
   ```

2. **Install dependencies** (if not already installed):

   ```bash
   npm install
   ```

3. **Build the plugin**:

   ```bash
   npm run build
   ```

   This compiles the plugin code and creates a `dist/` folder with the necessary files.

4. **Open Figma Desktop App** and navigate to **Design Mode** in your design file.

![screenshot](/images/guides/figma-design-mode.png "screenshot")
*Figma MCP Server option*

5. **Install the plugin locally**:
   - Click the **Actions** button (located at the bottom center of Figma)
   - Select **Plugins & widgets** → **Development** → **Import plugin from manifest**
   - Navigate to your project's `figma/dist/` folder
   - Select the `manifest.json` file

  ![screenshot](/images/guides/cursor-action-&-manifest.png "screenshot")
*Figma MCP Server option*

6. The plugin **"FastLane - Extract Variables"** will now appear in your development plugins list and is ready to use.

## Step 2: Extract Variables from Figma

1. **Open your Figma design file** that contains the design tokens/variables you want to extract.

2. **Run the plugin**:
   - Click the **Actions** button (bottom center)
   - Select **Plugins** → **Development** → **FastLane - Extract Variables**
   - The plugin will extract all variables from your Figma file

3. **Save the output**:
   - The plugin will prompt you to choose a download location
   - Save the file (it will be named something like `figma-variables.json`)

4. **Copy the extracted variables**:
   - Open the downloaded JSON file
   - Copy all the content
   - Paste it into `figma/all-variables.json` in your project (replace the existing content)

## Step 3: Generate CSS Variables and Tailwind Config

1. **Navigate to the figma directory** (if not already there):

   ```bash
   cd figma
   ```

2. **Run the generation script**:

   ```bash
   npm run get-updated-variables
   ```

   This command runs two scripts:
   - `generate-css-variables` - Creates `theme-vars.css` with CSS custom properties
   - `generate-tailwind-config` - Updates `tailwind.config.ts` with Tailwind theme values

3. **Verify the output files**:
   - `figma/theme-vars.css` - Contains all CSS variables for:
     - Light and dark theme colors
     - Font sizes, families, weights
     - Border radius values
     - Width and height values
     - Line heights
     - Spacing scales
     - Letter spacing
   - `figma/tailwind.config.ts` - Tailwind configuration with all design tokens

## Step 4: Import CSS Variables in Your Project

1. **Copy the theme variables CSS** to your main CSS file:

   - Open `figma/theme-vars.css`
   - Copy all the content
   - Paste it into your main CSS file (e.g., `src/app/globals.css`)

   Alternatively, you can import it:

   ```css
   /* In your main CSS file (e.g., src/app/globals.css) */
   @import '../figma/theme-vars.css';
   ```

2. **Copy the Tailwind config** from `figma/tailwind.config.ts` to your project's root `tailwind.config.ts`:

   ```bash
   cp figma/tailwind.config.ts ./tailwind.config.ts
   ```

   Or manually merge the generated configuration with your existing Tailwind config.

## Step 5: Using Design Tokens

### Using Tailwind Classes

The generated Tailwind config includes all your Figma design tokens:

```tsx
// Using color tokens
<div className="bg-primary text-primary-foreground">
  Primary colored section
</div>

// Using spacing tokens (automatically includes h-3.5, w-2.5, etc.)
<div className="p-4 m-2 w-3.5 h-3.5">
  Consistent spacing
</div>

// Using typography tokens
<h1 className="text-4xl font-semibold leading-10">
  Main Title
</h1>

// Using border radius
<button className="rounded-lg border-2">
  Rounded Button
</button>
```

### Using CSS Variables

The `theme-vars.css` file provides CSS custom properties:

```css
/* Available CSS variables */
.custom-element {
  /* Color variables (light/dark mode) */
  background-color: var(--primary);
  color: var(--primary-foreground);
  
  /* Spacing variables (includes decimal values like 0.5, 1.5, etc.) */
  padding: var(--4);
  margin: var(--2);
  width: var(--w-3.5);
  height: var(--h-2.5);
  
  /* Typography variables */
  font-size: var(--text-2xl);
  line-height: var(--leading-8);
  
  /* Border radius */
  border-radius: var(--rounded-lg);
}
```

### Dark Mode Support

The generated CSS includes automatic dark mode support:

```tsx
// Add dark mode class to your root element
<html className="dark">
  {/* Colors automatically switch to dark mode variants */}
</html>
```

## Step 6: Validation & Testing

1. **Verify the generated files**:

   ```bash
   # Check that theme-vars.css was created
   ls figma/theme-vars.css

   # Check that tailwind.config.ts was updated
   ls figma/tailwind.config.ts
   ```

2. **Test in your application**:
   - Start your development server
   - Verify colors, spacing, and typography are applied correctly
   - Test dark mode switching

3. **Check for console errors** related to missing variables or invalid values.

## Available NPM Scripts

Located in `figma/package.json`:

```bash
# Build the Figma plugin
npm run build

# Generate CSS variables only
npm run generate-css-variables

# Generate Tailwind config only
npm run generate-tailwind-config

# Generate both CSS variables and Tailwind config
npm run get-updated-variables
```

## Quick Reference

### Complete Workflow Summary

```bash
# 1. Navigate to figma directory
cd figma

# 2. Install dependencies (first time only)
npm install

# 3. Build the plugin (first time or after code changes)
npm run build

# 4. Extract variables from Figma using the plugin
# (Manual step in Figma UI - save output to all-variables.json)

# 5. Generate CSS and Tailwind config
npm run get-updated-variables

# 6. Copy or import the generated files to your project
# - Import theme-vars.css in your main CSS
# - Copy/merge tailwind.config.ts to project root
```

### Generated File Locations

```text
figma/
├── all-variables.json          # Input: Exported from Figma
├── theme-vars.css              # Output: CSS custom properties
└── tailwind.config.ts          # Output: Tailwind configuration
```

## Integration with FastLane

This plugin works seamlessly with FastLane's component development workflow:

1. **Design Tokens First**: Export tokens before creating components
2. **Component Generation**: Use tokens in [AI component prompts](../../component-development/ai-prompts/templates/create-component)
3. **Consistency**: Ensure all components use the exported design system
4. **Theming**: Leverage light/dark mode support for consistent theming

## Related Tools

- **[Figma MCP Server](./figma-mcp-server-setup)** - For direct AI access to Figma designs
- **[Create Component Prompt](../../component-development/ai-prompts/templates/create-component)** - For AI-powered component generation

---

**Ready to streamline your design-to-code workflow?** This plugin bridges Figma design systems with FastLane development for consistent, maintainable styling! 🎨✨
