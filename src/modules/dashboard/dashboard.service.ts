import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DashboardService {
  
  // KPI 1: Total de ocorrências por Status (Pizza/Rosca)
  async getOcorrenciasPorStatus(filters: any) {
    const where = this.buildWhere(filters);
    
    const result = await prisma.ocorrencia.groupBy({
      by: ["status"],
      where,
      _count: { id: true },
    });

    // Formata para o frontend: { "PENDENTE": 10, "CONCLUIDA": 5 }
    return result.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);
  }

  // KPI 2: Top Ocorrências por Tipo (Barra)
  async getOcorrenciasPorTipo(filters: any) {
    const where = this.buildWhere(filters);

    const result = await prisma.ocorrencia.groupBy({
      by: ["tipo"],
      where,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10, // Top 10 tipos
    });

    return result.map(item => ({
      name: item.tipo,
      value: item._count.id
    }));
  }

  // KPI 3: Ocorrências por Bairro (Mapa/Lista)
  async getOcorrenciasPorBairro(filters: any) {
    const where = this.buildWhere(filters);

    const result = await prisma.ocorrencia.groupBy({
      by: ["bairro"],
      where,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10, // Top 10 bairros
    });

    return result.map(item => ({
      name: item.bairro,
      value: item._count.id
    }));
  }

  // Helper para construir os filtros de data (comum a todos os gráficos)
  private buildWhere(filters: any) {
    const where: any = {};
    
    if (filters.dataInicio && filters.dataFim) {
      where.data_acionamento = {
        gte: filters.dataInicio,
        lte: filters.dataFim,
      };
    } else if (filters.dataInicio) {
      where.data_acionamento = { gte: filters.dataInicio };
    }

    return where;
  }
}
