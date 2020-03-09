import File from '../models/File';

class FileController {
  async store(req, res) {
    // pegando da requisicao via desestruturacao o originalName e filename e automaticamento já as atribuindo às var 'name' e 'path'
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
