import { Node, mergeAttributes } from "@tiptap/core";

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
            return JSON.parse(galleryData);
          } catch {
            return [];
          }
        },
        renderHTML: (attributes) => {
          if (!attributes.images || !Array.isArray(attributes.images)) {
            return {};
          }
          return {
            "data-gallery": JSON.stringify(attributes.images),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.image-gallery[data-gallery]',
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
        class: "gallery-image",
        loading: "lazy",
      },
    ]);

    return [
      "div",
      mergeAttributes(
        {
          class: "image-gallery",
          "data-gallery": JSON.stringify(images),
        },
        this.options.HTMLAttributes
      ),
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
    return ({ node, editor }) => {
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

      // Badge com número de imagens
      const badge = document.createElement("div");
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
          // Selecionar o nó da galeria
          const pos = editor.view.posAtDOM(dom, 0);
          editor.commands.setNodeSelection(pos);
          
          // Chamar callback de edição
          this.options.onEdit(node.attrs.images);
        }
      });

      return {
        dom,
        contentDOM: null,
        ignoreMutation: () => true,
      };
    };
  },
});
