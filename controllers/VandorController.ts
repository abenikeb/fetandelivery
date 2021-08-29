import { Request, Response, NextFunction } from 'express'
import { CreateGroceryInput, LoginVandor, UpdateVandor, vandorOffer } from '../dto'
import { Grocery, Vandor } from '../models'
import { Offer } from '../models/Offer'
import { Order } from '../models/Orders'
import { GenerateSignature, ValidatePassword } from '../utility'
import { FindVandor } from './AdminController'

export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <LoginVandor>req.body

    const existingVandor = await FindVandor('', email)

    if (existingVandor != null) {
        const validation = await ValidatePassword(password, existingVandor.password, existingVandor.salt)
        if (validation) {

            const signture = GenerateSignature({
                _id: existingVandor._id,
                email: existingVandor.email,
                name: existingVandor.name
            })
            return res.json(signture);
        }

        return res.status(400).json("Failed in Autentication")
    }
    else {
        return res.status(400).json("Failed in Autentication")
    }
}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const existingVandor = await FindVandor(user._id)
        return res.json(existingVandor)
    }
    return res.json('Vandor Not Found')
}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, phone, type } = <UpdateVandor>req.body

    const user = req.user
    if (user) {
        let existingVandor = await FindVandor(user._id)

        if (existingVandor != null) {
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.type = type;

            let savedResult = await existingVandor.save();
            res.json(savedResult)
        }

    }
    return res.json('Vendor Not Found')
}

export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user

    if (user) {
        let vandor = await FindVandor(user._id)

        if (vandor != null) {
            const files = req.files as [Express.Multer.File]
            const images = files.map((file: Express.Multer.File) => file.filename)
            vandor.coverImages.push(...images)

            let result = await vandor.save()
            return res.json(result)
        }
    } else {
        return res.json("Message: Error")
    }
}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const {lat, lng} = req.body

    if (user) {
        let existingVandor = await FindVandor(user._id)

        if (existingVandor != null) {

            existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
            if (lat && lng) {
                existingVandor.lat = lat;
                existingVandor.lng = lng;
             }

            return res.json(await existingVandor.save())
        }

    }
    return res.json('Vendor Not Found')
}

export const AddGrocery = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const { name, description, category, type, price } = <CreateGroceryInput>req.body

        let vandor = await FindVandor(user._id)
        if (vandor != null) {
            const files = req.files as [Express.Multer.File]
            const images = files.map((file: Express.Multer.File) => file.filename)
            const groceryCreate = await Grocery.create({
                vandorId: vandor._id,
                name: name,
                description: description,
                category: category,
                images: images,
                type: type,
                price: price,
                rating: 0
            })
            vandor.grocery.push(groceryCreate)
            return res.json(await vandor.save())
        }
    }
    return res.json('Something is Wrong When Add Food!')
}

export const GetGroceries = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const listGrocery = await Grocery.find({ vandorId: user._id })
        if (listGrocery != null) return res.json(listGrocery)
        else res.json({ "Message": "No Grocery Found" })        
    } else {
        return res.json({ "Message": "No Grocery Found" }) 
    }

}

export const GetOrdersVandor = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if(user){
        const vandorOrder = await Order.find({vandorID: user._id}).populate('items.grocery')
        if (vandorOrder) {
            return res.json(vandorOrder)
        }        
    }
    return res.status(400).json('No Order Found')
}

export const GetOrdersDetail = async (req: Request, res: Response, next: NextFunction) => {
    
    const orderId = req.params.id

    if(orderId){
        const order = await Order.findById(orderId).populate('items.grocery')
        if (order) {
            return res.json(order)
        } 
         return res.status(404).json('No Order Found in this ID')       
    }
    return res.status(404).json('No Order Found in this ID')
}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
    
    const orderId = req.params.id
    const {orderStatus, remarks, readyTime} = req.body

    if(orderId){
        let order = await Order.findById(orderId).populate('items.grocery')
        if(order){
            order.orderStatus = orderStatus
            order.remarks = remarks
            order.readyTime = readyTime

            return res.status(200).json(await order.save()) 
        }
        
         return res.status(404).json('No Order Found!')       
    }
    return res.status(404).json('No Order Found in this ID')
}

export const AddOffer = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
   
    if (user) {
        const { offerType,title, description, minValue, offerAmount, startValidation,
            endValidation, promoCode, promoType, bank, bins, pinCode, isActive } = <vandorOffer>req.body
        
        const vandor = await Vandor.findById(user._id)
        if (vandor) {
            let createOffer = await Offer.create({
                offerType,
                vandors:[vandor],
                title,
                description,
                minValue,
                offerAmount,
                startValidation,
                endValidation,
                promoCode,
                promoType,
                bank,
                bins,
                pinCode,
                isActive
            })
            if(createOffer) return res.json(createOffer)
            
        }
        return res.status(400).json('Unable to Add Offer')
    }
    return res.status(400).json('Unable to Add Offer')
}

export const GetOffer = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        let currenOffer = Array()
        let offers = await (await Offer.find().populate('vandors'))
        if (offers) {
            offers.map(item => {
                if (item.vandors) {
                    item.vandors.map(vandor => {
                        if (vandor._id.toString() == user._id) {
                            currenOffer.push(item)
                        }
                    })
                }
                if (item.offerType == "GENERIC") {
                    currenOffer.push(item)
                }
            })
        }
        return res.status(200).json(currenOffer)
    }
    return res.status(400).json('Unable to Add Offer')
}


export const EditOffer = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const { title, description, isActive } = <vandorOffer>req.body        
        const offerId = req.params.id
        
            const currenOffer = await Offer.findById(offerId)

            if (currenOffer) {

                const vandor = await Vandor.findById(user._id)
                if (vandor) {                    
                    currenOffer.title = title
                    currenOffer.description = description
                    currenOffer.isActive = isActive
        
                    const offerResult = await currenOffer.save()
                    return res.status(200).json(offerResult)
                    
                }

            }
            return res.status(400).json('Unable to Add Offer')
       
        }
        
        return res.status(400).json('Unable to Add Offer')
    
}

