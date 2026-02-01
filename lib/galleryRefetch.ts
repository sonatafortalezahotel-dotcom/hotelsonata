/**
 * Registro de callbacks para refetch da galeria após edição de imagem.
 * Usado para atualizar a UI sem depender do evento "gallery-updated" no window
 * (que pode não propagar corretamente em iframes).
 */

const refetchCallbacks = new Set<() => void>();

export function registerGalleryRefetch(callback: () => void): () => void {
  refetchCallbacks.add(callback);
  return () => refetchCallbacks.delete(callback);
}

export function notifyGalleryUpdated(): void {
  refetchCallbacks.forEach((cb) => {
    try {
      cb();
    } catch (err) {
      console.error("[galleryRefetch] erro ao chamar callback:", err);
    }
  });
}
