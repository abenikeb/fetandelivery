import mongoose, { Schema, Document, Model } from "mongoose";
import { CreateGroceryInput } from "../dto";

interface GroceryDoc extends Document {
    vandorId: string;
    name: string;
    description: string;
    category: string;
    type: string;
    price: number;
    rating: number;
    images: [string]
}

const GrocerySchema = new Schema({
    vandorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: { type: [String] },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
})

const Grocery = mongoose.model<GroceryDoc>('Grocery', GrocerySchema)

export { Grocery }