import { Image } from 'antd';
import { useEffect, useState } from 'react';
import { appConfig } from '../appConfig';

const ImageComponent = ({
  size,
  path,
  ...props
}: {
  size: string;
  path?: string;
  [k: string]: any;
}) => {
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [retryCount, setRetryCount] = useState(0);

  const loadImg = (timestamp: boolean) => {
    if (retryCount > 2) return;
    const newSrc = `${appConfig.imageBaseUrl}${size}${path}${
      timestamp ? `?${Date.now()}` : ''
    }`;
    setSrc(newSrc);
    setRetryCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (!path) {
      setSrc(undefined);
    } else {
      loadImg(false);
    }
  }, [size, path]);

  return src ? (
    <Image src={src} onError={() => loadImg(true)} {...props} />
  ) : (
    <Image src={undefined} {...props} />
  );
};

export default ImageComponent;
