"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeroWithImage } from "@/components/HeroWithImage";
import { Briefcase, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { toast } from "sonner";

export default function TrabalheConoscoPage() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "careers");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
    resume: null as File | null,
  });
  const [resumePreview, setResumePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo (PDF, DOC, DOCX)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error(t.form.errors.invalidFile);
      return;
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(t.form.errors.fileTooLarge);
      return;
    }

    setFormData((prev) => ({ ...prev, resume: file }));
    
    // Criar preview do nome do arquivo
    setResumePreview(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("message", formData.message);
      
      if (formData.resume) {
        formDataToSend.append("resume", formData.resume);
      }

      const response = await fetch("/api/careers", {
        method: "POST",
        body: formDataToSend,
      });

      // Verificar se a resposta é JSON antes de fazer parse
      const contentType = response.headers.get("content-type");
      let data: any = null;
      
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Erro ao parsear JSON:", jsonError);
          throw new Error(t.form.errors.submit);
        }
      } else {
        // Se não for JSON, ler como texto para debug
        const text = await response.text();
        console.error("Resposta não é JSON:", text);
        throw new Error(t.form.errors.submit);
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || t.form.errors.submit;
        console.error("Erro da API:", { status: response.status, data });
        throw new Error(errorMessage);
      }

      toast.success(t.form.success);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        message: "",
        resume: null,
      });
      setResumePreview(null);
      
      // Reset file input
      const fileInput = document.getElementById("resume") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error(error instanceof Error ? error.message : t.form.errors.submit);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <HeroWithImage
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={null}
        imageAlt="Trabalhe Conosco - Hotel Sonata"
        icon={<Briefcase className="h-16 w-16" />}
        badge={t.hero.badge}
        height="large"
        overlay="medium"
      />

      {/* Formulário de Recrutamento */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Mensagem de Sucesso */}
            {success && (
              <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg shadow-lg">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                      {t.form.success}
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {t.info.process.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {t.form.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.form.subtitle}
              </p>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">{t.form.cardTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome Completo */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{t.form.fields.name}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t.form.placeholders.name}
                    />
                  </div>

                  {/* Email e Telefone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.form.fields.email}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t.form.placeholders.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.form.fields.phone}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t.form.placeholders.phone}
                      />
                    </div>
                  </div>

                  {/* Cargo de Interesse */}
                  <div className="space-y-2">
                    <Label htmlFor="position">{t.form.fields.position}</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, position: value }))
                      }
                      required
                    >
                      <SelectTrigger id="position">
                        <SelectValue placeholder={t.form.placeholders.position} />
                      </SelectTrigger>
                      <SelectContent>
                        {t.form.positions.map((pos: string, index: number) => (
                          <SelectItem key={index} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mensagem */}
                  <div className="space-y-2">
                    <Label htmlFor="message">{t.form.fields.message}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t.form.placeholders.message}
                      rows={5}
                    />
                  </div>

                  {/* Upload de Currículo */}
                  <div className="space-y-2">
                    <Label htmlFor="resume">{t.form.fields.resume}</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      {resumePreview && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="truncate max-w-[200px]">{resumePreview}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.form.resumeHint}
                    </p>
                  </div>

                  {/* Botão de Envio */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.form.sending}
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        {t.form.button}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {t.form.privacy}
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Informações Adicionais */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.info.process.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t.info.process.description}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.info.benefits.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {t.info.benefits.items.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
