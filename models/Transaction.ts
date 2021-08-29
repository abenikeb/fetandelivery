import mongoose, { Schema, Document } from 'mongoose';

interface TransactionDoc extends Document {
    customer: string,
    vandorId: string,
    orderId: string,
    orderValue: number, // amount
    offerUsed: string, // offerId if Used
    status: string,
    paymentMode: string,
    paymentResponse: string,
}

const TransactionSchema = new Schema({
    customer: String,
    vandorId: String,
    orderId: String,
    orderValue: Number, // amount
    offerUsed: String, // offerId if Used
    status: String,
    paymentMode: String,
    paymentResponse: String

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        }
    },
    timestamps: true
});


const Transaction = mongoose.model<TransactionDoc>('Transaction', TransactionSchema);

export { Transaction }