import mongoose, { Schema, Document, Model} from "mongoose";

export interface OrderDoc extends Document {
    orderId: string;
    vandorID: string
    items: [any]; // {{grocery, unit:1}}
    totalAmount: number;
    paidAmount:number,
    orderDate: Date;
    orderStatus: string;
    remarks: string
    deliveryID: string
    readyTime: number
}

const OrderSchema = new Schema({
    orderId: { type: String, required: true },
    vandorID:{type:String, required: true},
    items: [
        {
            grocery: { type: Schema.Types.ObjectId, ref: "Grocery", required: true },
            unit:{type:Number, required:true}
        }
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: {type:Number, required:true},
    orderDate: {type:Date},
    orderStatus: { type: String },
    remarks: {type: String},
    deliveryID: {type: String},
    readyTime: {type: Number}
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

const Order = mongoose.model<OrderDoc>('Order', OrderSchema)

export { Order }