import Router from 'express';
import multer from 'multer'; // lib para trab com uploads
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvaliableController from './app/controllers/AvaliableController';

import authMiddleware from './app/middlewares/auth';

const routes = Router();

const upload = multer(multerConfig); // instancia de multer, serve como middleware

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/avaliable', AvaliableController.index);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedules', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

// rota teste para upload, recebe o middleware do multer, indicando q será enviado apenas 1 arquivo (single), no campo 'file'
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
