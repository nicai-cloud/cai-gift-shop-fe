import { useOutletContext } from 'react-router-dom';

export type SubmissionError = {
    message: string;
};

export type OrderDetails = {
};

export type PurchaseContext = {
    orderDetails: Readonly<OrderDetails>;
    submitCompleteOrder: (details: any) => Promise<SubmissionError | null>;
};

export function usePurchaseContext(): PurchaseContext {
    return useOutletContext();
}
