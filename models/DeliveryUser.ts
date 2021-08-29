import mongoose, { Schema, Document, Model } from 'mongoose';

interface DeliveryUser extends Document {
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    pinCode: string;
    address: string;
    phone: string;
    verified: boolean;   
    lat: number;
    lng: number;
    isAvalaible: boolean
}

const DeliveryUserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    pinCode: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean, required: true },
    lat: { type: Number },
    lng: { type: Number },
    isAvalaible: { type: Boolean, required: true },

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


const DeliveryUser = mongoose.model<DeliveryUser>('DeliveryUser', DeliveryUserSchema);

export { DeliveryUser }