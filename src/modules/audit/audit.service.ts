import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuditService {
  async log(data: { action: string; userId?: string; details?: string; ip?: string }) {
    try {
      await prisma.auditLog.create({
        data: {
          action: data.action,
          userId: data.userId,
          details: data.details,
          ipAddress: data.ip,
        },
      });
    } catch (error) {
      console.error("Falha ao criar log de auditoria:", error);
    }
  }
}
