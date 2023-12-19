import { createContext, useState, useReducer } from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products';

export const CartContext = createContext({
	items: [],
	addItemToCart: () => {},
	updateItemQuantity: () => {},
});

const shoppingCartReducer = (state, action) => {
	if (action.type === 'ADD_ITEM') {
		const updatedItems = [...state.items];

		const existingCartItemIndex = updatedItems.findIndex(cartItem => cartItem.id === action.payload);
		const existingCartItem = updatedItems[existingCartItemIndex];

		if (existingCartItem) {
			const updatedItem = {
				...existingCartItem,
				quantity: existingCartItem.quantity + 1,
			};
			updatedItems[existingCartItemIndex] = updatedItem;
		} else {
			const product = DUMMY_PRODUCTS.find(product => product.id === action.payload);
			updatedItems.push({
				id: action.payload,
				name: product.title,
				price: product.price,
				quantity: 1,
			});
		}

		return {
			...state, // w tym przypadku mamy tylko jedną wartość w stanie
			items: updatedItems,
		};
	}

	if (action.type === 'UPDATE_ITEM') {
		const updatedItems = [...state.items];
		const updatedItemIndex = updatedItems.findIndex(item => item.id === action.payload.productId);

		const updatedItem = {
			...updatedItems[updatedItemIndex],
		};

		updatedItem.quantity += action.payload.amount;

		if (updatedItem.quantity <= 0) {
			updatedItems.splice(updatedItemIndex, 1);
		} else {
			updatedItems[updatedItemIndex] = updatedItem;
		}

		return {
			...state,
			items: updatedItems,
		};
	}

	return state;
};

const CartContextProvider = ({ children }) => {
	const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
		items: [],
	});

	// use reducer tak jak state najpierw ma w tablicy state a potem funkcja dispatch  która jest funkcją wysyłki. Poza komponentem dodajemy funkcję reducera która będzie wywyływana przez Reacta po wysłaniu tak zwanej akcji przez dispatcha
	// w useReducer() wrzucamy stworzoną funkcje a jako drugi paramtr początkowy state

	function handleAddItemToCart(id) {
		shoppingCartDispatch({
			type: 'ADD_ITEM',
			payload: id,
		});
	}

	function handleUpdateCartItemQuantity(productId, amount) {
		shoppingCartDispatch({
			type: 'UPDATE_ITEM',
			payload: {
				productId: productId,
				amount: amount,
			},
		});
	}

	const ctxValue = {
		items: shoppingCartState.items,
		addItemToCart: handleAddItemToCart,
		updateItemQuantity: handleUpdateCartItemQuantity,
	};

	return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>;
};

export default CartContextProvider;
