import { Metadata } from "next";
import { 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Check,
  AlertCircle,
  Info,
  ChevronRight,
  Bed,
  Utensils,
  Wifi,
  Coffee,
  Heart
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "UI Showcase - Hotel Sonata de Iracema",
  description: "Biblioteca de componentes UI do sistema",
};

export default function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            UI Component Showcase
          </h1>
          <p className="text-lg text-muted-foreground">
            Biblioteca completa de componentes do Hotel Sonata de Iracema
          </p>
        </div>

        {/* Breadcrumb */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Breadcrumbs</h2>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/quartos">Quartos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Suite Luxo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>

        <Separator className="my-12" />

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Botões</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Variantes</h3>
              <div className="space-y-2">
                <Button className="w-full">Primary Button</Button>
                <Button variant="secondary" className="w-full">Secondary Button</Button>
                <Button variant="outline" className="w-full">Outline Button</Button>
                <Button variant="ghost" className="w-full">Ghost Button</Button>
                <Button variant="destructive" className="w-full">Destructive Button</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Tamanhos</h3>
              <div className="space-y-2">
                <Button size="sm" className="w-full">Small</Button>
                <Button size="default" className="w-full">Default</Button>
                <Button size="lg" className="w-full">Large</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Com Ícones</h3>
              <div className="space-y-2">
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Reservar Agora
                </Button>
                <Button variant="secondary" className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Favoritar
                </Button>
                <Button variant="outline" className="w-full">
                  Ver Detalhes
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card de Quarto */}
            <Card>
              <AspectRatio ratio={16 / 9}>
                <div className="bg-muted w-full h-full flex items-center justify-center">
                  <Bed className="h-12 w-12 text-muted-foreground" />
                </div>
              </AspectRatio>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Suite Luxo</CardTitle>
                    <CardDescription>Vista para o mar</CardDescription>
                  </div>
                  <Badge>Disponível</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Wifi className="h-4 w-4" />
                    <span>Wi-Fi gratuito</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Coffee className="h-4 w-4" />
                    <span>Café da manhã</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-primary">R$ 450</span>
                  <span className="text-sm text-muted-foreground">/noite</span>
                </div>
                <Button>Reservar</Button>
              </CardFooter>
            </Card>

            {/* Card de Avaliação */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base">João da Silva</CardTitle>
                    <CardDescription>Hospedado em Dez 2024</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Experiência incrível! Hotel muito bem localizado, quartos confortáveis 
                  e equipe extremamente atenciosa.
                </p>
              </CardContent>
            </Card>

            {/* Card de Pacote */}
            <Card className="border-primary">
              <CardHeader>
                <Badge className="w-fit mb-2">Mais Popular</Badge>
                <CardTitle>Pacote Romântico</CardTitle>
                <CardDescription>Perfeito para casais</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {["2 diárias", "Café na cama", "Jantar romântico", "Spa para 2"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg">
                  Ver Pacote Completo
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Form Elements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Formulários</h2>
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Formulário de Contato</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e entraremos em contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input básico */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Digite seu nome" />
              </div>

              {/* Input com ícone */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="seu@email.com" className="pl-10" />
                </div>
              </div>

              {/* Select */}
              <div className="space-y-2">
                <Label>Tipo de Acomodação</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="luxo">Luxo</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea 
                  id="message" 
                  placeholder="Conte-nos sobre suas necessidades..."
                  rows={4}
                />
              </div>

              {/* Radio Group */}
              <div className="space-y-3">
                <Label>Período de Interesse</Label>
                <RadioGroup defaultValue="semana">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fds" id="fds" />
                    <Label htmlFor="fds" className="font-normal cursor-pointer">
                      Final de Semana
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="semana" id="semana" />
                    <Label htmlFor="semana" className="font-normal cursor-pointer">
                      Durante a Semana
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexivel" id="flexivel" />
                    <Label htmlFor="flexivel" className="font-normal cursor-pointer">
                      Flexível
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <Label>Serviços Adicionais</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="transfer" />
                    <Label htmlFor="transfer" className="font-normal cursor-pointer">
                      Transfer do aeroporto
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="breakfast" />
                    <Label htmlFor="breakfast" className="font-normal cursor-pointer">
                      Café da manhã
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="spa" />
                    <Label htmlFor="spa" className="font-normal cursor-pointer">
                      Acesso ao Spa
                    </Label>
                  </div>
                </div>
              </div>

              {/* Switch */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Receber notificações por e-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Ofertas especiais e novidades do hotel
                  </p>
                </div>
                <Switch />
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Orçamento máximo (por noite)</Label>
                  <span className="text-sm font-medium">R$ 500</span>
                </div>
                <Slider defaultValue={[500]} max={1000} step={50} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Enviar Solicitação
              </Button>
            </CardFooter>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Badges */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge>Destaque</Badge>
            <Badge variant="secondary">Promoção</Badge>
            <Badge variant="outline">Vista Mar</Badge>
            <Badge variant="destructive">Esgotado</Badge>
            <Badge className="bg-green-600">Disponível</Badge>
            <Badge className="bg-yellow-600">Últimas Vagas</Badge>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Alerts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Alertas</h2>
          <div className="space-y-4 max-w-2xl">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Informação</AlertTitle>
              <AlertDescription>
                Check-in a partir das 14h. Check-out até às 12h.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Apenas 2 quartos disponíveis para as datas selecionadas.
              </AlertDescription>
            </Alert>

            <Alert className="border-green-600 text-green-600">
              <Check className="h-4 w-4" />
              <AlertTitle>Reserva Confirmada!</AlertTitle>
              <AlertDescription>
                Sua reserva foi confirmada com sucesso. Você receberá um e-mail com os detalhes.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Tabs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Tabs</h2>
          <Tabs defaultValue="descricao" className="max-w-2xl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="descricao">Descrição</TabsTrigger>
              <TabsTrigger value="comodidades">Comodidades</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            </TabsList>
            <TabsContent value="descricao" className="space-y-4">
              <h3 className="font-semibold">Sobre o Quarto</h3>
              <p className="text-sm text-muted-foreground">
                Nossa Suite Luxo oferece uma experiência única com vista privilegiada para o mar. 
                Com 45m², o quarto conta com cama king-size, varanda privativa, banheiro com banheira
                e todos os confortos que você merece.
              </p>
            </TabsContent>
            <TabsContent value="comodidades" className="space-y-4">
              <h3 className="font-semibold">Comodidades Incluídas</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Wi-Fi", "TV Smart", "Ar Condicionado", "Frigobar", "Cofre", "Secador"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="avaliacoes" className="space-y-4">
              <h3 className="font-semibold">O que os hóspedes dizem</h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium">4.9 de 5.0</span>
                <span className="text-sm text-muted-foreground">(127 avaliações)</span>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <Separator className="my-12" />

        {/* Accordion */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Accordion (FAQ)</h2>
          <Accordion type="single" collapsible className="max-w-2xl">
            <AccordionItem value="item-1">
              <AccordionTrigger>Qual o horário de check-in e check-out?</AccordionTrigger>
              <AccordionContent>
                O check-in pode ser realizado a partir das 14h e o check-out deve ser feito até às 12h.
                Para check-in antecipado ou check-out tardio, entre em contato com a recepção.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>O hotel aceita pets?</AccordionTrigger>
              <AccordionContent>
                Sim! Aceitamos pets de pequeno e médio porte. Taxa adicional de R$ 80 por pet/dia.
                Consulte nossa política completa de pets.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Qual é a política de cancelamento?</AccordionTrigger>
              <AccordionContent>
                Cancelamento gratuito até 24 horas antes do check-in. Após esse período, 
                será cobrada a primeira diária. Para pacotes especiais, consulte as condições específicas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>O café da manhã está incluído?</AccordionTrigger>
              <AccordionContent>
                O café da manhã está incluído em todas as reservas. Servido das 6h30 às 10h30 
                no restaurante principal, com opções de buffet completo.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator className="my-12" />

        {/* Progress & Skeleton */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Progress & Loading</h2>
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processo de Reserva</span>
                <span className="font-medium">75%</span>
              </div>
              <Progress value={75} />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Loading States (Skeleton)</h3>
              <Card>
                <CardHeader>
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-4/5" />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Dialog */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Dialogs (Modais)</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">Abrir Exemplo de Modal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Reserva</DialogTitle>
                <DialogDescription>
                  Você está prestes a confirmar sua reserva no Hotel Sonata de Iracema.
                  Por favor, revise os detalhes abaixo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Check-in:</span>
                  <span className="text-sm font-medium">15/01/2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Check-out:</span>
                  <span className="text-sm font-medium">18/01/2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="text-lg font-bold text-primary">R$ 1.350,00</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Confirmar Reserva</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <Separator className="my-12" />

        {/* Tooltip */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Tooltips</h2>
          <TooltipProvider>
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Wifi className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Wi-Fi gratuito disponível</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Utensils className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Café da manhã incluído</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Localização privilegiada</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </section>

        {/* Footer da página */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>UI Component Showcase - Hotel Sonata de Iracema</p>
          <p className="mt-1">Todos os componentes usando shadcn/ui + Tailwind CSS v3</p>
        </div>
      </div>
    </div>
  );
}

