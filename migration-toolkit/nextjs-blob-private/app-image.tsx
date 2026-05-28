import NextImage, { type ImageProps } from "next/image";
import blobAwareImageLoader from "./blobAwareImageLoader";
import { toClientBlobUrl } from "./blobUrl";

/**
 * `next.config` com `images.loader: "custom"`: no Next 16+ costuma ser preciso
 * passar a prop `loader` em cada <Image>. Este wrapper aplica o loader padrão.
 *
 * No teu projecto, se usares @/ (alias), troca:
 *   import ... from "@/lib/blobUrl"
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
