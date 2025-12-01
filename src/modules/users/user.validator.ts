import { z } from "zod";

// Lista exata baseada na imagem enviada (WhatsApp Image 2025-11-30 at 12.53.05.jpeg)
const CARGOS_MILITARES = [
  "Soldado",
  "Cabo",
  "Terceiro Sargento",
  "Segundo Sargento",
  "Primeiro Sargento",
  "Subtenente",
  "Segundo Tenente",
  "Primeiro Tenente",
  "Capitão",
  "Major",
  "Tenente-Coronel",
  "Coronel"
] as const;

export const createUserSchema = z.object({
  body: z.object({
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    matricula: z.string().min(1, "Matrícula é obrigatória"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
    
    // Agora o cargo valida exatamente a lista da imagem
    cargo: z.enum(CARGOS_MILITARES, {
      errorMap: () => ({ message: "Cargo inválido. Escolha uma patente válida." })
    }),
    
    // Perfil de Acesso (Permissões no Software)
    tipo_perfil: z.enum(["ADMIN", "ANALISTA", "CHEFE", "OPERADOR_CAMPO"]).default("ANALISTA"),
    
    // Status (Ativo/Inativo)
    status_usuario: z.enum(["ATIVO", "INATIVO"]).default("ATIVO"),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    nome: z.string().min(3).optional(),
    email: z.string().email().optional(),
    cargo: z.enum(CARGOS_MILITARES).optional(),
    tipo_perfil: z.enum(["ADMIN", "ANALISTA", "CHEFE", "OPERADOR_CAMPO"]).optional(),
    status_usuario: z.enum(["ATIVO", "INATIVO"]).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});
