import { JSX, useEffect, useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  EmailShareButton,
} from 'react-share';
import { SocialShareProps } from 'src/types/SocialShare.types';
import { SitecoreImage } from 'src/core/atom/Images';

export const Default = (props: SocialShareProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  const imageStyle = {
    maxWidth: '48px',
    width: '100%',
    height: 'auto',
    borderRadius: '50%',
  };

  const iconClassName =
    'max-w-12 h-auto rounded-full dark:bg-secondary-foreground hover:opacity-80 transition-opacity';

  return (
    <div className={props.params.styles} id={id}>
      <div className="flex gap-2.5 my-2.5">
        {shareUrl &&
          props.fields.items.map((item) => (
            <div key={item.id} className="social-share-item">
              {item?.name === 'Facebook' && (
                <FacebookShareButton url={shareUrl} title={String(item.fields.Title.value)}>
                  <SitecoreImage
                    field={item.fields.SocialIcon}
                    className={iconClassName}
                    style={imageStyle}
                  />
                </FacebookShareButton>
              )}
              {item?.name === 'LinkedIn' && (
                <LinkedinShareButton url={shareUrl} title={String(item.fields.Title.value)}>
                  <SitecoreImage
                    field={item.fields.SocialIcon}
                    className={iconClassName}
                    style={imageStyle}
                  />
                </LinkedinShareButton>
              )}
              {item?.name === 'X' && (
                <TwitterShareButton url={shareUrl} title={String(item.fields.Title.value)}>
                  <SitecoreImage
                    field={item.fields.SocialIcon}
                    className={iconClassName}
                    style={imageStyle}
                  />
                </TwitterShareButton>
              )}
              {item?.name === 'Pinterest' && item?.fields?.Media && (
                <PinterestShareButton
                  url={shareUrl}
                  title={String(item?.fields?.Title?.value)}
                  media={item?.fields?.Media}
                >
                  <SitecoreImage
                    field={item.fields.SocialIcon}
                    className={iconClassName}
                    style={imageStyle}
                  />
                </PinterestShareButton>
              )}
              {item?.name === 'Email' && (
                <EmailShareButton url={shareUrl} title={String(item.fields.Title.value)}>
                  <SitecoreImage
                    field={item.fields.SocialIcon}
                    className={iconClassName}
                    style={imageStyle}
                  />
                </EmailShareButton>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
