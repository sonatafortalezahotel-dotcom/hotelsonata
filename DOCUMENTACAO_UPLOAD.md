# 📤 Documentação - Sistema de Upload de Arquivos
## Hotel Sonata de Iracema

---

## 🔧 CONFIGURAÇÃO

### Variável de Ambiente

Adicione o token do Vercel Blob no arquivo `.env.local`:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_onRovwlwOVzsytDF_DlWaNhQlr0UAcT1etFBgvhyVK6mxLt
```

### Instalação

O pacote `@vercel/blob` já está instalado no projeto.

---

## 📡 APIs DE UPLOAD

### 1. **Upload de Arquivo Único**

**Endpoint:** `POST /api/upload`

**Body (FormData):**
- `file` (File) - Arquivo a ser enviado (obrigatório)
- `folder` (string, opcional) - Pasta onde salvar (padrão: "hotel-sonata")
- `access` (string, opcional) - "public" ou "private" (padrão: "public")
- `baseFilename` (string, opcional) - Nome base do arquivo

**Resposta de Sucesso:**
```json
{
  "url": "https://xxx.public.blob.vercel-storage.com/...",
  "filename": "1234567890-abc123.jpg",
  "size": 1024000,
  "type": "image/jpeg"
}
```

**Exemplo de Uso (JavaScript):**
```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("folder", "quartos");
formData.append("access", "public");

const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log(data.url); // URL do arquivo enviado
```

**Exemplo de Uso (React):**
```typescript
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "gallery");
  
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Erro ao fazer upload");
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
};
```

---

### 2. **Upload de Múltiplos Arquivos**

**Endpoint:** `POST /api/upload/multiple`

**Body (FormData):**
- `files` (File[]) - Array de arquivos (obrigatório)
- `folder` (string, opcional) - Pasta onde salvar
- `access` (string, opcional) - "public" ou "private"
- `baseFilename` (string, opcional) - Nome base para os arquivos

**Resposta de Sucesso:**
```json
{
  "urls": [
    "https://xxx.public.blob.vercel-storage.com/file-1.jpg",
    "https://xxx.public.blob.vercel-storage.com/file-2.jpg"
  ],
  "count": 2
}
```

**Exemplo de Uso:**
```javascript
const formData = new FormData();
files.forEach(file => {
  formData.append("files", file);
});
formData.append("folder", "gallery");
formData.append("baseFilename", "quarto-luxo");

