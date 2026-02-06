import { Node } from "@tiptap/core";

export interface ImageGalleryOptions {
  HTMLAttributes: Record<string, unknown>;
  onEdit?: (images: string[]) => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageGallery: {
      setImageGallery: (options: { images: string[]; layout?: "grid" | "carousel" }) => ReturnType;
      updateImageGallery: (options: { images: string[]; layout?: "grid" | "carousel" }) => ReturnType;
    };
  }
}

export const ImageGallery = Node.create<ImageGalleryOptions>({
  name: "imageGallery",

  group: "block",

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      onEdit: undefined,
    };
  },

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: (element) => {
          const galleryData = element.getAttribute("data-gallery");
          if (!galleryData) return [];
          try {
            const parsed = JSON.parse(galleryData);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        },
        renderHTML: (attributes) => {
          const images = attributes.images;
          if (!images || !Array.isArray(images) || images.length === 0) {
            return {};
          }
          return {
            "data-gallery": JSON.stringify(images),
          };
        },
      },
      layout: {
        default: "grid",
        parseHTML: (element) => {
          return element.getAttribute("data-layout") || "grid";
        },
        renderHTML: (attributes) => {
          return {
            "data-layout": attributes.layout || "grid",
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-gallery]',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            console.log("[ImageGallery] parseHTML: node é string, ignorando");
            return false;
          }
          const element = node as HTMLElement;
          const galleryData = element.getAttribute('data-gallery');
          const layout = element.getAttribute('data-layout') || 'grid';
          console.log("[ImageGallery] parseHTML: data-gallery =", galleryData, "layout =", layout);
          
          if (!galleryData) {
            console.warn("[ImageGallery] parseHTML: sem data-gallery");
            return false;
          }
          
          try {
            const images = JSON.parse(galleryData);
            console.log("[ImageGallery] parseHTML: parsed", images.length, "imagens");
            return Array.isArray(images) && images.length > 0 ? { images, layout } : false;
          } catch (error) {
            console.error("[ImageGallery] parseHTML: erro ao parsear JSON:", error, galleryData);
            return false;
          }
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    // Garantir que pegamos os atributos do nó
    const images = node?.attrs?.images || HTMLAttributes.images || [];
    const layout = node?.attrs?.layout || HTMLAttributes.layout || "grid";
    
    if (!Array.isArray(images) || images.length === 0) {
      console.warn("[ImageGallery] renderHTML: Sem imagens!", { node, HTMLAttributes });
      return ["div", { class: "image-gallery-empty" }, ""];
    }

    console.log("[ImageGallery] renderHTML chamado com", images.length, "imagens, layout:", layout);

    // Criar os elementos img para cada imagem
    const imgElements = images.map((src: string) => [
      "img",
      {
        src,
        alt: "",
        loading: "lazy",
        class: "gallery-image",
      },
    ]);

    const className = layout === "carousel" ? "image-gallery-carousel" : "image-gallery";

    return [
      "div",
      {
        class: className,
        "data-gallery": JSON.stringify(images),
        "data-layout": layout,
      },
      ...imgElements,
    ];
  },

  addCommands() {
    return {
      setImageGallery:
        (options: { images: string[]; layout?: "grid" | "carousel" }) =>
        ({ commands }) => {
          if (!options.images || options.images.length === 0) {
            return false;
          }
          return commands.insertContent({
            type: this.name,
            attrs: {
              images: options.images,
              layout: options.layout || "grid",
            },
          });
        },
      updateImageGallery:
        (options: { images: string[]; layout?: "grid" | "carousel" }) =>
        ({ commands, state }) => {
          const { selection } = state;
          const node = state.doc.nodeAt(selection.from);
          
          if (node?.type.name !== this.name) {
            return false;
          }

          return commands.updateAttributes(this.name, {
            images: options.images,
            layout: options.layout || node.attrs.layout || "grid",
          });
        },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const layout = node.attrs.layout || "grid";
      const images = node.attrs.images || [];
      
      // IMPORTANTE: O elemento DOM principal deve ser a própria galeria
      const dom = document.createElement("div");
      const className = layout === "carousel" ? "image-gallery-carousel" : "image-gallery";
      dom.className = className;
      dom.setAttribute("data-gallery", JSON.stringify(images));
      dom.setAttribute("data-layout", layout);
      
      if (layout === "carousel") {
        // Estilo carousel
        dom.style.cssText = `
          position: relative;
          max-width: 100%;
          margin: 1rem 0;
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 0.5rem;
          overflow: hidden;
          transition: border-color 0.2s;
        `;
      } else {
        // Estilo grid
        dom.style.cssText = `
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.5rem;
          margin: 1rem 0;
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 0.5rem;
          padding: 0.5rem;
          transition: border-color 0.2s;
          position: relative;
        `;
      }

      dom.innerHTML = '';
      
      if (layout === "carousel") {
        // Renderizar carousel
        images.forEach((src: string, index: number) => {
          const img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.className = "gallery-image";
          img.setAttribute("loading", "lazy");
          img.style.cssText = `
            display: ${index === 0 ? 'block' : 'none'};
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 0.375rem;
          `;
          dom.appendChild(img);
        });
        
        // Indicadores
        if (images.length > 1) {
          const indicators = document.createElement("div");
          indicators.className = "carousel-indicators";
          indicators.style.cssText = `
            position: absolute;
            bottom: 1rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.5rem;
            z-index: 10;
            pointer-events: none;
          `;
          
          images.forEach((_, index) => {
            const dot = document.createElement("div");
            dot.style.cssText = `
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: ${index === 0 ? 'white' : 'rgba(255,255,255,0.5)'};
              transition: background 0.3s;
            `;
            indicators.appendChild(dot);
          });
          
          dom.appendChild(indicators);
        }
      } else {
        // Renderizar grid
        images.forEach((src: string) => {
          const img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.className = "gallery-image";
          img.setAttribute("loading", "lazy");
          img.style.cssText = `
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 0.375rem;
          `;
          dom.appendChild(img);
        });
      }

      // Badge
      const badge = document.createElement("div");
      badge.className = "gallery-badge";
      badge.setAttribute("data-tiptap-ignore", "true");
      badge.setAttribute("contenteditable", "false");
      badge.textContent = `${images.length} ${images.length === 1 ? 'imagem' : 'imagens'} (${layout === 'carousel' ? 'Carousel' : 'Grid'})`;
      badge.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: hsl(var(--primary));
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 10;
      `;
      dom.appendChild(badge);

      // Efeito hover
      dom.addEventListener("mouseenter", () => {
        dom.style.borderColor = "hsl(var(--primary))";
        badge.style.opacity = "1";
      });
      dom.addEventListener("mouseleave", () => {
        dom.style.borderColor = "transparent";
        badge.style.opacity = "0";
      });

      // Click para editar
      dom.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.options.onEdit) {
          const pos = typeof getPos === 'function' ? getPos() : 0;
          editor.commands.setNodeSelection(pos);
          this.options.onEdit(node.attrs.images);
        }
      });

      return {
        dom,
        contentDOM: null,
        ignoreMutation: () => true,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) {
            return false;
          }
          const newImages = updatedNode.attrs.images || [];
          const newLayout = updatedNode.attrs.layout || "grid";
          
          // Atualizar atributos
          dom.setAttribute("data-gallery", JSON.stringify(newImages));
          dom.setAttribute("data-layout", newLayout);
          
          // Recriar completamente se layout mudou
          if (newLayout !== layout) {
            return false; // Força recriação do NodeView
          }
          
          // Atualizar imagens mantendo layout
          dom.innerHTML = '';
          
          if (newLayout === "carousel") {
            newImages.forEach((src: string, index: number) => {
              const img = document.createElement("img");
              img.src = src;
              img.alt = "";
              img.className = "gallery-image";
              img.setAttribute("loading", "lazy");
              img.style.cssText = `
                display: ${index === 0 ? 'block' : 'none'};
                width: 100%;
                height: 400px;
                object-fit: cover;
                border-radius: 0.375rem;
              `;
              dom.appendChild(img);
            });
          } else {
            newImages.forEach((src: string) => {
              const img = document.createElement("img");
              img.src = src;
              img.alt = "";
              img.className = "gallery-image";
              img.setAttribute("loading", "lazy");
              img.style.cssText = `
                width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 0.375rem;
              `;
              dom.appendChild(img);
            });
          }
          
          // Recriar badge
          const newBadge = document.createElement("div");
          newBadge.className = "gallery-badge";
          newBadge.setAttribute("data-tiptap-ignore", "true");
          newBadge.setAttribute("contenteditable", "false");
          newBadge.textContent = `${newImages.length} ${newImages.length === 1 ? 'imagem' : 'imagens'} (${newLayout === 'carousel' ? 'Carousel' : 'Grid'})`;
          newBadge.style.cssText = badge.style.cssText;
          dom.appendChild(newBadge);
          
          return true;
        },
        stopEvent: () => true,
      };
    };
  },
});
