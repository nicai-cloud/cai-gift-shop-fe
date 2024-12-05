import { useCallback, useRef, useState } from 'react';
// import ActionButton from '../../components/button/action-button';
import { FooterContent } from '../../components/page';
import Divider from '../../components/divider';
import { FormProvider, useForm } from 'react-hook-form';
import ErrorPanel from '../../components/error-panel';
import TextField from '../../components/input/text-field';
// import AsyncAutocomplete, { AsyncAutocompleteOption } from '../../components/input/async-autocomplete';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElementChangeEvent, StripeElementStyle } from '@stripe/stripe-js';
import StripeFieldWrapper from '../../components/stripe-field-wrapper';
import { ConfirmOrderDetailsForm } from './types';
import { usePurchaseContext } from './context';
import { Button } from '@headlessui/react';

export type CompleteOrder = {
    agreeToTerms: boolean;
};

// function optionFromAddress(a: string): AsyncAutocompleteOption<string> {
//     return {
//         id: a,
//         value: a,
//         label: a,
//     };
// }

const STRIPE_ELEMENT_STYLE_PROPS: StripeElementStyle = {
    base: {
        'fontFamily': 'MierA, sans-serif',
        'fontSize': '18px',
        'fontSmoothing': 'antialiased',
        'lineHeight': '24px',
        'fontWeight': '500',
        ':focus': {},
        '::placeholder': {
            color: '#9395A1',
        },
    },
    invalid: {
        color: '#1B1F39',
    },
};

