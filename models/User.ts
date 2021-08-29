import mongoose, { Schema, Document, Model } from 'mongoose';
import {OrderDoc} from './Orders'

interface UserDoc extends Document {
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    verified: boolean;
    otp: number;
    cart:[any]
    otp_expiry: Date;
    lat: number;
    lng: number;
    orders: [OrderDoc]
}


const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: String },
    otp_expiry: { type: Date },
    lat: { type: Number },
    lng: { type: Number },
    cart: [
        {
            grocery: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Grocery',
                require: true
            },
        unit:{type:String, require:true}
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ]

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;

        }
    },
    timestamps: true
});


const User = mongoose.model<UserDoc>('User', UserSchema);

export { User }