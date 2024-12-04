import { Elements } from "@stripe/react-stripe-js";
import Page, { FooterOutlet } from "../../components/page";
import tailwindMerge from "../../utils/tailwind-merge";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js";
// import InitialLoadingSpinner from "../../components/loading/initial-loading-spinner";
import { OrderDetails, PurchaseContext } from "./context";

const FIRST_PAGE = '/select-gift'
const CONFIRM_ORDER_PAGE = '/confirm-order'

export default function Purchase() {
    const navigate = useNavigate();
    const matches = useMatches();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    /** Track whether or not the user should be sent back to the start, e.g. if they refresh the page and lose all their state. */
    const hasInitiatedFlowAsExpected = useRef<boolean>();

    const [orderDetails, _] = useState<OrderDetails>({
    });

    const stripePromise = useRef<Promise<Stripe | null> | null>(null);

    const extractAnalyticsParamsAndNavigate = useCallback((destination: string) => {
        const currentParams = new URLSearchParams(location.search);
        navigate({ pathname: destination, search: currentParams.toString() });
    }, [navigate]);

    const getStripePromise = () => {
        if (stripePromise.current === null) {
            // TODO: Load publishable key from BE
            setIsLoading(false)
            stripePromise.current = loadStripe('pk_test_51QQ3ZQDHKkihrujYtIM7Ak8uPOEhK0hs8KNg7ScJvRPmiOOUx1TaQ41FAdES839sfdtl2Zwk3NuYQKShJudcAwvq009Ww3iD4G');
        }

        return stripePromise.current;
    };

    const lastMatch = matches[matches.length - 1]!.pathname;

    useEffect(() => {
        extractAnalyticsParamsAndNavigate(`.${CONFIRM_ORDER_PAGE}`);
        // if (lastMatch == '/purchase/' || lastMatch == '/purchase') {
        //     extractAnalyticsParamsAndNavigate(`.${FIRST_PAGE}`);
        // }
        // else if (lastMatch.endsWith(FIRST_PAGE)) {
        //     hasInitiatedFlowAsExpected.current = true;
        // }
        // else if (!hasInitiatedFlowAsExpected.current) {
        //     // The user landed on this page without having started the flow properly, so send
        //     // them to the start.
        //     extractAnalyticsParamsAndNavigate(`.${FIRST_PAGE}`);
        // }
    }, [lastMatch, extractAnalyticsParamsAndNavigate]);

    const submitCompleteOrder = async (finalPageDetails: any) => {
        const snakeCaseAddress = {};

        Object.keys(finalPageDetails.address ?? {}).forEach((k) => {
            const snakeCaseKey = k.split(/\.?(?=[A-Z])/).join('_').toLowerCase();
            // @ts-expect-error: We are iterating through keys of the Addres type.

            snakeCaseAddress[snakeCaseKey] = finalPageDetails.address[k];
        });

        let response;
        try {
            response = await fetch('http://localhost:8888/complete-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: finalPageDetails?.firstName,
                    last_name: finalPageDetails?.lastName,
                    mobile: finalPageDetails?.mobile,
                    email: finalPageDetails?.email,
                    payment_method_id: finalPageDetails?.paymentMethodId,
                    address: snakeCaseAddress,
                }),
            });
        }

        catch (e) {
            return {
                message: 'There was an unexpected error completing your order. Please try again.',
            };
        }

        if (response.status === 402) {
            return {
                message: 'There was an error processing the payment for your order. Please check you have sufficient funds and try again.',
            };
        }

        if (response.status >= 400) {
            // For now just show a generic error message and we can specialise this as we discover the common error states.
            return {
                message: 'There was an unexpected error completing your order. Please try again.',
            };
        }

        extractAnalyticsParamsAndNavigate('/success');

        return null;
    };


    const context: PurchaseContext = {
        orderDetails,
        submitCompleteOrder
    };

    const stripeElementsOptions: StripeElementsOptions = {
        fonts: [
            {
                family: 'MierA',
                weight: '500',
                src: 'url(\'https://assets.website-files.com/66011a06f3784731d8385669/66725bc1116596e6fbae0699_MierA-Book.woff\') format(\'woff\')',
            },
        ],
        appearance: {
            labels: 'floating',
        },
    };
    
    return (
        <Page>
            <Page.Header className="bg-white border-b border-gray-300">
                <div className="p-3 flex justify-center">
                    <p>header goes here</p>
                </div>
            </Page.Header>
            <Page.Content className={tailwindMerge('px-4 py-10 flex justify-start items-center')}>
                <Elements stripe={getStripePromise()} options={stripeElementsOptions}>
                    { isLoading
                        ? (
                            <div className="flex place-items-center h-full">
                                <p>Currently loading stripe promise</p>
                                {/* <InitialLoadingSpinner className="size-[7.5rem]" /> */}
                            </div>
                            )
                        : <Outlet context={context} />}
                    {/* <Outlet context={context} /> */}
                </Elements>
            </Page.Content>
            <Page.Footer
                className={tailwindMerge(
                    'overflow-hidden bg-white flex justify-center items-start',
                    'transition-[padding] px-4 py-2 sm:py-8 duration-150 ease-in-out has-[[data-outlet]:empty]:py-0 has-[[data-outlet]:empty]:shadow-none',
                )}
            >
                <FooterOutlet className="w-full flex flex-col justify-center items-center" />
            </Page.Footer>
        </Page>
    );
}