import express from 'express'
import { DeliveryUserLogin, DeliveryUserService, DliveryUserSignUp, EditDeliveryUserProfile, GetDeliveryUserProfile } from '../controllers'
import { Authenticate } from '../middleware'

const router = express.Router()

/*..............Customer \ Signup................*/
router.post('/signUp', DliveryUserSignUp)
/*..............Customer Login................*/
router.post('/login', DeliveryUserLogin)


/* require authentication */
router.use(Authenticate)
/*..............Change Service................*/
router.put('/service', DeliveryUserService)

/*..............profile................*/
router.get('/profile', GetDeliveryUserProfile)
router.patch('/edit_profile', EditDeliveryUserProfile)

export { router as DeliveryBoyRoute }

