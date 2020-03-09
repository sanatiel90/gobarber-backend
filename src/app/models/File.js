import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // sequelize:param q indica a conexao a ser recebida
  static init(sequelize) {
    // super.init RECEBE como param um objeto com os campos q podem ser populados e um 2º obj com config adicionais, como tableName, charset collate
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          // get() determina o que esse campo (url) vai retornar, ele tem acesso (usando o this) aos outros campos do model
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
