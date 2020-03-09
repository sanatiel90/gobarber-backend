require('dotenv/config'); // carrega as var de ambientes definidas no .env e as deixa acessiveis atraves do process.env

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true, // preenche automaticamente campos create_at e updated_at em cada tabela
    underscored: true, // para q os nomes das tabelas sejam adaptadas para users_table
    underscoredAll: true, // o msm anterior, mas pra colunas
  },
};
