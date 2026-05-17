"use client";

import { useState } from "react";

type ImageWithFallbackProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyIgc3Ryb2tlPSIjYTZhNmE2IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjMuNyI+PHJlY3QgeD0iMTYiIHk9IjE2IiB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHJ4PSI2Ii8+PHBhdGggZD0ibTE2IDU4IDE2LTE4IDMyIDMyIi8+PGNpcmNsZSBjeD0iNTMiIGN5PSIzNSIgcj0iNyIvPjwvc3ZnPg==";

const ImageWithFallback = ({
  src,
  alt = "",
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  className,
  ...props
}: ImageWithFallbackProps) => {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <img
      {...props}
      src={imageSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={() => setImageSrc(fallbackSrc)}
    />
  );
};

export default ImageWithFallback;
