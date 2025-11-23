/**
 * Interface que define o formato de um Log de Auditoria no banco de dados.
 * Todos os campos são obrigatórios, a menos que especificado.
 */
export interface IAuditoriaLog {
  data_hora: Date;
  usuario_nome: string;
  /** Tipo de ação realizada (ex: LOGIN, CRIACAO, EDICAO, DELECAO) */
  acao_tipo: 'LOGIN' | 'LOGOUT' | 'CRIACAO' | 'EDICAO' | 'DELECAO' | 'ACESSO' | 'OUTRO';
  /** Módulo do sistema onde a ação ocorreu (ex: 'Pessoas', 'Patrimonio', 'Sistema') */
  modulo: string; 
  /** Tabela ou recurso afetado (ex: 'pessoa', 'veiculo', 'usuario') */
  recurso_tabela: string;
  /** ID do registro afetado (útil para rastrear o item) */
  recurso_id: string; 
  /** Descrição detalhada da ação. */
  descricao: string;
  /** Dados antes da modificação (JSON opcional) */
  dados_anteriores: Record<string, any>;
  /** Dados após a modificação (JSON opcional) */
  dados_posteriores: Record<string, any>;
}