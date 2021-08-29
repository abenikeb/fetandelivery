import { IsEmail, Length, IsEmpty } from "class-validator";
export class CreateUserInput {
    
    @IsEmail()
    email: string
   
    @Length(7, 12)
    phone: string
   
    @Length(6, 12)
    password: string
}
export class CreateUserLogin {
    
    @IsEmail()
    email: string

    @Length(6, 12)
    password: string
}
export class EditProfile {
    
    @Length(3, 24)
    firstName: string

    @Length(2, 24)
    lastName: string

    @Length(6, 50)
    address: string
}

export interface UserPayload {
    _id: string;
    email: string;
    // verified: string;
}

export class OrderInputs {    
    trnxId: string
    amount: number
    items: [CartItem]
}

export class CartItem{
    _id: string
    unit: number
}
export class CreateDeliveryUserInput {    
    @IsEmail()
    email: string
   
    @Length(7, 12)
    phone: string
   
    @Length(6, 12)
    password: string

    @Length(7, 12)
    firstName: string
   
    @Length(6, 12)
    lastName: string

    @Length(7, 250)
    address: string
   
    @Length(4, 24)
    pinCode: string
}

export class CreateDeliveryUserLogin {
    
    @IsEmail()
    email: string

    @Length(6, 12)
    password: string
}
