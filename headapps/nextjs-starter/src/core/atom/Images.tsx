// components/atoms/SitecoreImage.tsx
import { Image as ContentSdkImage, ImageField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'react';
import Image from 'next/image';

interface SitecoreImageProps extends ComponentProps<typeof ContentSdkImage> {
  field?: ImageField;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

export const SitecoreImage = ({
  field,
  className,
  fill,
  priority,
  ...rest
}: SitecoreImageProps) => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  if (isEditing) {
    return (
      <ContentSdkImage
        field={field}
        className={className}
        fill={fill}
        priority={priority}
        {...rest}
      />
    );
  }
  const imageProps = fill
    ? {
        fill: true,
      }
    : {
        width: field?.value?.width ? parseFloat(field.value.width.toString()) : 300,
        height: field?.value?.height ? parseFloat(field.value.height.toString()) : 300,
      };
  return (
    <Image
      src={field?.value?.src as string}
      alt={field?.value?.alt as string}
      {...imageProps}
      className={className}
      priority={priority}
    />
  );
};
