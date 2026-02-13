"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  User,
  Building2,
  Calendar,
  Users,
  FileText,
  RefreshCw,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  eventType: string | null;
  eventDate: string | null;
  guests: number | null;
  message: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  corporativo: "Corporativo",
  casamento: "Casamento",
  boda: "Bodas",
  social: "Social",
  outro: "Outro",
};

export default function AdminEventLeadsPage() {
  const [leads, setLeads] = useState<EventLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<EventLead | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/event-leads");
      if (!response.ok) {
        throw new Error("Erro ao carregar leads");
      }
      const data = await response.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar leads de eventos:", error);
      toast.error("Erro ao carregar leads de eventos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      new: "default",
      contacted: "secondary",
      quoted: "outline",
      closed: "destructive",
    };
    const labels: Record<string, string> = {
      new: "Novo",
      contacted: "Contatado",
      quoted: "Orçamento enviado",
      closed: "Encerrado",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const updateStatus = async (leadId: number, status: string) => {
    try {
      setUpdatingStatusId(leadId);
      const response = await fetch(`/api/event-leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Erro ao atualizar");
      }
      const updated = await response.json();
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, ...updated } : l))
      );
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, ...updated } : null));
      }
      toast.success("Status atualizado");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar status"
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const filteredLeads =
    statusFilter === "all"
      ? leads
      : leads.filter((l) => l.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leads de Eventos</h1>
          <p className="text-muted-foreground">
            Solicitações enviadas pelo formulário da página de Eventos (B2B)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="new">Novos</SelectItem>
              <SelectItem value="contacted">Contatados</SelectItem>
              <SelectItem value="quoted">Orçamento enviado</SelectItem>
              <SelectItem value="closed">Encerrados</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadLeads} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Tipo evento</TableHead>
                  <TableHead>Data prevista</TableHead>
                  <TableHead>Convidados</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum lead encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-primary hover:underline"
                        >
                          {lead.email}
                        </a>
                      </TableCell>
                      <TableCell>{lead.phone || "—"}</TableCell>
                      <TableCell>
                        {lead.eventType
                          ? EVENT_TYPE_LABELS[lead.eventType] || lead.eventType
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {lead.eventDate
                          ? format(new Date(lead.eventDate), "dd/MM/yyyy", {
                              locale: ptBR,
                            })
                          : "—"}
                      </TableCell>
                      <TableCell>{lead.guests ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(lead.createdAt), "dd/MM/yyyy HH:mm", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedLead(lead);
                            setDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead de evento</DialogTitle>
            <DialogDescription>
              {selectedLead &&
                format(new Date(selectedLead.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">{selectedLead.name}</span>
                {getStatusBadge(selectedLead.status)}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="text-primary hover:underline"
                >
                  {selectedLead.email}
                </a>
              </div>
              {selectedLead.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    href={`tel:${selectedLead.phone.replace(/\D/g, "")}`}
                    className="text-primary hover:underline"
                  >
                    {selectedLead.phone}
                  </a>
                </div>
              )}
              {selectedLead.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{selectedLead.company}</span>
                </div>
              )}
              {selectedLead.eventType && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>
                    Tipo:{" "}
                    {EVENT_TYPE_LABELS[selectedLead.eventType] ||
                      selectedLead.eventType}
                  </span>
                </div>
              )}
              {selectedLead.eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>
                    Data prevista:{" "}
                    {format(new Date(selectedLead.eventDate), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}
              {selectedLead.guests != null && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{selectedLead.guests} convidados</span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Mensagem</p>
                  <p className="whitespace-pre-wrap text-sm">
                    {selectedLead.message || "—"}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Alterar status
                </p>
                <Select
                  value={selectedLead.status}
                  onValueChange={(value) => updateStatus(selectedLead.id, value)}
                  disabled={updatingStatusId === selectedLead.id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Novo</SelectItem>
                    <SelectItem value="contacted">Contatado</SelectItem>
                    <SelectItem value="quoted">Orçamento enviado</SelectItem>
                    <SelectItem value="closed">Encerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
