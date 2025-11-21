// src/components/Cart/CartList.js
import React from "react";
import CartItem from "./CartItem";

const CartList = ({ products, onUpdateQuantity, onRemove }) => {
  if (products.length === 0) {
    return (
      <div className="product-list">
        <div
          data-testid="cart-empty"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h3>Your cart is empty</h3>
          <p>Add some products from the shop!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <CartItem
          key={product.id}
          product={product}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CartList;
