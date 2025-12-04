import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../../shared/errors/api-errors";

const prisma = new PrismaClient();

export class OcorrenciaService {
  
  async create(data: any, userId: string) {
    const payload = {
      ...data,
      data_acionamento: new Date(data.data_acionamento),
      hora_acionamento: new Date(data.hora_acionamento),
      data_ocorrencia: data.data_ocorrencia ? new Date(data.data_ocorrencia) : undefined,
      id_usuario_fk: userId,
    };
    // Remove chaves undefined para não quebrar o Prisma
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    return await prisma.ocorrencia.create({ data: payload });
  }

  // --- ALTERAÇÃO AQUI: GET ALL COM PAGINAÇÃO ---
  async getAll(filters: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.prioridade) where.prioridade = filters.prioridade;
    if (filters.tipo) where.tipo = filters.tipo;
    if (filters.bairro) where.bairro = filters.bairro;
    if (filters.dataInicio) where.data_acionamento = { gte: new Date(filters.dataInicio) };

    // Configuração da Paginação
    const page = Number(filters.page) || 1;      // Página atual (padrão: 1)
    const limit = Number(filters.limit) || 20;   // Itens por página (padrão: 20)
    const skip = (page - 1) * limit;             // Quantos itens pular

    // 1. Busca o total de itens (para o front calcular o total de páginas)
    const total = await prisma.ocorrencia.count({ where });

    // 2. Busca os dados paginados
    const data = await prisma.ocorrencia.findMany({
      where,
      orderBy: { createdAt: "desc" }, // Mais recentes primeiro
      include: { 
        usuario: { select: { nome: true, matricula: true } } // Quem abriu a ocorrência
      },
      skip,
      take: limit,
    });

    // Retorna no formato padrão de paginação
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getById(id: string) {
    const ocorrencia = await prisma.ocorrencia.findUnique({
      where: { id },
      include: {
        vitimas_detalhe: true,
        midias: true, // Traz as fotos do Cloudinary
        usuario: { select: { nome: true, cargo: true } }
      }
    });
    if (!ocorrencia) throw new NotFoundError("Ocorrência não encontrada");
    return ocorrencia;
  }

  async update(id: string, data: any) {
    const exists = await prisma.ocorrencia.findUnique({ where: { id } });
    if (!exists) throw new NotFoundError("Ocorrência não encontrada");

    if (data.data_fechamento) data.data_fechamento = new Date(data.data_fechamento);

    return await prisma.ocorrencia.update({ where: { id }, data });
  }

  async delete(id: string) {
    const exists = await prisma.ocorrencia.findUnique({ where: { id } });
    if (!exists) throw new NotFoundError("Ocorrência não encontrada");

    await prisma.ocorrencia.delete({ where: { id } });
  }

  // --- MÉTODO DE UPLOAD (CLOUDINARY) ---
  async addMidia(ocorrenciaId: string, usuarioId: string, fileData: { url: string; tipo: string }) {
    const ocorrencia = await prisma.ocorrencia.findUnique({ where: { id: ocorrenciaId } });
    if (!ocorrencia) throw new NotFoundError("Ocorrência não encontrada");

    return await prisma.midia.create({
      data: {
        url: fileData.url,
        tipo: fileData.tipo,
        id_ocorrencia_fk: ocorrenciaId,
        id_usuario_fk: usuarioId,
      },
    });
  }
}