import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { IAuditoriaLog } from "@/types/logs";

// Define a estrutura da resposta da API
type Data = {
  success: boolean;
  message: string;
  insertedId?: string;
  error?: string;
};

// Esta é a função default (padrão) que o Next.js procura e executa.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // 1. CHECAGEM DO MÉTODO: Apenas aceita POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Apenas método POST é permitido para esta rota de teste." });
  }

  try {
    // 2. CONECTA AO BANCO DE DADOS
    // A função connectToDatabase() usa a MONGODB_URI do seu .env.local
    const { db } = await connectToDatabase();

    // 3. DEFINE A COLEÇÃO
    const collection = db.collection<IAuditoriaLog>("auditoria_log");

    // 4. CRIA UM NOVO DOCUMENTO (DADOS DE TESTE)
    const testLog: IAuditoriaLog = {
      data_hora: new Date(),
      usuario_nome: "Marcelo Negrão (Teste Bootstrap)",
      acao_tipo: "LOGIN",
      modulo: "Sistema",
      recurso_tabela: "usuario",
      recurso_id: "Ficticio-ID-001",
      descricao: "Usuário de teste realizou login inicial no sistema SIOB.",
      dados_anteriores: {},
      dados_posteriores: { status: "Online" },
    };

    // 5. INSERE O DOCUMENTO
    const result = await collection.insertOne(testLog);

    // 6. Resposta de sucesso
    if (result.acknowledged) {
      res.status(201).json({
        success: true,
        message: "Log de auditoria de teste inserido com sucesso!",
        insertedId: result.insertedId.toHexString(),
      });
    } else {
      res.status(500).json({ success: false, message: "Falha ao inserir documento." });
    }

  } catch (error) {
    // 7. Resposta de erro (ex: falha de conexão com o MongoDB)
    console.error("Erro no bootstrap:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor ao conectar ou inserir dados.", error: (error as Error).message });
  }
}