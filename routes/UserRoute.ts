import express from 'express'
import {
    AddCart, CreateOrder, DeleteCart, EditUserProfile, GetCarts, GetOrderByID, GetOrders,
    GetUserProfile, RequestOtp, UserLogin, UserSignUp, UserVerify, ApplyOffer
} from '../controllers'
import { Authenticate } from '../middleware'
import { CratePayment } from './../controllers/UserController';


const router = express.Router()

router.post('/signUp',UserSignUp)
router.post('/login', UserLogin)

/* require authentication */
router.use(Authenticate)
/*..............Verify User Account................*/
router.patch('/verify', UserVerify)
/*..............otp / requesting otp................*/
router.get('/otp', RequestOtp)

/*..............profile................*/
router.get('/profile', GetUserProfile)
router.patch('/edit_profile', EditUserProfile)

// Cart Section
router.post('/add-cart', AddCart)
router.get('/carts', GetCarts)
router.delete('/delete-cart', DeleteCart)


// apply offer
router.get('/offer/verify/:id', ApplyOffer)
//create payment
router.post('/create-payment', CratePayment)
//Order Section
router.post('/create-order', CreateOrder)
router.get('/orders', GetOrders)
router.get('/order/:id', GetOrderByID)


export { router as UserRoute }

