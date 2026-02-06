import { Node, mergeAttributes } from "@tiptap/core";

export interface YouTubeOptions {
  inline: boolean;
  allowFullscreen: boolean;
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtube: {
      setYoutubeVideo: (options: { src: string }) => ReturnType;
    };
  }
}

export const YouTube = Node.create<YouTubeOptions>({
  name: "youtube",

  group: "block",

  atom: true,

  addOptions() {
    return {
      inline: false,
      allowFullscreen: true,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => {
          const videoId = element.getAttribute("data-youtube-id");
          return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.src) {
            return {};
          }
          const videoId = extractYouTubeID(attributes.src as string);
          return {
            "data-youtube-id": videoId,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-youtube-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const videoId = HTMLAttributes["data-youtube-id"];
    if (!videoId) {
      return ["div", {}, ""];
    }

    return [
      "div",
      mergeAttributes(
        {
          class: "youtube-video",
          "data-youtube-id": videoId,
        },
        this.options.HTMLAttributes
      ),
      [
        "iframe",
        {
          src: `https://www.youtube.com/embed/${videoId}`,
          frameborder: "0",
          allowfullscreen: this.options.allowFullscreen ? "true" : "false",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setYoutubeVideo:
        (options: { src: string }) =>
        ({ commands }) => {
          const videoId = extractYouTubeID(options.src);
          if (!videoId) {
            return false;
          }
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: `https://www.youtube.com/embed/${videoId}`,
            },
          });
        },
    };
  },
});

/**
 * Extrai o ID do vídeo do YouTube de várias URLs possíveis
 */
export function extractYouTubeID(url: string): string | null {
  if (!url) return null;

  // Se já for apenas o ID (11 caracteres alfanuméricos)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  // https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) {
    return watchMatch[1];
  }

  // https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    return shortMatch[1];
  }

  // https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) {
    return embedMatch[1];
  }

  // https://www.youtube.com/v/VIDEO_ID
  const vMatch = url.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/);
  if (vMatch) {
    return vMatch[1];
  }

  return null;
}

/**
 * Valida se uma URL é do YouTube
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeID(url) !== null;
}
