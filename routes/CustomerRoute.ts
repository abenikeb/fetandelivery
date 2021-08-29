import express from 'express'
import { GetGroceryAvailablity, TopSupermarkets, SeachGroceries, SuperMarketByID, GetCurrentOffer } from '../controllers'


const router = express.Router()

/*..............Get GroceryGroceryServices................*/
router.get('/:pinCode', GetGroceryAvailablity)

/*..............Get Get Supermarkets................*/
router.get('/top-superMarkets/:pinCode', TopSupermarkets)

/*..............Get Grocery By Search................*/
router.get('/search/:pinCode', SeachGroceries)

/*..............Get Offer By :pincode................*/
router.get('/offer/:pinCode', GetCurrentOffer)

/*..............Get Supermarkrts By Search................*/
router.get('/GetsuperMarketById/:id', SuperMarketByID)

export { router as CustomerRoute }

