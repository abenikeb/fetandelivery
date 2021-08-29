import express from 'express';
import {
    AddGrocery, GetGroceries, GetOrdersVandor,
    GetVendorProfile, UpdateVendorCoverImage,
    UpdateVendorProfile, UpdateVendorService,
    VandorLogin, GetOrdersDetail, ProcessOrder
} from '../controllers'
import { Authenticate } from '../middleware';
import multer from 'multer';
import { AddOffer, GetOffer, EditOffer } from './../controllers/VandorController';

const router = express.Router();

const imageStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        // cb(null, new Date().toISOString() + '_' + file.originalname)
        cb(null, file.originalname)
    }
})

const images = multer({ storage: imageStorage }).array('images', 10)

router.post('/login', VandorLogin)

router.use(Authenticate)
router.get('/profile', GetVendorProfile)
router.post('/updateProfile', UpdateVendorProfile)
router.post('/updateCover', images, UpdateVendorCoverImage)
router.post('/updateService', UpdateVendorService)

router.post('/grocery', images, AddGrocery)
router.get('/groceries', GetGroceries)

//order
router.get('/orders', GetOrdersVandor)
router.put('/orders/:id/process', ProcessOrder)
router.get('/order/:id', GetOrdersDetail)


//offer
router.post('/offer', AddOffer)
router.get('/offers', GetOffer)
router.put('/offer/:id', EditOffer)

export { router as VandorRoute };