// import { usePurchaseContext } from './context';
import Bag1 from '../../assets/images/bag1.jpeg';
import Bag2 from '../../assets/images/bag2.jpeg';
import Bag3 from '../../assets/images/bag3.jpeg';
import item1 from '../../assets/images/item1.png';
import item2 from '../../assets/images/item2.jpg';
import item3 from '../../assets/images/item3.jpg';
import item4 from '../../assets/images/item4.jpg';
import { useState } from 'react';

export default function SelectGift() {
    // const purchaseContext = usePurchaseContext();
    const [selectedBag, setSelectedBag] = useState<number>(-1);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const addSelection = (itemIndex: number) => {
        const items = structuredClone(selectedItems);
        items.push(itemIndex);
        setSelectedItems(items);
    }

    // const removeSelection = (itemIndex: number) => {
    //     const items = structuredClone(selectedItems);
    //     items.filter(item => item !== itemIndex);
    //     setSelectedItems(items);
    // }

    const getSelectedBag = (bagIndex: number) => {
        if (bagIndex == 0) {
            return Bag1;
        } else if (bagIndex == 1) {
            return Bag2;
        } else if (bagIndex == 2) {
            return Bag3;
        }
    }

    const getSelectedItem = (itemIndex: number) =>  {
        // console.log("!!", itemIndex);
        if (itemIndex == 0) {
            console.log("selected item1");
            return item1;
        } else if (itemIndex == 1) {
            console.log("selected item2");
            return item2;
        } else if (itemIndex == 2) {
            console.log("selected item3");
            return item3;
        } else if (itemIndex == 3) {
            console.log("selected item4");
            return item4;
        }
    }

    const sendRequest = async () => {
        // const response = await fetch('http://localhost:8080/health-check');
        // const response = await fetch('http://192.168.178.44:8080/health-check');
        // console.log('!!', await response.json());

        const query = '3 Drues Avenue'
        const data = await fetch('http://192.168.178.44:8080/address/auto-complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ search: query }),
        })

        const result = await data.json();
        console.log('result', result);
    }

    return (
        <div className="w-full">
            <h1 className="text-4xl font-bold mb-10 text-center">Choose your bag</h1>
            <div className="flex flex-row justify-between">
                <img src={Bag1} alt="Bag1" className="mx-auto w-[161px] h-[124px]" onClick={() => setSelectedBag(0)} />
                <img src={Bag2} alt="Bag2" className="mx-auto w-[161px] h-[124px]" onClick={() => setSelectedBag(1)}/>
                {/* <img src={Bag3} alt="Bag3" className="mx-auto w-[161px] h-[124px]" onClick={() => setSelectedBag(2)}/> */}
                <img src={Bag3} alt="Bag3" className="mx-auto w-[161px] h-[124px]" onClick={sendRequest}/>
            </div>
            { selectedBag >= 0 && (
                <div className="mt-20">
                    <h1 className="text-4xl font-bold mb-10 text-center">Choose your items</h1>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col items-center">
                            <img src={item1} alt="item1" className="mx-auto w-[161px] h-[124px]" />
                            <button className="bg-blue-500 p-2 rounded-xl" onClick={() => addSelection(0)}>
                                Pick me
                            </button>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src={item2} alt="item2" className="mx-auto w-[161px] h-[124px]" />
                            <button className="bg-blue-500 p-2 rounded-xl" onClick={() => addSelection(1)}>
                                Pick me
                            </button>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src={item3} alt="item3" className="mx-auto w-[161px] h-[124px]" />
                            <button className="bg-blue-500 p-2 rounded-xl" onClick={() => addSelection(2)}>
                                Pick me
                            </button>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src={item4} alt="item4" className="mx-auto w-[161px] h-[124px]" />
                            <button className="bg-blue-500 p-2 rounded-xl" onClick={() => addSelection(3)}>
                                Pick me
                            </button>
                        </div>
                    </div>
                </div>
            )}
            { selectedBag >= 0 && selectedItems.length > 0 && (
                <div className="mt-20">
                    <h1 className="text-4xl font-bold mb-10 text-center">Your current selection</h1>
                    <div className="flex flex-row items-center justify-center">
                        <img src={getSelectedBag(selectedBag)} alt="item1" className="w-[161px] h-[124px]" />
                        {Object.entries(selectedItems).map(([, value]) => (
                            <div className="flex flex-row items-center">
                                +
                                <img src={getSelectedItem(value)} alt="item" className="w-[161px] h-[124px]" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
