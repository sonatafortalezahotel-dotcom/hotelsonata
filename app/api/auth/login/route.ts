import { NextResponse } from "next/server";
import { verifyCredentials, createToken, getUserByEmail } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca o usuário para obter o ID
    const user = await getUserByEmail(email);
    
    if (!user) {
      console.error(`Tentativa de login com email inexistente: ${email}`);
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const isValid = await verifyCredentials(email, password);

    if (!isValid) {
      console.error(`Senha incorreta para email: ${email}`);
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Cria token com o ID real do usuário
    const token = createToken(user.id);

    return NextResponse.json({
      success: true,
      token,
      message: "Login realizado com sucesso",
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}

