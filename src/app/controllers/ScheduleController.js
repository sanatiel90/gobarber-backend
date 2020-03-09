import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  // lista todos os agendamentos de um provider
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can see this page' });
    }

    // data com timezone 2020-02-27T00:00:00-03:00

    const { date } = req.query;

    const parsedDate = parseISO(date);

    // agendamentos do provider que estejam nada data informada
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
