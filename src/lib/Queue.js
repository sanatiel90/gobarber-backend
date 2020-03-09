/**
 *
para cada um dos jobs vc cria uma fila, e dentro dessa fila vc armazena o Bee, q é instancia q conecta com o Redis
(banco nao relacional que consegue armazenar e recuperar valores do banco de dados) e usa o handle do job
 */
import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// lista de jobs
const jobs = [CancellationMail];

// classe Fila q gerencia as filas (background jobs) da app
class Queue {
  constructor() {
    // carrega os jobs
    this.queues = {};

    this.init();
  }

  init() {
    // cada job sera percorrido (usando forEach pois nada será retornado, o key e handle de cada job sera acessado via desestruturacao),
    // sera adicionado a fila queue, na posicao da key do job, um novo Bee (uma fila, q faz a conexao com o banco nao relacional redis, recebe a config dele)
    // e o handle do job, que é o metodo do job que processa o que ele faz (envio de email, etc)
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // mét para adicionar um job à fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // processa a fila
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED `, err);
  }
}

export default new Queue();
