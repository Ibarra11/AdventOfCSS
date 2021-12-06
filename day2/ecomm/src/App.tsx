import React, { useReducer, useState, useEffect } from 'react';
import bg_top_right from './assets/images/bg__top-right.svg';
import bg_bottom_right from './assets/images/bg__btm-right.svg';
import bg_left from './assets/images/bg__left.svg';
import ProductData from './data';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { DialogOverlay, DialogContent } from '@reach/dialog';

interface MenuItem {
    productId: number;
    productName: string;
    productPrice: number;
    productImg: string;
}

interface CartItem {
    productId: number;
    productName: string;
    productPrice: number;
    productImg: string;
    amount: number;
}
type ICart = CartItem[];

type ActionTypes =
    | {
          type: 'ADD_TO_CART';
          payload: CartItem;
      }
    | {
          type: 'UPDATE_PRODUCT_AMOUNT' | 'DECREASE_PRODUCT_AMOUNT';
          payload: { productId: number };
      }
    | {
          type: 'REMOVE_FROM_CART';
          payload: { productId: number };
      };

type Actions = ActionTypes;

const INITIAL_CART = [] as ICart;

function cartHelper(cart: ICart, productId: number, mode: 'increase' | 'decrease') {
    const productIndex = cart.findIndex((cartItem) => cartItem.productId === productId);
    if (productIndex >= 0) {
        const cartCpy = [...cart];
        const productCpy = { ...cartCpy[productIndex] };
        {
            mode === 'increase' ? productCpy.amount++ : productCpy.amount--;
        }
        return [...cartCpy.splice(0, productIndex), productCpy, ...cartCpy.splice(productIndex + 1)];
    }
    return cart;
}

const cartReducer = (cart: ICart, action: Actions) => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            return [...cart, { ...action.payload }];
        }
        case 'UPDATE_PRODUCT_AMOUNT': {
            return cartHelper(cart, action.payload.productId, 'increase');
        }
        case 'DECREASE_PRODUCT_AMOUNT': {
            return cartHelper(cart, action.payload.productId, 'decrease');
        }
        case 'REMOVE_FROM_CART': {
            const productIndex = cart.findIndex((cartItem) => cartItem.productId === action.payload.productId);
            const cartCpy = [...cart];
            return [...cartCpy.splice(0, productIndex), ...cartCpy.splice(productIndex + 1)];
        }

        default: {
            return cart;
        }
    }
};

function App() {
    const [cart, dispatch] = useReducer(cartReducer, INITIAL_CART);
    const [modal, setModal] = useState(false);
    const [modalCartItem, setModalCartItem] = useState<CartItem>({} as CartItem);
    const openModal = (product: CartItem) => {
        setModal(!modal);
        setModalCartItem(product);
    };

    const closeModal = () => setModal(!modal);

    return (
        <div className="relative flex justify-center items-center h-screen bg-background-clr ">
            <div className="absolute h-full w-full overflow-hidden ">
                <img
                    className="absolute block left-0  h-4/6 top-1/2 transform -translate-y-1/2"
                    src={bg_left}
                    alt=" decorative image"
                />
                <img className="absolute top-0 right-0 h-1/3" src={bg_top_right} alt=" decorative image" />
                <img
                    className="absolute bottom-0 right-0  h-4/6 transform translate-x-6 translate-y-5"
                    src={bg_bottom_right}
                    alt=" decorative image"
                />
            </div>
            <div className="relative flex items-center gap-12 h-full">
                <Menu cart={cart} dispatch={dispatch} />
                <Cart openModal={openModal} cart={cart} dispatch={dispatch} />
            </div>
            <CartModal dispatch={dispatch} isOpen={modal} closeModal={closeModal} modalCartItem={modalCartItem} />
        </div>
    );
}

const BG_COLORS = ['bg-blue', 'bg-pink', 'bg-glacier', 'bg-green'];

