import { Router } from 'express'
import OrphanagesController from './controller/OrphanagesController'
import multer from 'multer';

import uploadConfig from './config/upload'
const routes = Router()
const upload = multer(uploadConfig)

routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post("/orphanages", upload.array('images') ,OrphanagesController.create);
routes.delete("/orphanages/:id",OrphanagesController.delete);

export default routes;

