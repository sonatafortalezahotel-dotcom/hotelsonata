import { Node } from "@tiptap/core";

export interface ImageGalleryOptions {
  HTMLAttributes: Record<string, unknown>;
  onEdit?: (images: string[]) => void;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageGallery: {
      setImageGallery: (options: { images: string[] }) => ReturnType;
      updateImageGallery: (options: { images: string[] }) => ReturnType;
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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-gallery]',
        getAttrs: (node) => {
          if (typeof node === 'string') return false;
          const element = node as HTMLElement;
          const galleryData = element.getAttribute('data-gallery');
          if (!galleryData) return false;
          
          try {
            const images = JSON.parse(galleryData);
            return Array.isArray(images) && images.length > 0 ? { images } : false;
          } catch {
            return false;
          }
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const images = HTMLAttributes.images || [];
    if (!Array.isArray(images) || images.length === 0) {
      return ["div", {}, ""];
    }

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

    return [
      "div",
      {
        class: "image-gallery",
        "data-gallery": JSON.stringify(images),
      },
      ...imgElements,
    ];
  },

  addCommands() {
    return {
      setImageGallery:
        (options: { images: string[] }) =>
        ({ commands }) => {
          if (!options.images || options.images.length === 0) {
            return false;
          }
          return commands.insertContent({
            type: this.name,
            attrs: {
              images: options.images,
            },
          });
        },
      updateImageGallery:
        (options: { images: string[] }) =>
        ({ commands, state }) => {
          const { selection } = state;
          const node = state.doc.nodeAt(selection.from);
          
          if (node?.type.name !== this.name) {
            return false;
          }

          return commands.updateAttributes(this.name, {
            images: options.images,
          });
        },
    };
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      // IMPORTANTE: O elemento DOM principal deve ser a própria galeria
      // para que getHTML() serialize corretamente
      const dom = document.createElement("div");
      dom.className = "image-gallery";
      dom.setAttribute("data-gallery", JSON.stringify(node.attrs.images));
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

      const images = node.attrs.images || [];
      
      // Adicionar elementos img
      images.forEach((src: string) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.className = "gallery-image";
        img.style.cssText = `
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 0.375rem;
        `;
        img.loading = "lazy";
        dom.appendChild(img);
      });

      // Badge com número de imagens (absoluto dentro da própria div)
      const badge = document.createElement("div");
      badge.className = "gallery-badge";
      badge.textContent = `${images.length} ${images.length === 1 ? 'imagem' : 'imagens'}`;
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
          // Atualizar data-gallery quando o nó mudar
          dom.setAttribute("data-gallery", JSON.stringify(updatedNode.attrs.images));
          return true;
        },
      };
    };
  },
});
