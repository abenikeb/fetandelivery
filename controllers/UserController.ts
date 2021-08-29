import { plainToClass } from 'class-transformer'
import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { CreateUserInput, CreateUserLogin } from '../dto'
import { User } from '../models/User';
import { GenerateOtp, GeneratePassword, GenerateSignature } from '../utility';
import { ValidatePassword, GenerateSalt } from './../utility/PasswordUnility';
import { CartItem, EditProfile, OrderInputs } from './../dto/User.dto';
import { Grocery, Transaction, Order, Offer, Vandor, DeliveryUser} from '../models';

export const UserSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const userInputs = plainToClass(CreateUserInput, req.body)
    const inputErrors = await validate(userInputs, { validationError: { target: true }})
    
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email, phone, password } = userInputs

    const salt = await GenerateSalt()
    const userPassword = await GeneratePassword(password, salt)
    
    const {otp,expiry} = GenerateOtp()
   
    const existCustomer = await User.findOne({ email: email })
    if (existCustomer != null) {
        return res.status(400).json({message:"The user alerady exist in this account"})
    }

    const result = await User.create({
        email: email,
        password: userPassword,
        salt: salt,
        firstName: '',
        lastName: '',
        address: '',
        phone: phone,
        verified: false,
        otp: otp,
        otp_expiry: expiry,
        lat: 0,
        lng: 0,
        cart:[],
        orders:[]
    })
    if (result) {
        // send otp to customer
        // await onRequestOtp(otp, phone)
        
        //generate signture
        const signture = GenerateSignature({
            _id: result._id,
            email: result.email,
            // verified: result.verified,          
        })

        return res.json({signture: signture, otp:otp, verified:result.verified, email:result.email })
    } else {
        res.json({message: "Not found"})
    }
}

export const UserLogin = async (req: Request, res: Response, next: NextFunction) => {
    const userInputs = plainToClass(CreateUserLogin, req.body)
    const inputErrors = await validate(userInputs, { validationError: { target: true }})
    
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email, password } = userInputs

    const existUser = await User.findOne({ email: email })

    if (existUser) {

        const validPassword = await ValidatePassword(password, existUser.password, existUser.salt)

        if (validPassword) {
            const signture = GenerateSignature({
                _id: existUser._id,
                email: existUser.email
            })
            return res.status(200).json(signture)
        } else {
            res.status(400).json("error")
        }        
    }
}

export const UserVerify = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body
    const user = req.user
   
    if (user != null) {

        const profile = await User.findById(user._id)

        if (profile) {

            if (profile.otp === (otp) && profile.otp_expiry >= new Date()) {
                
                profile.verified = true
                
                const updateUserResponse = await profile.save()

                const signture = GenerateSignature({
                    _id: updateUserResponse._id,
                    email:updateUserResponse.email
                })

                return res.status(201).json({
                    signture: signture,
                    verified: updateUserResponse.verified,
                    email: updateUserResponse.email
                })
            }
        } 
    }  return res.json({message: "Error in Profile"})
            
        
}
export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const profile = await User.findById(user._id)

        if (profile) {
            const { otp, expiry } = GenerateOtp()
            
            profile.otp = otp
            profile.otp_expiry = expiry

            await profile.save()
             // await onRequestOtp(otp, phone)
            
            return res.status(200).json({message: "OTP is Sent via Your Phone"})
        }
    }
}
export const GetUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (user) {
        const profile = await User.findById(user._id)
        if (profile) {
            return res.status(200).json(profile)
        }
    }
}
export const EditUserProfile = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user

    const userInputs = plainToClass(EditProfile, req.body)
    const inputErrors = await validate(userInputs, { validationError: { target: true }})
    
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { firstName, lastName, address } = userInputs
    
    if (user) {
        const profile = await User.findById(user._id)

        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName
            profile.address = address

            const result = await profile.save()
            return res.json(result)
        }
    }
}
// ofeer Section

export const ApplyOffer = async (req: Request, res: Response, next: NextFunction) => {
    const offerId = req.params.id
    const user = req.user

    if (user) {
        let appliedOffer = await Offer.findById(offerId)
        if (appliedOffer) {
            if (appliedOffer.promoType == "USER") {
                
            } else {
                if (appliedOffer.isActive) {
                 return res.json({message: "offer is Valid", appliedOffer:appliedOffer})
             }
            }
             
        }
    }    
}

/* ---------  Assign Order for Delivery ------------*/
const AssignDeliveryBoy = async (orderID:string, vandorID:string) => {
    // find the vandor
    const vandor = await Vandor.findById(vandorID)
    if (vandor) {
        let areaCode = vandor.pincode
        let vandorLat = vandor.lat
        let vandorLng = vandor.lng
        // find avaliable delivery Boy
        const avaliableDelivery =  await DeliveryUser.find({pinCode:areaCode, isAvalaible:true,verified:true})
        if (avaliableDelivery) {
            //cheak the nearst delivey boy and Assign
            console.log(`Delivery person ${avaliableDelivery[0]}`)
            //update the delivery ID
            const currentOrder = await Order.findById(orderID)
            if (currentOrder) {
                currentOrder.deliveryID = avaliableDelivery[0]._id
                const result = await currentOrder.save()
                console.log(result)
                // push notification using firebase
            }
        } else {
            console.log(`Delivery person ${avaliableDelivery[0]}`)
        }
        
    }    
}
//payment section

