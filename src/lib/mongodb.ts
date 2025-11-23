import { MongoClient, Db } from "mongodb"

// Verifica se a variável MONGODB_URI (lida do .env.local) existe
if (!process.env.MONGODB_URI) {
  throw new Error("Defina a variável de ambiente MONGODB_URI em .env.local")
}

const uri = process.env.MONGODB_URI
const options = {}
let client: MongoClient
let clientPromise: Promise<MongoClient>

// Declaração global para armazenar a conexão em desenvolvimento (necessário para o Next.js)
declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

// Lógica para reutilizar a conexão em ambiente de desenvolvimento (evita lentidão)
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // Em produção, cria um novo cliente a cada requisição (melhor para serverless)
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

/**
 * Função que retorna a instância do banco de dados (Db) e o cliente.
 * É a única função que deve ser usada pelas rotas de API para conectar.
 * @returns {Promise<{ db: Db, client: MongoClient }>}
 */
export async function connectToDatabase() {
  const client = await clientPromise
  
  // Extrai o nome do banco de dados da URI ou usa 'siob' como padrão
  const dbName = new URL(uri).pathname.substring(1) || "siob"
  const db = client.db(dbName)
  
  return { db, client }
}

// Exporta o clientPromise para uso interno (opcional)
export default clientPromise