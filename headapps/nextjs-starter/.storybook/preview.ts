import type { Preview } from '@storybook/react';
import '../style/main.css';
import React from 'react';
import { type ViewportMap } from 'storybook/viewport';

// Save the original createElement
const originalCreateElement = React.createElement;

// Override createElement to intercept problematic components
React.createElement = function patchedCreateElement(type: any, props: any, ...children: any[]) {
  // Check if this is the WithDatasourceCheck component
  if (type && type.name === 'WithDatasourceCheck') {
    // Instead of replacing it, let's fix the props that get passed to the original component
    const OriginalComponent = type;

    // Create a wrapper component that provides the missing context
    const FixedComponent = (componentProps: any) => {
      // Add the missing sitecoreContext with pageEditing
      const fixedProps = {
        ...componentProps,
        sitecoreContext: {
          pageEditing: true,
          pageState: 'edit',
        },
      };

      // Try to render the original component with fixed props
      try {
        return originalCreateElement(OriginalComponent, fixedProps, ...children);
      } catch (error) {
        console.error('Error rendering component:', error);
        // Fallback to rendering children directly if the component errors
        return originalCreateElement(
          'div',
          {
            className: 'patched-component-fallback',
          },
          ...children
        );
      }
    };

    return originalCreateElement(FixedComponent, props);
  }

  // Otherwise, use the original createElement
  return originalCreateElement.apply(React, [type, props, ...children]);
};

// Make sure global context is available
window.pageEditing = {
  getPlaceholderChromes: () => [],
  getFieldChromes: () => [],
  getComponentChromes: () => [],
  isEditing: true,
};

// Mock Sitecore JSS context
const SitecoreContextValue = {
  sitecoreContext: {
    pageEditing: true,
    pageState: 'edit',
    site: { name: 'storybook' },
  },
};

// Create a decorator that provides context
const withSitecoreContext = (Story: any) => {
  // Create a fake context provider
  const ContextProvider = ({ children }: { children: React.ReactNode }) => {
    // Make the context available globally for any components that try to use it
    window.SitecoreContext = SitecoreContextValue;

    return originalCreateElement(
      'div',
      {
        'data-sitecore-context': 'true',
        className: 'sitecore-context-provider',
      },
      children
    );
  };

  return originalCreateElement(ContextProvider, {
    children: originalCreateElement(Story, { children: null }),
  });
};

// Type definitions
declare global {
  interface Window {
    pageEditing: any;
    SitecoreContext: any;
  }
}

const CUSTOM_VIEWPORTS: ViewportMap = {
  iphone17: {
    name: 'iPhone 17',
    styles: { width: '390px', height: '844px' },
    type: 'mobile',
  },
  iphone17Pro: {
    name: 'iPhone 17 Pro',
    styles: { width: '393px', height: '852px' },
    type: 'mobile',
  },
  iphone17ProMax: {
    name: 'iPhone 17 Pro Max',
    styles: { width: '430px', height: '932px' },
    type: 'mobile',
  },
  ipadMini: {
    name: 'iPad mini',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet',
  },
  ipadAir11: {
    name: 'iPad Air 11″',
    styles: { width: '834px', height: '1194px' },
    type: 'tablet',
  },
  ipadPro13: {
    name: 'iPad Pro 13″',
    styles: { width: '1024px', height: '1366px' },
    type: 'tablet',
  },
  desktopLarge: {
    name: 'Large desktop',
    styles: { width: '1920px', height: '1080px' },
    type: 'desktop',
  },
  desktop4k: {
    name: '4K Display',
    styles: { width: '3840px', height: '2160px' },
    type: 'desktop',
  },
};

const preview: Preview = {
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
      options: {
        checks: {
          'color-contrast': {
            options: { noScroll: true },
          },
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: CUSTOM_VIEWPORTS,
    },
  },
  initialGlobals: {
    viewport: { value: 'desktopLarge', isRotated: false },
  },
  decorators: [withSitecoreContext],
};

export default preview;