export const CratePayment = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body
    const {amount, paymentMode, offerId} = req.body
    if (user) {
        let payableAmount = Number(amount)

        if (offerId) {
            let valuableOffer = await Offer.findById(offerId)
            if (valuableOffer) {
                payableAmount = (payableAmount - valuableOffer.offerAmount)
            }
        } else payableAmount = Number(amount)
    
    // perform payment gatewat | create api call
        
    // get success / failre response
        
    // crate record on transaction 
        const createTransaction = await Transaction.create({
            customer: user._id,
            vandorId: '',
            orderId: '',
            orderValue: payableAmount, // amount
            offerUsed: offerId, // offerId if Used
            status: 'OPEN',
            paymentMode: paymentMode,
            paymentResponse: 'Cash on Delivery',
        })
     
        
    //return transaction Id
        return res.json(createTransaction)
        
    }    
}

const validateTransaction = async (trnxId: string) => {    
        const currentTransaction = await Transaction.findById(trnxId)
        if (currentTransaction) {
            if (currentTransaction.status.toLocaleLowerCase() !== "faield") {
                return { status: true, currentTransaction }
            }
                       
    }
    return { status: false, currentTransaction } 
}

// order Section



export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
   
    // grab current login Customer
    const user = req.user
    const {trnxId, amount, items} = <OrderInputs>req.body  
   // const {trnxId, amount, items} = <[OrderInputs]>req.body 

    if (user) {
        //validate transaction
        const {status, currentTransaction} = await validateTransaction(trnxId)
        // crete an order ID
        if (!status) {
            return res.status(400).json("You Should Get valid Transaction!")
        }
        
        const profile = await User.findById(user._id).populate('orders')
        if (profile) {

            let orderID = `${Math.floor(Math.random() * 89999) + 1000}` 
            let cartItems = Array()
            let netAmount = 0.0
            let vendorId = ''

            // grab order items from request {{id:xx, unit:xx}}
            
            //calculate order amount

            const groceries = await Grocery.find().where('_id').in(items.map(item => item._id)).exec()
            groceries.map(grocery => {
                items.map(({ _id, unit }) => {
                    if (grocery._id == _id) {
                        vendorId = grocery.vandorId
                        netAmount += (grocery.price * unit)
                        cartItems.push({grocery, unit})
                    }
                })
            })     
        
            //create order with item description
            if (cartItems) {
                // create order
                const currentOrder = await Order.create({
                    orderId: orderID,
                    vandorID:vendorId,
                    items: cartItems,
                    totalAmount: netAmount,
                    paidAmount:amount,
                    orderDate: new Date(),
                    orderStatus:'Waiting',
                    remarks: '',
                    deliveryID: '',
                    readyTime: 35
                })
                    profile.cart = [] as any
                    profile.orders.push(currentOrder)

                    if (currentTransaction) {
                        currentTransaction.orderId = orderID
                        currentTransaction.vandorId = vendorId
                        currentTransaction.status = "CONFIRMED"

                        await currentTransaction.save()                        
                }
                
                await AssignDeliveryBoy(currentOrder._id,vendorId)
                    // finally update orders to user account
                return res.status(200).json(await profile.save())
                              
            }
            return res.json({message: "Error"})            
        } 
        return res.json({message: "Error"})             
            
    }return res.json('Error in User')
}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
    let user = req.user

    if (user) {        
        let profile = await User.findById(user._id).populate("orders")

        if (profile != null) {

            return res.json(profile)
        }
        return res.json("Error in profile")
        

    }return res.json("Error in User")
}

export const GetOrderByID = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const AddCart = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
     
    if (user) {
        let profile = await User.findById(user._id).populate('cart.grocery')

        let { _id, unit } = <CartItem>req.body
        let grocery = await Grocery.findById(_id)
      
        if (grocery) {
            if (profile) {
                let cartItems = profile.cart
              
                if (cartItems.length > 0) {
                                    
                    let existCartItem = cartItems.filter(item => item.grocery._id.toString() === _id)
                        if (existCartItem.length > 0) {
                            let index = cartItems.indexOf(existCartItem[0])
                            if (unit > 0) {
                               cartItems[index] = {grocery, unit}                               
                            } else {
                                cartItems.splice(index,1)                                 
                            }
                            // return res.json(index)
                        }else {
                        // add new item
                        cartItems.push({grocery, unit})
                    }   
                  
                } else {
                    // add new item
                    cartItems.push({grocery, unit})
                }
                 if (cartItems) {
                    profile.cart = cartItems
                    let cartResult = await profile.save()
                    return res.json(cartResult)
                }    
            }
        }
        
    }
    return res.status(400).json('Error in Creating -- the Cart!')
   
}

export const GetCarts = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user

    if (user) {
        const profile = await User.findById(user._id).populate('cart.grocery')
        if (profile) {
            return res.json(profile.cart)
        } else {
            return res.json('Cart is Empity!')
        }
    }
}

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user

    if (user) {
        const profile = await User.findById(user._id).populate('cart.grocery')

        if (profile) {
            profile.cart = [] as any
            let result = await profile.save()
            return res.json(result)
        } else {
            return res.json('Cart is aleardy Empity!')
        }
    }
    
}


