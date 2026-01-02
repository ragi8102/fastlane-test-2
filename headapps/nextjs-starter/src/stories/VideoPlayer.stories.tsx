import type { Meta, StoryFn } from '@storybook/react';
import { Default as VideoPlayer } from '../components/VideoPlayer';
import { VideoPlayerProps } from '../components/VideoPlayer';
import { canvasWithin, expect } from './testUtils';

export default {
  title: 'Components/VideoPlayer',
  component: VideoPlayer,
  tags: ['autodocs'],
  argTypes: {
    videoUrl: {
      control: 'text',
      defaultValue: 'https://www.youtube.com/watch?v=D0UnqGm_miA',
    },
    figmaUrl: {
      control: 'text',
      description: 'URL to the Figma design for this component',
    },
  },
} as Meta<typeof VideoPlayer>;

const Template: StoryFn<VideoPlayerProps & { videoUrl: string; figmaUrl?: string }> = (args) => (
  <VideoPlayer
    {...args}
    params={{
      styles: 'video-container',
      RenderingIdentifier: 'video1',
      figmaUrl: args.figmaUrl || '',
    }}
    fields={{
      VideoLink: {
        value: {
          url: args.videoUrl,
        },
      },
    }}
  />
);

export const Default = Template.bind({});
Default.args = {
  videoUrl: 'https://www.youtube.com/watch?v=D0UnqGm_miA',
  figmaUrl: 'No_URL_PROVIDED',
  params: {
    styles: 'video-container',
    RenderingIdentifier: 'video1',
  },
  fields: {
    VideoLink: {
      value: {
        url: 'https://www.youtube.com/watch?v=D0UnqGm_miA',
      },
    },
  },
};
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=369-1609&t=UMEjrtOKmNdHlXif-4',
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const frame = await canvas.findByTitle(/youtube video player/i);
  await expect(frame).toHaveAttribute('src', expect.stringContaining('youtube'));
};
