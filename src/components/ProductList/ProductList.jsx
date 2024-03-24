import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'AMD Ryzen 5 3600', price: 3000, description: '4.2GHZ'},
    {id: '2', title: 'GTX 1660 SUPER', price: 12000, description: '6GB'},
    {id: '3', title: 'HyperX 16GB RAM', price: 2000, description: '3600 Mhz'},
    {id: '4', title: 'Kingston NVME 1TB', price: 2200, description: '2000 read, 2500 write'},
    {id: '5', title: 'Intel core i5 12400F', price: 5500, description: '2.5GHZ'},
    {id: '6', title: 'RTX 4060', price: 15000, description: '8GB'},
    {id: '7', title: 'Ryzen 7 5700x3D', price: 9000, description: '3.9GHZ'},
    {id: '8', title: 'GAMMAXX 400K', price: 1100, description: '500-1500 rpm'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://localhost:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;