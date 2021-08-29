import express, { Request, Response, NextFunction } from 'express';
import { CreateVandor, GetDeliveryBoys, GetTransaction, GetTransactionByID, GetVandorByID, GetVanndors, VerifyDeliveryBoys } from '../controllers';


const router = express.Router();

router.post('/vandor', CreateVandor)
router.get('/vandors', GetVanndors)
router.get('/vandor/:id', GetVandorByID)
router.get('/transaction', GetTransaction)
router.get('/transaction/:id', GetTransactionByID)
router.get('/deliveries', GetDeliveryBoys)
router.put('/verify-deliveries/:id', VerifyDeliveryBoys)


router.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.json({ message: "Hello this is Fetan Delivery ADMIN DashBoard" })
})



export { router as AdminRoute };