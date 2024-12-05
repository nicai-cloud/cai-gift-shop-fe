// import { AsyncAutocompleteOption } from '../../components/input/async-autocomplete';

export type NoNullFields<T> = {
    [K in keyof T]: T[K] extends object ? NoNullFields<T[K]> : NonNullable<T[K]>
};

export type Address = {
    addressFull: string;
    gnafId: string;
    streetLine: string;
    state: string;
    suburb: string;
    postcode: string;
};

export type ConfirmOrderDetails = NoNullFields<ConfirmOrderDetailsForm>;

export type ConfirmOrderDetailsForm = {
    variant_ids: string[];

    // Parent Details
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;

    // Address
    // address: AsyncAutocompleteOption<Address> | null;

    // Payments
    nameOnCard: string;
    paymentMethodId: string;
    lastFour: string;
    expiry: {
        month: number;
        year: number;
    };
};
