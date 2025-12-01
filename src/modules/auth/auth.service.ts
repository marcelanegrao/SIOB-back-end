import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { ConflictError, UnauthorizedError } from "../../shared/errors/api-errors";
import { env } from "../../config/environment";
import { AuditService } from "../audit/audit.service";

const prisma = new PrismaClient();
const audit = new AuditService();

export class AuthService {
  async register(data: any, ip?: string) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new ConflictError("Usuário já cadastrado.");

    let passwordToHash = data.password;
    let isTemp = false;
    
    if (!data.password) {
      passwordToHash = crypto.randomBytes(4).toString("hex");
      isTemp = true;
      console.log(`[DEV] Senha temporária para ${data.email}: ${passwordToHash}`);
    }

    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        nome: data.name,
        senha_hash: hashedPassword,
        tipo_perfil: data.profile,
        matricula: data.matricula,
        id_unidade_operacional_fk: data.id_unidade_operacional_fk,
      },
    });

    // Log de Auditoria
    await audit.log({
      action: "CADASTRO_USUARIO",
      userId: user.id,
      details: `Novo usuário cadastrado: ${user.email}`,
      ip
    });

    const { senha_hash, ...userWithoutPassword } = user;
    return isTemp ? { ...userWithoutPassword, senhaTemporaria: passwordToHash } : userWithoutPassword;
  }

  async login(data: any, ip?: string) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.senha_hash))) {
      throw new UnauthorizedError("E-mail ou senha inválidos");
    }

    const token = jwt.sign(
      { userId: user.id, profile: user.tipo_perfil },
      env.jwtSecret,
      { expiresIn: "8h" }
    );

    // Log de Login
    await audit.log({
      action: "LOGIN",
      userId: user.id,
      details: "Login realizado com sucesso",
      ip
    });

    const { senha_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}
