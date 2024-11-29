// import { usePurchaseContext } from './context';
import Bag1 from '../../assets/images/bag1.jpeg';
import Bag2 from '../../assets/images/bag2.jpeg';
import Bag3 from '../../assets/images/bag3.jpeg';
import { useState } from 'react';

export default function SelectGift() {
    // const purchaseContext = usePurchaseContext();
    const [bagIndex, setBagIndex] = useState<number>(-1);

    return (
        <div className="w-full">
            <h1 className="text-4xl font-bold mb-10 text-center">Choose your bag</h1>
            <div className="flex flex-row justify-between">
                <img src={Bag1} alt="Bag1" className="mx-auto w-[161px] h-[124px]" onClick={() => setBagIndex(0)} />
                <img src={Bag2} alt="Bag2" className="mx-auto w-[161px] h-[124px]" onClick={() => setBagIndex(1)}/>
                <img src={Bag3} alt="Bag3" className="mx-auto w-[161px] h-[124px]" onClick={() => setBagIndex(2)}/>
            </div>
            { bagIndex >= 0 && (
                <div className="mt-20">
                    <h1 className="text-4xl font-bold mb-10 text-center">Choose your items</h1>
                    <div className="flex flex-row justify-between">
                        <p>item1</p>
                        <p>item2</p>
                        <p>item3</p>
                        <p>item4</p>
                        <p>item5</p>
                        <p>item6</p>
                        <p>item7</p>
                        <p>item8</p>
                        <p>item9</p>
                    </div>
                </div>
            )}
        </div>
    );
}