const response = await fetch("/api/upload/multiple", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log(data.urls); // Array de URLs
```

---

### 3. **Deletar Arquivo**

**Endpoint:** `DELETE /api/upload/delete?url=...`

**Query Parameters:**
- `url` (string) - URL do arquivo a ser deletado

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Arquivo deletado com sucesso"
}
```

**Exemplo de Uso:**
```javascript
const url = "https://xxx.public.blob.vercel-storage.com/file.jpg";

const response = await fetch(`/api/upload/delete?url=${encodeURIComponent(url)}`, {
  method: "DELETE",
});

const data = await response.json();
console.log(data.success); // true
```

---

## 🛠️ UTILITÁRIOS

### Funções Disponíveis em `lib/upload.ts`

#### `uploadFile(file, filename, options)`
Faz upload de um único arquivo.

```typescript
import { uploadFile } from "@/lib/upload";

const url = await uploadFile(file, "minha-imagem.jpg", {
  folder: "quartos",
  access: "public",
});
```

#### `uploadMultipleFiles(files, baseFilename, options)`
Faz upload de múltiplos arquivos.

```typescript
import { uploadMultipleFiles } from "@/lib/upload";

const urls = await uploadMultipleFiles(
  [file1, file2, file3],
  "galeria",
  { folder: "gallery" }
);
```

#### `deleteFile(url)`
Deleta um arquivo do storage.

```typescript
import { deleteFile } from "@/lib/upload";

await deleteFile("https://xxx.public.blob.vercel-storage.com/file.jpg");
```

#### `generateUniqueFilename(originalName)`
Gera um nome de arquivo único baseado em timestamp.

```typescript
import { generateUniqueFilename } from "@/lib/upload";

const uniqueName = generateUniqueFilename("foto.jpg");
// Retorna: "1234567890-abc123.jpg"
```

#### `isImageFile(file)`
Valida se o arquivo é uma imagem.

```typescript
import { isImageFile } from "@/lib/upload";

if (isImageFile(file)) {
  // É uma imagem
}
```

#### `isVideoFile(file)`
Valida se o arquivo é um vídeo.

```typescript
import { isVideoFile } from "@/lib/upload";

if (isVideoFile(file)) {
  // É um vídeo
}
```

#### `validateFileSize(file, maxSizeBytes)`
Valida o tamanho do arquivo.

```typescript
import { validateFileSize } from "@/lib/upload";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
if (validateFileSize(file, MAX_SIZE)) {
  // Tamanho válido
}
```

---

## 📋 VALIDAÇÕES

### Tipos de Arquivo Permitidos
- ✅ Imagens: `image/*` (jpg, png, gif, webp, etc)
- ✅ Vídeos: `video/*` (mp4, webm, mov, etc)

### Tamanhos Máximos
- **Imagens:** 10MB
- **Vídeos:** 100MB

### Pastas Recomendadas
- `quartos` - Imagens de quartos
- `gallery` - Galeria geral
- `packages` - Imagens de pacotes
- `gastronomy` - Imagens de gastronomia
- `leisure` - Imagens de lazer
- `events` - Imagens de eventos
- `sustainability` - Imagens de sustentabilidade
- `certifications` - Imagens de certificações
- `highlights` - Destaques e vídeos de drone

---

## 🔒 SEGURANÇA

1. **Validação de Tipo:** Apenas imagens e vídeos são aceitos
2. **Validação de Tamanho:** Limites máximos configurados
3. **Nomes Únicos:** Arquivos recebem nomes únicos para evitar conflitos
4. **Token Seguro:** Token armazenado em variável de ambiente

---

## 📝 EXEMPLOS DE USO NO PAINEL ADMIN

### Upload de Imagem de Quarto

```typescript
// Componente React para upload
const UploadRoomImage = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "quartos");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Enviando...</p>}
      {imageUrl && <img src={imageUrl} alt="Preview" />}
    </div>
  );
};
```

### Upload de Galeria (Múltiplas Imagens)

```typescript
const UploadGallery = () => {
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });
      formData.append("folder", "gallery");
      formData.append("baseFilename", "galeria");

      const response = await fetch("/api/upload/multiple", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setUrls(data.urls);
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
        disabled={uploading}
      />
      {uploading && <p>Enviando {files.length} arquivos...</p>}
      <div className="grid grid-cols-3 gap-4">
        {urls.map((url, index) => (
          <img key={index} src={url} alt={`Imagem ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};
```

---

## 🚨 TRATAMENTO DE ERROS

### Erros Comuns

1. **"Nenhum arquivo foi enviado"**
   - Verifique se o campo `file` está presente no FormData

2. **"Tipo de arquivo não suportado"**
   - Apenas imagens e vídeos são permitidos

3. **"Arquivo muito grande"**
   - Imagens: máximo 10MB
   - Vídeos: máximo 100MB

4. **"Erro ao fazer upload do arquivo"**
   - Verifique se o token `BLOB_READ_WRITE_TOKEN` está configurado
   - Verifique a conexão com a internet

---

## 📊 INTEGRAÇÃO COM BANCO DE DADOS

Após fazer upload, salve a URL no banco de dados:

```typescript
// Exemplo: Salvar URL de imagem de quarto
const imageUrl = await handleUpload(file);

await db.insert(rooms).values({
  code: "suite-luxo",
  imageUrl: imageUrl, // URL do Vercel Blob
  // ... outros campos
});
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] Pacote `@vercel/blob` instalado
- [x] Token configurado em `.env.local`
- [x] API de upload único criada
- [x] API de upload múltiplo criada
- [x] API de delete criada
- [x] Utilitários de upload criados
- [x] Validações implementadas
- [x] Documentação completa

---

**Documentação criada em:** 2025
**Status:** ✅ Sistema de upload completo e funcional

