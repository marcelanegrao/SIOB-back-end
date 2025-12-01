import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";
import { stringify } from "csv-stringify/sync";

const prisma = new PrismaClient();

export class RelatorioService {
  
  // Gera string CSV
  async generateCsv(filters: any) {
    const data = await this.getDadosRelatorio(filters);

    const csvOutput = stringify(data, {
      header: true,
      columns: [
        { key: "nr_aviso", header: "Nº Aviso" },
        { key: "data_acionamento", header: "Data" },
        { key: "tipo", header: "Tipo" },
        { key: "prioridade", header: "Prioridade" },
        { key: "status", header: "Status" },
        { key: "bairro", header: "Bairro" },
        { key: "responsavel", header: "Responsável" },
      ],
    });

    return csvOutput;
  }

  // Gera Buffer do PDF
  async generatePdf(filters: any): Promise<Buffer> {
    const data = await this.getDadosRelatorio(filters);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 30, size: "A4" });
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // --- Cabeçalho do PDF ---
      doc.fontSize(18).text("Relatório Operacional SIOB", { align: "center" });
      doc.moveDown();
      doc.fontSize(10).text(`Gerado em: ${new Date().toLocaleString()}`, { align: "right" });
      doc.moveDown();

      // --- Tabela Simples (Lista) ---
      data.forEach((item, index) => {
        doc.fontSize(12).font("Helvetica-Bold").text(`#${index + 1} - ${item.nr_aviso || "S/N"} (${item.status})`);
        doc.fontSize(10).font("Helvetica").text(`Data: ${item.data_acionamento.toLocaleDateString()} | Tipo: ${item.tipo} | Bairro: ${item.bairro}`);
        doc.text(`Prioridade: ${item.prioridade} | Responsável: ${item.responsavel}`);
        
        if(item.observacoes) {
           doc.text(`Obs: ${item.observacoes.substring(0, 100)}...`, { oblique: true });
        }
        
        doc.moveDown(0.5);
        doc.moveTo(30, doc.y).lineTo(565, doc.y).stroke("#cccccc"); // Linha separadora
        doc.moveDown(0.5);
      });

      doc.end();
    });
  }

  // Helper para buscar dados (Reutiliza lógica de filtros)
  private async getDadosRelatorio(filters: any) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.tipo) where.tipo = filters.tipo;
    if (filters.dataInicio) where.data_acionamento = { gte: filters.dataInicio };

    const ocorrencias = await prisma.ocorrencia.findMany({
      where,
      orderBy: { data_acionamento: "desc" },
      include: {
        usuario: { select: { nome: true } }
      }
    });

    // Formata os dados para facilitar a escrita no PDF/CSV
    return ocorrencias.map(oc => ({
      nr_aviso: oc.nr_aviso,
      data_acionamento: oc.data_acionamento,
      tipo: oc.tipo,
      prioridade: oc.prioridade,
      status: oc.status,
      bairro: oc.bairro,
      observacoes: oc.observacoes,
      responsavel: oc.usuario?.nome || "N/A"
    }));
  }
}
