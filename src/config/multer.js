import multer from 'multer'; // lib para trabalhar com multipart form DataCue, necessario para upload de arquivos
import crypto from 'crypto'; // lib do node para gerar caracteres aleatorios
import { extname, resolve } from 'path'; // resolve pega o diretorio atual; extname pega a extensao de um arquivo

export default {
  // storage: como o multer vai armazenar os arquivos (CDN, local, etc), informado o destino e o nome do arquivo
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    /*
      prop filename: recebe uma funcao com 3 param e retorna como o arquivo sera formatado/nomeado
      1º req -> requisicao enviada pelo express; 2º file -> file, contem os dados do arquivo como nome,tamanho,extensao
      3º callback -> funcao q vai ser executada sobre o nome do arquivo, vai retornar o resulado
    */
    filename: (req, file, callbac) => {
      // crypto.randomBytes recebe o nº de bytes para randomizar e
      // uma func callback tbm (nesse caso está como func anonima), q contem param erro (casso ocorra) e res,
      // q indica o retorno do crypto
      crypto.randomBytes(16, (err, res) => {
        if (err) return callbac(err);

        // retornando o callback de 'filename' (1º param é o erro, q nesse caso nao queremos e colocamos como null),
        // q contem o resultado do nome do arquivo (nesse caso será o que foi enviado na requisicao em forma de string
        // hexadecimal + a extensao do arquivo original)
        return callbac(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
