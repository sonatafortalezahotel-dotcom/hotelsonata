import NextImage, { type ImageProps } from "next/image";
import blobAwareImageLoader from "@/lib/blobAwareImageLoader";
import { toClientBlobUrl } from "@/lib/blobUrl";

/**
 * `next.config` usa `images.loader: "custom"`; no Next 16+ é necessário passar
 * a prop `loader` em cada <Image>. Este wrapper aplica o loader padrão do app.
 */
export type AppImageProps = ImageProps;

export default function AppImage({ loader, src, ...props }: AppImageProps) {
  const normalizedSrc = typeof src === "string" ? toClientBlobUrl(src) : src;
  return (
    <NextImage
      src={normalizedSrc as ImageProps["src"]}
      {...props}
      loader={loader ?? blobAwareImageLoader}
    />
  );
}
