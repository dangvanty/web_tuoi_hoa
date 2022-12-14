import React, { Fragment } from "react";
import "./Cart.scss";
import CartItemCard from "./CartItemCard.js";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import {formatNumber} from"../helper/formatPrice"
const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const navigate=useNavigate();

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };

  const checkoutHandler = () => {
      navigate("/login?redirect=shipping");
   
  };

  return (
    <Fragment>
        <MetaData title="Giỏ hàng của tôi"/>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />

          <Typography>Không có sản phẩm nào trong giỏ hàng</Typography>
          <Link to="/Shop">Xem sản phẩm của Tuoi Hoa</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <h1>Giỏ hàng của tôi</h1>
            <div className="cartHeader">
              <p>Sản phẩm</p>
              <p>Số lượng</p>
              <p>Tổng cộng</p>
            </div>

            {cartItems &&
              cartItems.map((item) => (
                <div className="cartContainer" key={item.product}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className="cartInput">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.product, item.quantity)
                      }
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.product,
                          item.quantity,
                          item.stock
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="cartSubtotal">{`${
                    formatNumber(item.price * item.quantity)
                  } đ`}</p>
                </div>
              ))}

            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Thành tiền</p>
                <p>{`${formatNumber(cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                ))} đ`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Đặt hàng</button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
