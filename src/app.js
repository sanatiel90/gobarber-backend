import 'dotenv/config'; // carrega as var de ambientes definidas no .env e as deixa acessiveis atraves do process.env

import express from 'express';
import { resolve } from 'path';
import Youch from 'youch'; // trata mensagens de erro para ficarem mais legíveis ao desenvolvedor
import * as Sentry from '@sentry/node'; // lib para manipular excecoes em ambiente de producao, envia erro/excecao para seu app em sentry.io
import 'express-async-errors'; // permite q o express identifique erros em chamadas de funções async/await; precisa vir antes das rotas
import routes from './routes';
import sentryConfig from './config/sentry';

import './database'; // a class Database esta exportando uma instancia automaticament

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig); // inicia sentry

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler()); // ativando sentry antes de todos os middlewares, para que as excecoes sejam monitoradas
    this.server.use(express.json());
    // fazendo instancia do server utilizar express.static() na rota '/files'; esse static permite o acesso a arquivos como imagens
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler()); // erro handler depois de todas as rotas/controllers
  }

  exceptionHandler() {
    // usando um middleware de erros (alem dos 3 param comuns de middl., recebe tbm um paramentro de erro)
    // quando um middleware tem 4 parametros o node identifica q ele é um middle de tratamento de excecao; todos
    // os erros vao cair nesse middle
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
