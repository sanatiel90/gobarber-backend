import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // sequelize:param q indica a conexao a ser recebida
  static init(sequelize) {
    // super.init RECEBE como param um objeto com os campos q podem ser populados e um 2º obj com config adicionais, como tableName, charset collate
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // addHook funciona como triggers
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  passwordCorrect(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
