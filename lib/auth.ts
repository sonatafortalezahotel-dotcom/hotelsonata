import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Função simples de autenticação
 * Em produção, use NextAuth.js ou similar
 */
export async function verifyAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.substring(7);
  
  // Em produção, verificar JWT
  // Por enquanto, apenas verifica se o token existe
  return token.length > 0;
}

/**
 * Middleware de autenticação para rotas protegidas
 */
export function withAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const isAuthenticated = await verifyAuth(request);
    
    if (!isAuthenticated) {
      return Response.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    return handler(request, context);
  };
}

/**
 * Busca usuário por email
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user.length > 0 ? user[0] : null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

/**
 * Verifica credenciais de login
 */
export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return false;
    }

    // Em produção, use bcrypt para comparar senhas
    // const isValid = await bcrypt.compare(password, user.password);
    
    // Por enquanto, comparação simples (APENAS PARA DESENVOLVIMENTO)
    // Remove espaços em branco e compara
    const storedPassword = user.password.trim();
    const providedPassword = password.trim();
    
    return storedPassword === providedPassword;
  } catch (error) {
    console.error("Erro ao verificar credenciais:", error);
    return false;
  }
}

/**
 * Cria token simples
 * Em produção, use JWT
 */
export function createToken(userId: number): string {
  // Em produção, usar JWT
  return Buffer.from(`${userId}:${Date.now()}`).toString("base64");
}

