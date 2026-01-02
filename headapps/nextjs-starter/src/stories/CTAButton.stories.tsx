import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import { Default as CTAButton } from 'src/components/CTAButton';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

const meta: Meta<typeof CTAButton> = {
  title: 'Components/FL/CTAButton',

  component: CTAButton,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof CTAButton> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <div className="max-w-sm">
      <CTAButton {...args} />
    </div>
  </SitecoreProvider>
);

export const Primary = Template.bind({});

Primary.args = {
  params: {
    RenderingIdentifier: 'cta-button',

    styles: '',

    ButtonStyle: 'primary',

    Styles: '',
  },

  fields: {
    ButtonImage: {
      value: {
        src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&auto=format&fit=crop',

        alt: 'Lightning icon',

        width: '120',

        height: '120',
      },
    },

    ButtonLink: {
      value: {
        href: 'https://www.altudo.co',

        text: 'Book a demo',

        title: 'Book a demo',

        linktype: 'external',

        target: '_blank',
      },
    },
  },
};

Primary.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  const button = await canvas.findByRole('link', { name: /book a demo/i });

  await expect(button).toHaveAttribute('href', 'https://www.altudo.co');
};
