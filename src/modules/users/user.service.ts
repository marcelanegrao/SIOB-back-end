import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import { ConflictError, NotFoundError } from "../../shared/errors/api-errors";
import { AuditService } from "../audit/audit.service";

const prisma = new PrismaClient();
const audit = new AuditService();

export class UserService {
  
  async create(data: any, adminId?: string) {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { matricula: data.matricula }] }
    });

    if (existingUser) throw new ConflictError("Já existe um usuário com este e-mail ou matrícula.");

    let passwordToHash = data.password;
    let isTempPassword = false;
    
    if (!passwordToHash) {
      passwordToHash = crypto.randomBytes(4).toString("hex");
      isTempPassword = true;
      console.log(`[DEV] Senha gerada para ${data.email}: ${passwordToHash}`);
    }

    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        senha_hash: hashedPassword,
        password: undefined, 
      },
    });

    await audit.log({
      action: "CRIACAO_USUARIO",
      userId: adminId, // Quem criou (Admin)
      details: `Criou o usuário ${user.nome} (${user.matricula})`
    });

    const { senha_hash, ...userWithoutPassword } = user;
    return isTempPassword ? { ...userWithoutPassword, senhaTemporaria: passwordToHash } : userWithoutPassword;
  }

  async getAll(filters: any) {
    const where: any = {};
    if (filters.cargo) where.cargo = filters.cargo;
    if (filters.status_usuario) where.status_usuario = filters.status_usuario;
    if (filters.matricula) where.matricula = { contains: filters.matricula };
    if (filters.nome) where.nome = { contains: filters.nome };

    return await prisma.user.findMany({
      where,
      orderBy: { nome: "asc" },
      select: {
        id: true, nome: true, matricula: true, email: true, cargo: true, 
        tipo_perfil: true, status_usuario: true, createdAt: true
      }
    });
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, nome: true, matricula: true, email: true, cargo: true, 
        tipo_perfil: true, status_usuario: true, createdAt: true
      }
    });
    if (!user) throw new NotFoundError("Usuário não encontrado");
    return user;
  }

  async update(id: string, data: any, adminId?: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("Usuário não encontrado");

    const updatedUser = await prisma.user.update({ where: { id }, data });

    await audit.log({
      action: "ATUALIZACAO_USUARIO",
      userId: adminId,
      details: `Atualizou dados do usuário ${user.matricula}`
    });

    const { senha_hash, ...safeUser } = updatedUser;
    return safeUser;
  }

  async delete(id: string, adminId?: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("Usuário não encontrado");

    await prisma.user.delete({ where: { id } });

    await audit.log({
      action: "EXCLUSAO_USUARIO",
      userId: adminId,
      details: `Excluiu o usuário ${user.nome} (${user.matricula})`
    });
  }
}
