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
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  FileText, 
  CreditCard,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Reservation {
  id: number;
  confirmationNumber: string;
  roomId: number;
  roomCode: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestDocument?: string;
  basePrice: number;
  totalNights: number;
  totalPrice: number;
  promoCode?: string;
  discount: number;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadReservations();
  }, [statusFilter]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reservations?list=true");
      if (!response.ok) {
        throw new Error("Erro ao carregar reservas");
      }
      const data = await response.json();
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
      toast.error("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      // TODO: Implementar API para atualizar status
      toast.success("Status atualizado com sucesso");
      loadReservations();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      confirmed: "default",
      pending: "secondary",
      cancelled: "destructive",
      completed: "outline",
    };

    const labels: Record<string, string> = {
      confirmed: "Confirmada",
      pending: "Pendente",
      cancelled: "Cancelada",
      completed: "Concluída",
    };

    const icons: Record<string, any> = {
      confirmed: CheckCircle2,
      pending: Clock,
      cancelled: XCircle,
      completed: CheckCircle2,
    };

    const Icon = icons[status] || Clock;

    return (
      <Badge variant={variants[status] || "secondary"}>
        <Icon className="h-3 w-3 mr-1" />
        {labels[status] || status}
      </Badge>
    );
  };

  const filteredReservations = statusFilter === "all" 
    ? reservations 
    : reservations.filter(r => r.status === statusFilter);

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
          <h1 className="text-3xl font-bold mb-2">Reservas</h1>
          <p className="text-muted-foreground">
            Gerenciar todas as reservas do hotel
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="confirmed">Confirmadas</SelectItem>
              <SelectItem value="cancelled">Canceladas</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadReservations} variant="outline">
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
                  <TableHead>Nº Confirmação</TableHead>
                  <TableHead>Quarto</TableHead>
                  <TableHead>Hóspede</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Noites</TableHead>
                  <TableHead>Hóspedes</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Nenhuma reserva encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-mono font-semibold">
                        {reservation.confirmationNumber}
                      </TableCell>
                      <TableCell>{reservation.roomCode}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reservation.guestName}</p>
                          <p className="text-sm text-muted-foreground">{reservation.guestEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(reservation.checkIn), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(reservation.checkOut), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{reservation.totalNights}</TableCell>
                      <TableCell>
                        {reservation.adults} {reservation.adults === 1 ? "adulto" : "adultos"}
                        {reservation.children > 0 && `, ${reservation.children} ${reservation.children === 1 ? "criança" : "crianças"}`}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(reservation.totalPrice)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(reservation.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
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

      {/* Dialog de Detalhes */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Reserva</DialogTitle>
            <DialogDescription>
              Número de confirmação: {selectedReservation?.confirmationNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-6">
              {/* Informações da Reserva */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Quarto</p>
                  <p className="font-semibold">{selectedReservation.roomCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(selectedReservation.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Check-in</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(selectedReservation.checkIn), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Check-out</p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(selectedReservation.checkOut), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Noites</p>
                  <p>{selectedReservation.totalNights}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Hóspedes</p>
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {selectedReservation.adults} {selectedReservation.adults === 1 ? "adulto" : "adultos"}
                    {selectedReservation.children > 0 && `, ${selectedReservation.children} ${selectedReservation.children === 1 ? "criança" : "crianças"}`}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Dados do Hóspede
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Nome</p>
                    <p>{selectedReservation.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-mail
                    </p>
                    <p>{selectedReservation.guestEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </p>
                    <p>{selectedReservation.guestPhone}</p>
                  </div>
                  {selectedReservation.guestDocument && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documento
                      </p>
                      <p>{selectedReservation.guestDocument}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Informações Financeiras
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Preço por noite</p>
                    <p>{formatPrice(selectedReservation.basePrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Desconto</p>
                    <p>{formatPrice(selectedReservation.discount)}</p>
                  </div>
                  {selectedReservation.promoCode && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Código Promocional</p>
                      <p className="font-mono">{selectedReservation.promoCode}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total</p>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(selectedReservation.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedReservation.specialRequests && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Solicitações Especiais</h3>
                  <p className="text-sm text-muted-foreground">{selectedReservation.specialRequests}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground">
                  Criada em: {format(new Date(selectedReservation.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
                {selectedReservation.updatedAt !== selectedReservation.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Atualizada em: {format(new Date(selectedReservation.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}