const Menu = ({ cart, dispatch }: { cart: ICart; dispatch: React.Dispatch<Actions> }) => {
    return (
        <div className=" h-full card bg-white ">
            <h2 className=" flex items-center h-5p pl-9 pt-4  text-h2 font-bold leading-10  uppercase">To Go Menu</h2>
            <div className=" relative h-95p overflow-auto">
                <div className=" absolute   w-full pb-5  pl-4 flex flex-col gap-9 pt-10 ">
                    {ProductData.map((product, index) => {
                        const inCart = Boolean(cart.find((cartProduct) => cartProduct.productId === product.productId));
                        return (
                            <MenuItem
                                key={product.productId}
                                {...product}
                                inCart={inCart}
                                bgClr={BG_COLORS[index % 4]}
                                dispatch={dispatch}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const MenuItem = ({
    productId,
    productImg,
    productName,
    productPrice,
    inCart,
    bgClr,
    dispatch,
}: MenuItem & { bgClr: string; inCart: boolean; dispatch: React.Dispatch<Actions> }) => {
    return (
        <div className={`relative flex justify-end h-32 rounded-l-3xl pt-2 pr-3 ${bgClr}`}>
            <img
                className="absolute top-0 left-0 plate transform -translate-x-4 -translate-y-7 "
                src={productImg}
                alt={productName}
            />
            <div className="flex flex-col items-start gap-2 top-2 right-0 w-1/2 ">
                <p className=" text-base">{productName}</p>
                <h4 className=" text-2xl font-bold">${productPrice}</h4>
                <button
                    className="absolute bottom-0 transform translate-y-1/2  w-28 bg-purple text-white text-sm py-1 px-4   rounded-2xl"
                    onClick={() =>
                        dispatch({
                            type: 'ADD_TO_CART',
                            payload: {
                                productId,
                                productName,
                                productPrice,
                                productImg,
                                amount: 1,
                            },
                        })
                    }
                    disabled={inCart}
                >
                    {inCart ? 'In Cart' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

const Cart = ({
    cart,
    dispatch,
    openModal,
}: {
    cart: ICart;
    dispatch: React.Dispatch<Actions>;
    openModal: (product: CartItem) => void;
}) => {
    const [subtotal, setSubtotal] = useState(0);
    let total = 0;
    const tax = subtotal * 0.0975;
    useEffect(() => {
        console.log('total: ' + total);
        setSubtotal(total);
    }, [cart]);

    const removeFromCartCheck = (cartItem: CartItem) => {
        if (cartItem.amount > 1) {
            dispatch({
                type: 'DECREASE_PRODUCT_AMOUNT',
                payload: { productId: cartItem.productId },
            });
        } else {
            openModal(cartItem);
        }
    };
    return (
        <div className="card h-full px-5 pb-5   bg-white">
            <h2 className=" flex items-center h-5p  pt-4  text-h2 font-bold leading-10  uppercase">Your Cart</h2>
            <div className="h-5/6">
                <div className=" h-4/6 -mx-5 overflow-y-auto pb-4  ">
                    {cart.map((cartItem, index) => {
                        const productTotal = cartItem.amount * cartItem.productPrice;
                        const isLastCartItem = index === cart.length - 1;
                        total += productTotal;
                        return (
                            <div
                                key={cartItem.productId}
                                className={`grid grid-cols-3 h-32 gap-4 w-80 pr-3 pb-3 mx-auto ${
                                    isLastCartItem ? 'border-b-4' : 'border-b-2 '
                                } border-purple-200`}
                            >
                                <div className="relative row-span-2">
                                    <img className="block h-20" src={cartItem.productImg} alt={cartItem.productName} />
                                    <span className="absolute right-1/2 top-6 transform  translate-x-3 flex justify-center items-center  bg-black h-8 w-8 text-white rounded-full">
                                        {cartItem.amount}
                                    </span>
                                </div>

                                <div className="col-span-2">
                                    <p className=" text-base">{cartItem.productName}</p>
                                    <p className="text-base font-bold">${cartItem.productPrice}</p>
                                </div>
                                <div className="col-start-2 flex items-center self-start ">
                                    <button
                                        onClick={() => removeFromCartCheck(cartItem)}
                                        className="bg-purple rounded-full "
                                    >
                                        {' '}
                                        <ChevronLeft color="white" size={24} />{' '}
                                    </button>
                                    <p className="relative mx-4 text-lg ">{cartItem.amount}</p>
                                    <button
                                        onClick={() =>
                                            dispatch({
                                                type: 'UPDATE_PRODUCT_AMOUNT',
                                                payload: { productId: cartItem.productId },
                                            })
                                        }
                                        className="bg-purple rounded-full "
                                    >
                                        {' '}
                                        <ChevronRight color="white" size={24} />{' '}
                                    </button>
                                </div>
                                <h3 className=" relative -top-1 text-3xl text-right font-bold h-9 self-start ">
                                    ${productTotal.toFixed(2)}
                                </h3>
                            </div>
                        );
                    })}
                </div>
                <div className="h-2/6 bottom-0 flex flex-col gap-4 ">
                    <div className="flex gap-2 items-center justify-end   ">
                        <span className="text-base font-bold">Subtotal:</span>
                        <p className="text-2xl font-bold">${subtotal.toFixed(2)}</p>
                    </div>
                    <div className=" flex gap-2 items-center justify-end  ">
                        <span className="text-base font-bold">Tax:</span>
                        <p className="text-2xl font-bold">${tax.toFixed(2)}</p>
                    </div>
                    <div className=" flex gap-2 items-center justify-end  ">
                        <span className="text-base font-bold">Total:</span>
                        <p className="text-2xl font-bold text-purple">${(subtotal + tax).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CartModal = ({
    isOpen,
    closeModal,
    modalCartItem,
    dispatch,
}: {
    isOpen: boolean;
    closeModal: () => void;
    modalCartItem: CartItem;
    dispatch: React.Dispatch<ActionTypes>;
}) => {
    console.log(modalCartItem);
    const { productName, productImg, productPrice, productId } = modalCartItem;
    return (
        <DialogOverlay isOpen={isOpen} onDismiss={closeModal} className="absolute inset-0 bg-indigo-600 bg-opacity-75 ">
            <DialogContent
                className="relative grid grid-cols-2 gap-4 w-2/6 h-2/6 p-4 mx-auto top-1/2 transform -translate-y-1/2 rounded-lg shadow-md bg-white"
                aria-label="cart modal"
            >
                <img className="block col-start-1" src={productImg} alt={productName} />
                <div className="col-start-2 space-y-4 self-center">
                    <h4>Remove {productName} from cart</h4>
                    <div className="flex justify-between text-white">
                        <button
                            onClick={() => {
                                dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
                                closeModal();
                            }}
                            className=" w-20 py-2 rounded-xl bg-red-600 "
                        >
                            Yes
                        </button>
                        <button onClick={closeModal} className=" w-20 py-2 rounded-xl bg-red-600 ">
                            No
                        </button>
                    </div>
                </div>
            </DialogContent>
        </DialogOverlay>
    );
};

export default App;
