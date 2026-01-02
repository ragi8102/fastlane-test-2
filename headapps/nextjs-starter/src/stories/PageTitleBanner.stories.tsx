import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import { Default as PageTitleBanner } from 'src/components/PageTitleBanner';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

const bannerFields = {
  Image: {
    value: {
      src: 'https://images.unsplash.com/photo-1470165518243-ff5dced5a483?w=1600&auto=format&fit=crop',

      alt: 'City skyline',

      width: '1600',

      height: '900',
    },
  },

  Category: { value: 'Case Study' },

  Title: { value: 'Supercharge XM Cloud delivery' },

  IntroText: {
    value:
      '<p>Reusable banners streamline layout for landing pages, releases, and multi-lingual hero sections.</p>',
  },

  CalltoActionLinkMain: {
    value: {
      href: 'https://www.altudo.co',

      text: 'Contact Altudo',

      linktype: 'external',

      target: '_blank',
    },
  },

  CalltoActionLinkSecondary: {
    value: {
      href: '/components',

      text: 'Browse components',

      linktype: 'internal',
    },
  },
};

const bannerParams = {
  RenderingIdentifier: 'page-title-banner',

  styles: 'bg-slate-950 text-white rounded-[32px] overflow-hidden shadow-xl',

  HeaderTag: 'h1',

  ImageOrder: 'right',

  GridParameters: 'container mx-auto',
} as const;

const bannerRendering = {
  componentName: 'PageTitleBanner',

  dataSource: '{55555555-5555-5555-5555-555555555555}',

  uid: 'storybook-page-title-banner',

  params: bannerParams,
};

const meta: Meta<typeof PageTitleBanner> = {
  title: 'Components/FL/PageTitleBanner',

  component: PageTitleBanner,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof PageTitleBanner> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <PageTitleBanner {...args} />
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.args = {
  fields: bannerFields,

  params: bannerParams,

  rendering: bannerRendering,
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(
    canvas.getByRole('heading', { name: /supercharge xm cloud delivery/i })
  ).toBeVisible();

  await expect(canvas.getByRole('link', { name: /contact altudo/i })).toHaveAttribute(
    'href',

    'https://www.altudo.co'
  );
};
