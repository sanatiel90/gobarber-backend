import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

// job de cancelamento de email
class CancellationMail {
  // get: transforma 'key' numa propriedade/variavel que pode ser acessada por outros modulos
  // retorna uma chave única (cada job precisa de uma)
  get key() {
    return 'CancellationMail';
  }

  // handle:mét q será chamado quando o processo desse job for chamado; nesse caso faz o envio do email de cancelamento de agendamento
  // recebe como param (via desestruturacao) a var data, nesse caso contendo os dados do appointment q devem ser incluidas no email
  async handle({ data }) {
    const { appointment } = data;

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às 'H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