export default function ConfirmOrder() {
    const purchaseContext = usePurchaseContext();
    const stripe = useStripe();
    const elements = useElements();

    // We need to manually store the error state from Stripe elements to render
    // error messages. These messages come in during onChange events.
    // We also store whether or not the field is empty, because Stripe does not consider
    // an empty field to be invalid. We use a ref rather than state so that we don't force
    // a re-render every time we change it.
    const [cardNumberError, setCardNumberError] = useState<string | null>(null);
    const isCardNumberEmpty = useRef(true);
    const [cardExpiryError, setCardExpiryError] = useState<string | null>(null);
    const isCardExpiryEmpty = useRef(true);
    const [cardCVVError, setCardCVVError] = useState<string | null>(null);
    const isCardCVVEmpty = useRef(true);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const form = useForm<ConfirmOrderDetailsForm>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',

            // address: null,

            nameOnCard: '',
        },
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(async (data: ConfirmOrderDetailsForm) => {
        if (elements === null) {
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        const paymentMethodResult = await stripe?.createPaymentMethod({
            type: 'card',
            card: elements.getElement('cardNumber')!,
            billing_details: {
                name: data.nameOnCard,
            },
        });

        if (paymentMethodResult?.error) {
            form.resetField('nameOnCard');
            setGlobalError(paymentMethodResult.error.message ?? 'There was an error adding your card. Please choose another card and try again. If the problem persists, please contact support.');
            setIsLoading(false);
            return;
        }

        if (!paymentMethodResult?.paymentMethod) {
            setGlobalError('There was an error adding your card. Please choose another card and try again. If the problem persists, please contact support.');
            setIsLoading(false);
            return;
        }

        const submissionResult = await purchaseContext.submitCompleteOrder({
            firstName: data.firstName,
            lastName: data.lastName,
            mobile: data.mobile,
            email: data.email,

            // address: data.address?.value,

            paymentMethodId: paymentMethodResult.paymentMethod.id,
        });

        if (submissionResult !== null) {
            setGlobalError(submissionResult.message);
            setIsLoading(false);
            window.scrollTo(0, 0);
        }
    }, [purchaseContext, isLoading, setIsLoading, setGlobalError]);

    // // Addresses
    // const fetchAddresses = async (query: string) => {
    //     if (query.length < 3) {
    //         return [];
    //     }

    //     const data = await fetch(
    //         `http://192.168.178.146:8888/address/auto-complete`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ search: query }),
    //         },
    //     );

    //     const result: string[] = (await data.json()).addresses;
    //     const resp = result.map(optionFromAddress);
    //     return resp;
    // };

    // Payments
    const validateStripeFields = useCallback(() => {
        if (isCardNumberEmpty.current) {
            setCardNumberError('Please enter your card number.');
        }

        if (isCardExpiryEmpty.current) {
            setCardExpiryError('Please enter your card expiry.');
        }

        if (isCardCVVEmpty.current) {
            setCardCVVError('Please enter your card CVV.');
        }
    }, [isCardNumberEmpty, setCardNumberError, isCardExpiryEmpty, setCardExpiryError, isCardCVVEmpty, setCardCVVError]);

    const onValidationError = useCallback(() => {
        validateStripeFields();
    }, [validateStripeFields]);

    const handleCardNumberChange = useCallback((event: StripeElementChangeEvent) => {
        if (event.error !== undefined) {
            setCardNumberError(event.error.message);
        }
        else {
            setCardNumberError(null);
        }

        isCardNumberEmpty.current = event.empty;
    }, [isCardNumberEmpty, setCardNumberError]);

    const handleCardExpiryChange = useCallback((event: StripeElementChangeEvent) => {
        if (event.error !== undefined) {
            setCardExpiryError(event.error.message);
        }
        else {
            setCardExpiryError(null);
        }

        isCardExpiryEmpty.current = event.empty;
    }, [isCardExpiryEmpty, setCardExpiryError]);

    const handleCardCVVChange = useCallback((event: StripeElementChangeEvent) => {
        if (event.error !== undefined) {
            setCardCVVError(event.error.message);
        }
        else {
            setCardCVVError(null);
        }

        isCardCVVEmpty.current = event.empty;
    }, [isCardCVVEmpty, setCardCVVError]);

    return (
        <>
            <div className="w-full max-w-[650px]">
                <h1 className="text-h3 font-bold text-dark-strong text-center">Your gift order</h1>

                <Divider className="mt-6" />

                <div className="mt-8">
                    {globalError !== null && <ErrorPanel className="mt-8" text={globalError} />}

                    <form id="completeOrderForm" onSubmit={form.handleSubmit(onSubmit, onValidationError)}>
                        <FormProvider {...form}>

                            {/* Customer Details */}
                            {/* <h2 className="text-h5 font-bold text-dark-strong mt-4 text-center">Enter your details</h2>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 justify-between gap-4">
                                <TextField
                                    className="flex-grow"
                                    type="text"
                                    label="First name"
                                    name="firstName"
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Please enter your first name.',
                                        },
                                    }}
                                />
                                <TextField
                                    className="flex-grow"
                                    type="text"
                                    label="Last name"
                                    name="lastName"
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Please enter your last name.',
                                        },
                                    }}
                                />
                            </div>
                            <h3 className="mt-4 text-p font-bold text-dark-strong">Your date of birth</h3>
                            <div className="mt-4 flex flex-row justify-between gap-4">
                                <TextField
                                    className="flex-grow"
                                    type="tel"
                                    label="Mobile number"
                                    placeholder="e.g. 0400 000 000"
                                    name="mobile"
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Please enter your mobile number.',
                                        },
                                        pattern: {
                                            value: /^(\+61\s?|0)4\d{2}\s?\d{3}\s?\d{3}$/,
                                            message: 'Please enter a valid Australian mobile number, e.g. 0400 000 000.',
                                        },
                                    }}
                                />
                            </div>
                            <div className="mt-4 flex flex-row justify-between gap-4">
                                <TextField
                                    className="flex-grow"
                                    type="email"
                                    label="Email address"
                                    placeholder="e.g. abc@gmail.com"
                                    name="email"
                                    rules={{
                                        required: {
                                            value: true,
                                            message: 'Please enter your email.',
                                        },
                                        pattern: {
                                            // eslint-disable-next-line no-control-regex
                                            value: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
                                            message: 'Please enter a valid email address, e.g. abc@gmail.com',
                                        },
                                    }}
                                />
                            </div> */}

                            {/* Address */}
                            {/* <h2 className="text-h5 font-bold text-dark-strong mt-8 text-center">What’s your delivery address?</h2>
                            <p className="mt-2 text-p text-dark-medium text-center">We&apos;ll send your gift order to this address.</p>
                            <AsyncAutocomplete
                                label="Address"
                                className="mt-6"
                                name="address"
                                autoComplete="off"
                                placeholder="Start typing your address..."
                                fetchOptions={fetchAddresses}
                                data-1p-ignore
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'Please enter your address.',
                                    },
                                }}
                            /> */}

                            {/* Payments */}
                            <h2 className="text-h5 font-bold text-dark-strong mt-8 text-center">Payment</h2>
                            <p className="mt-2 text-p text-dark-medium text-center">All transactions are secure and encrypted.</p>
                            <StripeFieldWrapper htmlFor="card-number" label="Card number" className="mt-6 marker:w-full" forceErrorState={cardNumberError !== null}>
                                <CardNumberElement
                                    id="card-number"
                                    onChange={handleCardNumberChange}
                                    className="peer [&_iframe]:!outline-none border-none opacity-0 [&.StripeElement--focus]:opacity-100 [&:not(.StripeElement--empty)]:opacity-100"
                                    options={{ style: STRIPE_ELEMENT_STYLE_PROPS }}
                                />
                            </StripeFieldWrapper>
                            { cardNumberError
                            && (
                                <p className="pl-4 pt-[0.125rem] text-caption text-error text-left">
                                    {cardNumberError}
                                </p>
                            )}
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 justify-evenly sm:gap-2">
                                <div className="flex-grow basis-full">
                                    <StripeFieldWrapper label="Expiry date" htmlFor="card-expiry" forceErrorState={cardExpiryError !== null}>
                                        <CardExpiryElement
                                            id="card-expiry"
                                            onChange={handleCardExpiryChange}
                                            className="peer [&_iframe]:!outline-none border-none opacity-0 [&.StripeElement--focus]:opacity-100 [&:not(.StripeElement--empty)]:opacity-100"
                                            options={{ style: STRIPE_ELEMENT_STYLE_PROPS }}
                                        />
                                    </StripeFieldWrapper>
                                    { cardExpiryError
                                    && (
                                        <p className="pl-4 pt-[0.125rem] text-caption text-error text-left">
                                            {cardExpiryError}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-grow basis-full">
                                    <StripeFieldWrapper label="CVV" htmlFor="card-cvv" forceErrorState={cardCVVError !== null}>
                                        <CardCvcElement
                                            id="card-cvv"
                                            onChange={handleCardCVVChange}
                                            className="peer [&_iframe]:!outline-none border-none opacity-0 [&.StripeElement--focus]:opacity-100 [&:not(.StripeElement--empty)]:opacity-100"
                                            options={{ style: STRIPE_ELEMENT_STYLE_PROPS }}
                                        />
                                    </StripeFieldWrapper>
                                    { cardCVVError
                                    && (
                                        <p className="pl-4 pt-[0.125rem] text-caption text-error text-left">
                                            {cardCVVError}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <TextField
                                label="Name on card"
                                name="nameOnCard"
                                className="mt-4"
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'Please enter the name as written on your card.',
                                    },
                                }}
                            />
                        </FormProvider>
                    </form>
                </div>
            </div>
            <FooterContent>
                <Button
                    type="submit"
                    form="completeOrderForm"
                    className="w-full sm:max-w-[17.8125rem]"
                >
                    Complete order
                </Button>
                {/* <ActionButton
                    type="submit"
                    form="completeOrderForm"
                    theme="primary"
                    size="large"
                    className="w-full sm:max-w-[17.8125rem]"
                    loading={isLoading}
                >
                    Complete order
                </ActionButton> */}
            </FooterContent>
        </>
    );
}
