import 'dotenv/config'; // carrega as var de ambientes definidas no .env e as deixa acessiveis atraves do process.env

// arquivo separado q inicia as Queue, pode ser rodado independente do server.js
import Queue from './lib/Queue';

Queue.processQueue();
