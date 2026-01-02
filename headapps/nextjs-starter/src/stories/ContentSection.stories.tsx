import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import { Default as ContentSection } from 'src/components/ContentSection';

import type { PageTitleBannerProps } from 'src/core/molecules/PageTitleBanner/PageTitleBanner.type';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

const sectionFields = {
  Image: {
    value: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop',

      alt: 'Team collaboration',

      width: '1200',

      height: '630',
    },
  },

  Category: { value: 'FastLane' },

  Title: { value: 'Launch Sitecore XM Cloud faster' },

  IntroText: {
    value:
      '<p>ContentSection wraps the PageTitleBanner experience, so this story exercises the same placeholder-driven composition with a SitecoreProvider context.</p>',
  },

  CalltoActionLinkMain: {
    value: {
      href: 'https://www.altudo.co',

      text: 'Talk to Altudo',

      linktype: 'external',
    },
  },

  CalltoActionLinkSecondary: {
    value: {
      href: '/components',

      text: 'Explore components',

      linktype: 'internal',
    },
  },
};

const sectionParams: PageTitleBannerProps['params'] = {
  RenderingIdentifier: 'content-section-demo',

  styles: 'bg-white rounded-3xl overflow-hidden shadow-lg',

  HeaderTag: 'h2',

  ImageOrder: 'right',

  GridParameters: 'container mx-auto',
};

const sectionRendering = {
  componentName: 'ContentSection',

  dataSource: '{44444444-4444-4444-4444-444444444444}',

  uid: 'storybook-content-section',

  params: sectionParams,
};

const meta: Meta<typeof ContentSection> = {
  title: 'Components/FL/ContentSection',

  component: ContentSection,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof ContentSection> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <div className="max-w-5xl mx-auto">
      <ContentSection {...args} />
    </div>
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.args = {
  fields: sectionFields,

  params: sectionParams,

  rendering: sectionRendering,
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(
    canvas.getByRole('heading', { name: /launch sitecore xm cloud faster/i })
  ).toBeVisible();

  await expect(canvas.getByRole('link', { name: /talk to altudo/i })).toHaveAttribute(
    'href',

    'https://www.altudo.co'
  );
};
