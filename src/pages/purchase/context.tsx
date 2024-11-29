import { useOutletContext } from 'react-router-dom';

export type SubmissionError = {
    message: string;
};

export type OrderDetails = {
};

export type PurchaseContext = {
    
};

export function usePurchaseContext(): PurchaseContext {
    return useOutletContext();
}
