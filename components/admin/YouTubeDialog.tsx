"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractYouTubeID, isValidYouTubeUrl } from "@/lib/tiptap/YouTubeExtension";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface YouTubeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (url: string) => void;
}

export function YouTubeDialog({
  open,
  onOpenChange,
  onInsert,
}: YouTubeDialogProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const videoId = extractYouTubeID(url);
  const isValid = isValidYouTubeUrl(url);

  const handleInsert = () => {
    if (!url.trim()) {
      setError("Por favor, insira uma URL do YouTube");
      return;
    }

    if (!isValid) {
      setError("URL do YouTube inválida. Use um link como: https://www.youtube.com/watch?v=...");
      return;
    }

    onInsert(url);
    setUrl("");
    setError("");
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setUrl("");
      setError("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inserir Vídeo do YouTube</DialogTitle>
          <DialogDescription>
            Cole a URL de um vídeo do YouTube para incorporá-lo no conteúdo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-url">URL do YouTube</Label>
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInsert();
                }
              }}
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            {url && isValid && !error && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>URL válida</span>
              </div>
            )}
          </div>

          {videoId && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="relative w-full overflow-hidden rounded-lg bg-muted" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video preview"
                />
              </div>
            </div>
          )}

          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium">Formatos aceitos:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
              <li>https://youtu.be/VIDEO_ID</li>
              <li>https://www.youtube.com/embed/VIDEO_ID</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleInsert}
            disabled={!url.trim() || !isValid}
          >
            Inserir Vídeo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
