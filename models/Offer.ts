import mongoose, { Schema, Document, Model } from 'mongoose';

interface OfferDoc extends Document {
    offerType: string,
    vandors: [any],
    title: string,
    description: string,
    minValue: number,
    offerAmount: number,
    startValidation: Date,
    endValidation: Date,
    promoCode: string,
    promoType: string,
    bank: [any],
    bins: [any],
    pinCode: string,
    isActive: boolean
}


const OfferSchema = new Schema({
    offerType: {type: String, required: true},
    vandors: [
        {
            type: Schema.Types.ObjectId, ref:'Vandor', require:true
        }
    ],
    title: {type: String, required: true},
    description: {type: String},
    minValue: {type: Number},
    offerAmount: {type: Number},
    startValidation: Date,
    endValidation: Date,
    promoCode: {type: String, required: true},
    promoType: {type: String, required: true},
    bank: [{
        type: String
    }],
    bins: [{
        type: String
    }],
    pinCode: {type: String, required: true},
    isActive: {type: Boolean},
   
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;

        }
    },
    timestamps: true
});


const Offer = mongoose.model<OfferDoc>('Offer', OfferSchema);

export { Offer }