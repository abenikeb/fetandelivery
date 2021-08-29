import mongoose, { Schema, Document, Model } from 'mongoose';


interface VandorDoc extends Document {

    name: string;
    ownerName: string;
    type: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImages: [string];
    rating: number;
    grocery: any;
    lat: number;
    lng: number;
}


const VandorSchema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    type: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: Number },
    grocery: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grocery'
    }],
    lat: Number,
    lng: Number

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


const Vandor = mongoose.model<VandorDoc>('Vandor', VandorSchema);

export { Vandor }