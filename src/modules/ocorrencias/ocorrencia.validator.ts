import { z } from "zod";

export const createOcorrenciaSchema = z.object({
  body: z.object({
    // --- ETAPA 1: Básico ---
    ponto_base: z.string().optional(),
    ome_gb_secao: z.string().optional(),
    viatura_tipo: z.string().optional(),
    viatura_numero: z.string().optional(),
    
    nr_aviso: z.string().optional(),
    data_ocorrencia: z.string().datetime().optional(), // Data do fato
    
    cod_co: z.string().optional(),
    cod_ciods: z.string().optional(),
    cod_193: z.string().optional(),
    
    situacao: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA", "TROTE"]).default("PENDENTE"),
    prioridade: z.enum(["ALTA", "MEDIA", "BAIXA"]).default("MEDIA"),

    // --- LOCALIZAÇÃO ---
    rua_avenida: z.string().optional(),
    numero_local: z.string().optional(),
    // CORREÇÃO 1: Usar .min(1) em vez de { required_error } para compatibilidade
    bairro: z.string().min(1, "Bairro é obrigatório"),
    municipio: z.string().default("Recife"),
    codigo_local: z.string().optional(),
    ponto_referencia: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),

    // --- ETAPA 2: Detalhes ---
    veiculos_envolvidos: z.string().optional(),
    historico_texto: z.string().optional(),
    
    guarnicao_posto_grad: z.string().optional(),
    guarnicao_matricula: z.string().optional(),
    guarnicao_nome_guerra: z.string().optional(),
    guarnicao_data: z.string().datetime().optional(),
    
    // JSONs (Array de matrículas)
    guarnicao_componentes: z.array(z.string()).optional(),

    // --- ETAPA 3: Finalização ---
    assinatura_digital: z.string().optional(), // Base64
    
    // CORREÇÃO 2 (Seu erro principal): Definir explicitamente chave (string) e valor (boolean)
    formularios_extras: z.record(z.string(), z.boolean()).optional(), 
    
    outro_relatorio_tipo: z.string().optional(),
    
    // Contagem de Vítimas
    vitimas_total: z.number().int().default(0),
    vitimas_feridas: z.number().int().default(0),
    vitimas_fatais: z.number().int().default(0),
    vitimas_ilesas: z.number().int().default(0),
    vitimas_desaparecidas: z.number().int().default(0),
    
    // Campos legados mantidos para compatibilidade
    tipo: z.string().optional(), 
    subtipo: z.string().optional(),
    data_acionamento: z.string().datetime().optional(),
    hora_acionamento: z.string().datetime().optional(),
  }),
});

export const updateOcorrenciaSchema = z.object({
  body: z.object({
    situacao: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA", "TROTE"]).optional(),
    prioridade: z.enum(["ALTA", "MEDIA", "BAIXA"]).optional(),
    historico_texto: z.string().optional(),
    // Permite atualizar qualquer outro campo opcional
    viatura_numero: z.string().optional(),
    guarnicao_componentes: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});