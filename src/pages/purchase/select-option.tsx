import { usePurchaseContext } from './context';
import { Button } from '@headlessui/react';

export default function SelectOption() {
    const purchaseContext = usePurchaseContext();

    const choosePreselectGifts = () => {
        purchaseContext.choosePreselectGifts();
    }

    const chooseCustomGifts = () => {
        purchaseContext.chooseCustomGifts();
    }

    return (
        <div className="w-full flex flex-col">
            <Button className="bg-blue-500" onClick={choosePreselectGifts}>
                Choose pre-select gifts
            </Button>
            <br />
            <Button className="bg-blue-500" onClick={chooseCustomGifts}>
                Choose custom gifts
            </Button>
        </div>
    );
}
