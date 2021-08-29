import { Request, Response, NextFunction } from 'express'
import { CreateVandorInput } from '../dto';
import { DeliveryUser, Transaction, Vandor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';


export const FindVandor = (id: string | undefined, email?: string) => {
    if (email) return Vandor.findOne({ email: email })
    else return Vandor.findById(id)
}


export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {

    const { name, address, pincode, type, email, password, ownerName, phone } = <CreateVandorInput>req.body;


    const existingVandor = await Vandor.findOne({ email: email })

    if (existingVandor !== null) {
        return res.json({ "message": "A vandor is exist with this email ID" })
    }

    //generate a salt

    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt);

    // encrypt the password using the salt

    const createdVandor = await Vandor.create({
        name: name,
        address: address,
        pincode: pincode,
        type: type,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        grocery: [],
        lat: 0,
        lng:0
    })

    return res.json(createdVandor)

}

export const GetVanndors = async (req: Request, res: Response, next: NextFunction) => {

    const vandor = await Vandor.find()
    if (vandor != null) return res.json(vandor)
    return res.status(404).json("Message: Vendor does not exist")
}

export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {

    const vandor = await FindVandor(req.params.id)
    if (vandor != null) return res.status(200).json(vandor)
    return res.status(404).json({"Message": "Vendor does not exist with this id"})

}
export const GetTransaction = async (req: Request, res: Response, next: NextFunction) => {
   
    const transaction = await Transaction.find()
    transaction ? res.json(transaction) : res.json({"Message": "The transaction does not exist"})
}
export const GetTransactionByID = async (req: Request, res: Response, next: NextFunction) => {

    const transaction = await Transaction.findById(req.params.id)
    transaction ? res.json(transaction) : res.json({"Message": "The transaction ID does not exist"})
}

export const GetDeliveryBoys = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryBoys = await DeliveryUser.find()
    return deliveryBoys ? res.json(deliveryBoys): res.json({message: "Unable ti find Delivery Boys!"})
}

export const VerifyDeliveryBoys = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryBoys = await DeliveryUser.findById(req.params.id)
    if (deliveryBoys) {
        deliveryBoys.verified = !deliveryBoys.verified
        const result = await deliveryBoys.save()
        result ? res.json(result)  : res.json("Unable to result!")
    }
}
