import express, { Application } from 'express';
import bodyParser from 'body-parser';
import path from 'path'

import { AdminRoute, CustomerRoute, DeliveryBoyRoute, UserRoute, VandorRoute } from '../routes'


export default async (app: Application) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/images', express.static(path.join(__dirname, 'images')))

    app.use('/admin', AdminRoute)
    app.use('/vandor', VandorRoute)
    app.use('/user', UserRoute)
    app.use('/delivery', DeliveryBoyRoute)
    app.use(CustomerRoute)

    return app
}

