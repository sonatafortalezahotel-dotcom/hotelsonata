"use client";

import NextImage, { type ImageProps } from "next/image";
import blobAwareImageLoader from "@/lib/blobAwareImageLoader";
import { toClientBlobUrl } from "@/lib/blobUrl";

/**
 * Client Component: o loader customizado não pode ser passado de Server Components.
 * Use este wrapper em vez de `next/image` direto (Blob privado + paths com espaços).
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
