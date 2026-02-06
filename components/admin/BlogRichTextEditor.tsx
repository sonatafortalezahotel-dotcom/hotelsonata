"use client";

import type { Editor } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImagePlus,
  Loader2,
  Images,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { optimizeImageForUpload } from "@/lib/imageOptimizer";
import { YouTube } from "@/lib/tiptap/YouTubeExtension";
import { ImageGallery } from "@/lib/tiptap/ImageGalleryExtension";
import { YouTubeDialog } from "./YouTubeDialog";
import { GalleryDialog } from "./GalleryDialog";

const UPLOAD_FOLDER = "blog";

// Extensão Image com atributo data-size (sem NodeView - usa renderHTML padrão)
const ImageWithSize = Image.extend({
  addAttributes() {
    const parentAttrs = this.parent?.() ?? {};
    return {
      ...parentAttrs,
      "data-size": {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-size"),
        renderHTML: (attrs: Record<string, unknown>) =>
          attrs["data-size"] ? { "data-size": attrs["data-size"] } : {},
      },
    };
  },
});

interface BlogRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function BlogRichTextEditor({
  value,
  onChange,
  placeholder = "Escreva o conteúdo do post…",
  minHeight = "280px",
}: BlogRichTextEditorProps) {
  const initialContentSet = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const [, forceUpdate] = useState({});
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [editingGalleryImages, setEditingGalleryImages] = useState<string[]>([]);
  const [galleryMode, setGalleryMode] = useState<"create" | "edit">("create");

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const uploadAndInsertImageRef = useRef<
    (file: File, onSuccess: (url: string) => void) => Promise<void>
  >(async () => {});

  const handleGalleryEdit = useRef((images: string[]) => {
    setEditingGalleryImages(images);
    setGalleryMode("edit");
    setGalleryDialogOpen(true);
  });

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: { class: "text-primary underline" },
        },
      }),
      ImageWithSize.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto block",
          referrerPolicy: "no-referrer",
          decoding: "async",
        },
      }),
      YouTube.configure({
        inline: false,
        allowFullscreen: true,
        HTMLAttributes: {
          class: "youtube-video-wrapper",
        },
      }),
      ImageGallery.configure({
        HTMLAttributes: {
          class: "image-gallery-wrapper",
        },
        onEdit: (images: string[]) => {
          handleGalleryEdit.current(images);
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    [placeholder]
  );

  const editor = useEditor(
    {
      extensions,
      content: value || "",
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] px-3 py-2",
        },
        handleDOMEvents: {
          paste(_view, event) {
            const items = event.clipboardData?.items;
            if (!items) return;
            const file = Array.from(items).find((item) => item.type.startsWith("image/"));
            if (file) {
              event.preventDefault();
              const blob = file.getAsFile();
              if (blob) {
                uploadAndInsertImageRef.current(blob, () => {});
              }
              return true;
            }
          },
        },
      },
      onUpdate: ({ editor: ed }) => {
        const html = ed.getHTML();
        console.log("[BlogEditor] HTML gerado:", html);
        onChangeRef.current(html);
      },
    },
    []
  );

  // Manter ref atualizada para uso em handlers assíncronos (ex.: paste)
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Re-render quando a seleção mudar (para mostrar controles de tamanho da imagem)
  useEffect(() => {
    if (!editor) return;
    const fn = () => forceUpdate({});
    editor.on("selectionUpdate", fn);
    return () => {
      editor.off("selectionUpdate", fn);
    };
  }, [editor]);

  const isImageSelected = editor?.isActive("image") ?? false;
  const imageSize = editor?.getAttributes("image")["data-size"] ?? "full";

  // Sincronizar conteúdo inicial apenas ao carregar post existente (editor vazio)
  useEffect(() => {
    if (!editor || initialContentSet.current) return;
    const editorHtml = editor.getHTML();
    const editorEmpty = !editorHtml || editorHtml === "<p></p>" || editorHtml === "<p><br></p>";
    if (value && editorEmpty && value !== editorHtml) {
      console.log("[BlogEditor] Carregando conteúdo:", value);
      editor.commands.setContent(value, { emitUpdate: false });
      initialContentSet.current = true;
      // Verificar se o conteúdo foi carregado corretamente
      setTimeout(() => {
        console.log("[BlogEditor] Conteúdo após carregar:", editor.getHTML());
      }, 100);
    }
  }, [editor, value]);

  const insertImageFromUrl = (url: string) => {
    const ed = editorRef.current;
    if (!ed) return false;
    if (!url || typeof url !== "string") {
      console.error("[BlogEditor] URL inválida", url);
      toast.error("URL da imagem inválida");
      return false;
    }
    const valid = url.startsWith("http") || url.startsWith("data:image");
    if (!valid) {
      toast.error("URL da imagem inválida");
      return false;
    }
    if (url.startsWith("http")) {
      const tester = new window.Image();
      tester.onload = () => {
        console.log("[BlogEditor] Preflight OK:", url);
      };
      tester.onerror = () => {
        console.error("[BlogEditor] Preflight FALHOU:", url);
      };
      tester.src = url;
    }
    const success = ed.chain().focus().setImage({ src: url }).run();
    if (success) {
      const html = ed.getHTML();
      const imgMatch = html.match(/<img[^>]+>/i)?.[0];
      console.log("[BlogEditor] IMG HTML:", imgMatch);
      onChangeRef.current(html);
      return true;
    }
    const escaped = url.replace(/"/g, "&quot;");
    const html = `<img src="${escaped}" alt="" class="rounded-lg max-w-full h-auto block" />`;
    const ok = ed.chain().focus().insertContent(html).run();
    if (ok) onChangeRef.current(ed.getHTML());
    return ok;
  };

  const uploadAndInsertImage = async (
    file: File,
    _onSuccess: (url: string) => void
  ) => {
    toast.info("Enviando imagem...");
    const optimized = await optimizeImageForUpload(file);
    const formData = new FormData();
    formData.append("file", optimized);
    formData.append("folder", UPLOAD_FOLDER);
    formData.append("access", "public");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error || "Erro no upload";
        if (msg.includes("BLOB") || msg.includes("token")) {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            if (dataUrl?.startsWith("data:image")) {
              const ok = insertImageFromUrl(dataUrl);
              if (ok) toast.success("Imagem inserida (salva no conteúdo - configure BLOB_READ_WRITE_TOKEN para upload)");
            } else {
              toast.error(msg);
            }
          };
          reader.readAsDataURL(file);
          return;
        }
        throw new Error(msg);
      }
      const data = await res.json();
      const url = data?.url;
      if (!url) {
        throw new Error("API não retornou URL da imagem");
      }
      const inserted = insertImageFromUrl(url);
      if (inserted) {
        toast.success("Imagem inserida");
      } else {
        toast.error("Não foi possível inserir a imagem no texto");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao enviar imagem");
    }
  };

  uploadAndInsertImageRef.current = uploadAndInsertImage;

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida");
      return;
    }
    await uploadAndInsertImage(file, () => {});
  }

  function setImageSize(size: "small" | "medium" | "large" | "full") {
    editor?.chain().focus().updateAttributes("image", { "data-size": size }).run();
  }

  function setLink() {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL do link:", previousUrl || "https://");
    if (url == null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function handleYouTubeInsert(url: string) {
    editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    toast.success("Vídeo do YouTube inserido");
  }

  function handleGalleryInsert(images: string[]) {
    if (galleryMode === "edit") {
      // Atualizar galeria existente
      editor?.chain().focus().updateImageGallery({ images }).run();
      toast.success("Galeria atualizada");
    } else {
      // Criar nova galeria
      editor?.chain().focus().setImageGallery({ images }).run();
      toast.success("Galeria inserida");
    }
    // Reset para modo de criação
    setGalleryMode("create");
    setEditingGalleryImages([]);
  }

  function handleGalleryDialogClose(open: boolean) {
    setGalleryDialogOpen(open);
    if (!open) {
      // Reset quando fechar
      setGalleryMode("create");
      setEditingGalleryImages([]);
    }
  }

  function handleGalleryButtonClick() {
    setGalleryMode("create");
    setEditingGalleryImages([]);
    setGalleryDialogOpen(true);
  }

  if (!editor) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-input bg-muted/30 text-muted-foreground"
        style={{ minHeight }}
      >
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border border-input bg-background overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/30 p-1">
        <ToolbarButton
          onMouseDown={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Riscado"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Código"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton
          onMouseDown={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton
          onMouseDown={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista com marcadores"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Citação"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton
          onMouseDown={setLink}
          active={editor.isActive("link")}
          title="Inserir link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onMouseDown={handleImageClick} title="Inserir imagem">
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={handleGalleryButtonClick}
          title="Inserir galeria de imagens"
        >
          <Images className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onMouseDown={() => setYoutubeDialogOpen(true)}
          title="Inserir vídeo do YouTube"
        >
          <Video className="h-4 w-4" />
        </ToolbarButton>
        {isImageSelected && (
          <span className="ml-1 flex items-center gap-0.5 border-l border-border pl-1">
            <span className="text-[10px] text-muted-foreground mr-0.5">Tamanho:</span>
            {(["small", "medium", "large", "full"] as const).map((size) => (
              <Button
                key={size}
                type="button"
                variant="ghost"
                size="sm"
                className={`h-7 px-1.5 text-xs ${imageSize === size ? "bg-muted" : ""}`}
                title={
                  size === "small"
                    ? "Pequena (320px)"
                    : size === "medium"
                    ? "Média (560px)"
                    : size === "large"
                    ? "Grande (800px)"
                    : "Largura total"
                }
                onMouseDown={(e) => {
                  e.preventDefault();
                  setImageSize(size);
                }}
              >
                {size === "small" ? "S" : size === "medium" ? "M" : size === "large" ? "L" : "100%"}
              </Button>
            ))}
          </span>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFile}
        />
      </div>
      <EditorContent editor={editor} style={{ minHeight }} />

      {/* Dialogs */}
      <YouTubeDialog
        open={youtubeDialogOpen}
        onOpenChange={setYoutubeDialogOpen}
        onInsert={handleYouTubeInsert}
      />
      <GalleryDialog
        open={galleryDialogOpen}
        onOpenChange={handleGalleryDialogClose}
        onInsert={handleGalleryInsert}
        initialImages={editingGalleryImages}
        mode={galleryMode}
      />

      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          height: 0;
        }
        .ProseMirror img {
          display: block;
          max-width: 100%;
          width: auto;
          height: auto;
          min-height: 48px;
          border-radius: 0.5rem;
          object-fit: contain;
        }
        .ProseMirror img[data-size="small"] {
          max-width: 320px;
          width: 100%;
          height: auto;
        }
        .ProseMirror img[data-size="medium"] {
          max-width: 560px;
          width: 100%;
          height: auto;
        }
        .ProseMirror img[data-size="large"] {
          max-width: 800px;
          width: 100%;
          height: auto;
        }
        .ProseMirror img[data-size="full"],
        .ProseMirror img:not([data-size]) {
          max-width: 100%;
          width: 100%;
          height: auto;
        }
        .ProseMirror strong {
          font-weight: 700;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror s {
          text-decoration: line-through;
        }
        .ProseMirror code {
          background: hsl(var(--muted));
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.9em;
        }
        .ProseMirror .youtube-video {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          background: hsl(var(--muted));
        }
        .ProseMirror .youtube-video iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .ProseMirror .image-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.5rem;
          margin: 1.5rem 0;
          padding: 0.5rem;
          border-radius: 0.5rem;
        }
        .ProseMirror .image-gallery img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({
  children,
  onMouseDown,
  active,
  title,
}: {
  children: React.ReactNode;
  onMouseDown: (e: React.MouseEvent) => void;
  active?: boolean;
  title: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`h-8 w-8 ${active ? "bg-muted" : ""}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(e);
      }}
      title={title}
    >
      {children}
    </Button>
  );
}
