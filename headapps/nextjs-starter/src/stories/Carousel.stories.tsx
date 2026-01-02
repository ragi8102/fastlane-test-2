import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import { Default as Carousel } from 'src/components/Carousel';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

const buildSlide = (uid: string, title: string, body: string) => ({
  uid,

  componentName: 'CarouselSlide',

  dataSource: `{${uid.toUpperCase()}}`,

  params: {
    DynamicPlaceholderId: uid,

    styles:
      'bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white h-[360px] flex items-center',
  },

  placeholders: {
    'slide-{*}': [
      {
        uid: `${uid}-content`,

        componentName: 'FLRichText',

        params: { styles: 'prose prose-invert max-w-xl px-10' },

        fields: {
          Text: { value: `<h2>${title}</h2><p>${body}</p>` },
        },
      },
    ],
  },
});

const slides = [
  buildSlide(
    'slide-1',

    'Composable experiences',

    'Blend XM Cloud components and custom placeholders inside slick slides.'
  ),

  buildSlide(
    'slide-2',

    'Storybook ready',

    'Swap slide content via args to preview authoring behavior.'
  ),

  buildSlide(
    'slide-3',

    'Fully responsive',

    'Settings mirror react-slick configuration used in production.'
  ),
];

const carouselParams = {
  RenderingIdentifier: 'carousel-demo',

  DynamicPlaceholderId: 'hero',

  SlidesToShow: '2',

  SlidesToScroll: '1',

  EnableCenterZoom: '0',

  ArrowPosition: 'Bottom',

  textAlignment: 'left',

  styles: 'w-full',
};

const carouselRendering = {
  componentName: 'Carousel',

  dataSource: '{AAAAAAA1-AAAA-AAAA-AAAA-AAAAAAAAAAA1}',

  uid: 'storybook-carousel',

  params: carouselParams,

  placeholders: {
    'carouselslides-{*}': slides,

    'carouselslides-hero': slides,
  },
};

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',

  component: Carousel,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof Carousel> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <div className="max-w-5xl mx-auto">
      <Carousel {...args} />
    </div>
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.args = {
  params: carouselParams,

  rendering: carouselRendering,
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByRole('heading', { name: /composable experiences/i })).toBeVisible();
};
