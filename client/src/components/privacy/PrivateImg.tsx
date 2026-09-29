import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { fileIdFromRef, isPrivateFileRef } from '@/lib/privacy/privateFile';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src?: string;
};

export const PrivateImg: React.FC<Props> = ({ src, alt, ...rest }) => {
  const [blobUrl, setBlobUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!isPrivateFileRef(src)) {
      setBlobUrl(undefined);
      return;
    }
    let objectUrl: string | undefined;
    let cancelled = false;
    api
      .getClusterFileBlob(fileIdFromRef(src))
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setBlobUrl(undefined);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  const resolved = isPrivateFileRef(src) ? blobUrl : src;
  if (!resolved) return null;

  return <img src={resolved} alt={alt} {...rest} />;
};
