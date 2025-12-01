import { Request, Response } from "express";
import { RelatorioService } from "./relatorio.service";

const service = new RelatorioService();

export class RelatorioController {
  
  async export(req: Request, res: Response) {
    const { format } = req.query; // ?format=pdf ou ?format=csv

    try {
      if (format === "csv") {
        const csv = await service.generateCsv(req.query);
        res.header("Content-Type", "text/csv");
        res.attachment("relatorio_siob.csv");
        return res.send(csv);
      } 
      
      else if (format === "pdf") {
        const pdfBuffer = await service.generatePdf(req.query);
        res.header("Content-Type", "application/pdf");
        res.attachment("relatorio_siob.pdf");
        return res.send(pdfBuffer);
      } 
      
      else {
        return res.status(400).json({ error: "Formato inválido. Use ?format=pdf ou ?format=csv" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao gerar relatório" });
    }
  }
}
