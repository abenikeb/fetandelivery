import { plainToClass } from 'class-transformer'
import { Request, Response, NextFunction } from 'express'
import { CreateDeliveryUserInput, CreateDeliveryUserLogin, CreateUserLogin } from '../dto'
import { validate } from 'class-validator';
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from './../utility/PasswordUnility';
import { DeliveryUser } from '../models';

export const DliveryUserSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUserInput = plainToClass(CreateDeliveryUserInput, req.body)
    const deliveryUserInputError = await validate(deliveryUserInput, {validationError: {target:true}})
    if (deliveryUserInputError.length > 0) return res.json(deliveryUserInputError)

    const { email, phone, password, firstName, lastName, address, pinCode } = deliveryUserInput
    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt)
    if (await DeliveryUser.findOne({ email: email })) return res.json({ message: "Exist Delivery Boy" })
    let deliveryCreate = await DeliveryUser.create({
        email: email,
        password:userPassword ,
        salt: salt,
        firstName:firstName,
        lastName:lastName,
        pinCode:pinCode,
        address:address ,
        phone: phone,
        verified: false,   
        lat: 0,
        lng: 0,
        isAvalaible: false
    })
    if (deliveryCreate) {
        let signture = GenerateSignature({
            _id: deliveryCreate._id,
            email:deliveryCreate.email,
        })
        signture ? res.json({signture: signture}) : res.json({message: "Error"})
    }
}

export const DeliveryUserLogin = async (req: Request, res: Response, next: NextFunction) => {
    const userInputs = plainToClass(CreateDeliveryUserLogin, req.body)
    const inputErrors = await validate(userInputs, { validationError: { target: true }})    
    if (inputErrors.length > 0) return res.status(400).json(inputErrors)

    const { email, password } = userInputs
    let existDelivery = await DeliveryUser.findOne({ email: email })
    if (existDelivery) {
        let validatePassword = await ValidatePassword(password, existDelivery.password, existDelivery.salt)
        if (validatePassword) {
            const signture = await GenerateSignature({
                _id: existDelivery._id,
                email: existDelivery.email              
            })
            signture ? res.json({ signture: signture }) : res.json({ message: "Error" })
        }
    }  
}

export const DeliveryUserService = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryBoy = req.user
    const {lat,lng} = req.body
    if (deliveryBoy) {
        let services = await DeliveryUser.findById(deliveryBoy._id)
        if (services) {
            services.isAvalaible = !services.isAvalaible
            services.lat = lat;
            services.lng = lng

            const result = await services.save()
            result ? res.json(result) : res.json("Error")
        }
    }
}

export const GetDeliveryUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    
}
export const EditDeliveryUserProfile = async (req: Request, res: Response, next: NextFunction) => {

   
}
