import {Request , Response} from 'express'
import { getRepository } from "typeorm";
import orphanage_view from "../views/orphanages_view"
import * as Yup from 'yup'

import Orphanage from "../models/Orphanage";

export default {
    async index(request: Request,response: Response) {
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return response.json(orphanage_view.renderMany(orphanages))
    },

    async show(request: Request,response: Response) {
        const {id} = request.params;

        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(
            id,
            { relations: ['images'] })

        return response.json(orphanage_view.render(orphanage))
    },

    async create( request: Request, response : Response){
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
          } = request.body; 
        
          const orphanagesRepository = getRepository(Orphanage);
        
          const requestImages = request.files as Express.Multer.File[];

          const images = requestImages.map(image => {
              return { path : image.filename }
          })

          const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images
          }

          const schema = Yup.object().shape({
              name: Yup.string().required(),
              latitude: Yup.number().required(),
              longitude: Yup.number().required(),
              about: Yup.string().required().max(300),
              instructions: Yup.string().required(),
              opening_hours: Yup.string().required(),
              open_on_weekends: Yup.boolean().required(),
              images: Yup.array(
                  Yup.object().shape({
                    path: Yup.string().required()
              }))
          })

          await schema.validate(data,{
              abortEarly: false
          })

          const orphanageCreated = orphanagesRepository.create(data);
        
          await orphanagesRepository.save(orphanageCreated);
        
          return response.status(201).json(orphanageCreated);
    },
    async delete(request: Request, response : Response){
        const orphanagesRepository = getRepository(Orphanage);
        const OrphanageDelete = await orphanagesRepository.remove(request.params.id as any);

        return response.send();
    }
}