export interface CreateVandorInput {
    name: string;
    ownerName: string;
    type: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface UpdateVandor {
    name: string;
    address: string;
    phone: string;
    type: [string];
}

export interface serviceAvailableVandor {
    serviceAvailable: string;
}

export interface LoginVandor {
    email: string;
    password: string;
}

export interface VendorSigntaure {
    _id: string;
    email: string;
    name: string;
}

export interface VandorPayLoad {
    _id: string;
    email: string;
    name: string;
}

export interface vandorOffer{
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