import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function BlogNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="max-w-lg mx-auto text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <FileQuestion className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Post não encontrado
        </h1>
        <p className="text-muted-foreground">
          O post que você procura não existe, foi removido ou ainda não foi
          publicado. Confira a lista de posts em notícias.
        </p>
        <Button asChild>
          <Link href="/noticias">Ver todos os posts</Link>
        </Button>
      </div>
    </div>
  );
}
