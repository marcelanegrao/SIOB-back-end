module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/src/lib/mongodb.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
// Verifica se a variável MONGODB_URI (lida do .env.local) existe
if (!process.env.MONGODB_URI) {
    throw new Error("Defina a variável de ambiente MONGODB_URI em .env.local");
}
const uri = process.env.MONGODB_URI;
// Adiciona explicitamente a opção 'tls: false' para contornar problemas de conexão SSL/TLS no Codespace.
// Isso é crucial para ambientes de desenvolvimento como o Codespace.
const options = {
    tls: false
};
let client;
let clientPromise;
// Lógica para reutilizar a conexão em ambiente de desenvolvimento (evita lentidão)
if ("TURBOPACK compile-time truthy", 1) {
    if (!global._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else //TURBOPACK unreachable
;
async function connectToDatabase() {
    const client = await clientPromise;
    // Extrai o nome do banco de dados da URI ou usa 'siob' como padrão
    const dbName = new URL(uri).pathname.substring(1) || "siob";
    const db = client.db(dbName);
    return {
        db,
        client
    };
}
const __TURBOPACK__default__export__ = clientPromise;
}),
"[project]/src/pages/api/logs/bootstrap.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [api] (ecmascript)");
;
async function handler(req, res) {
    // 1. CHECAGEM DO MÉTODO: Apenas aceita POST
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Apenas método POST é permitido para esta rota de teste."
        });
    }
    try {
        // 2. CONECTA AO BANCO DE DADOS
        // A função connectToDatabase() usa a MONGODB_URI do seu .env.local
        const { db } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        // 3. DEFINE A COLEÇÃO
        const collection = db.collection("auditoria_log");
        // 4. CRIA UM NOVO DOCUMENTO (DADOS DE TESTE)
        const testLog = {
            data_hora: new Date(),
            usuario_nome: "Marcelo Negrão (Teste Bootstrap)",
            acao_tipo: "LOGIN",
            modulo: "Sistema",
            recurso_tabela: "usuario",
            recurso_id: "Ficticio-ID-001",
            descricao: "Usuário de teste realizou login inicial no sistema SIOB.",
            dados_anteriores: {},
            dados_posteriores: {
                status: "Online"
            }
        };
        // 5. INSERE O DOCUMENTO
        const result = await collection.insertOne(testLog);
        // 6. Resposta de sucesso
        if (result.acknowledged) {
            res.status(201).json({
                success: true,
                message: "Log de auditoria de teste inserido com sucesso!",
                insertedId: result.insertedId.toHexString()
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Falha ao inserir documento."
            });
        }
    } catch (error) {
        // 7. Resposta de erro (ex: falha de conexão com o MongoDB)
        console.error("Erro no bootstrap:", error);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor ao conectar ou inserir dados.",
            error: error.message
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9aa8659c._.js.map