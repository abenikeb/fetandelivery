import mongoose from 'mongoose';

import { MONGO_URI } from '../config';

export default async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(() => {
            console.log("DB Connected... ")
        }).catch(err => console.log('error' + err))
    } catch (ex) {
        console.log(ex)
    }
}



