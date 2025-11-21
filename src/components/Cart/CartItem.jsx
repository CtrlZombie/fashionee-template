// src/components/Cart/CartItem.js
import React from "react";

const CartItem = ({ product, onUpdateQuantity, onRemove }) => {
  if (!product) return null;

  const handleDecrease = () => {
    onUpdateQuantity(product.id, -1);
  };

  const handleIncrease = () => {
    onUpdateQuantity(product.id, 1);
  };

  const handleRemove = () => {
    onRemove(product.id);
  };

  const currentPrice = product.currentPrice || product.price || 0;
  const productName = product.name || "Unknown Product";

  return (
    <div className="product" data-testid="cart-item" data-name={productName} data-price={currentPrice}>
      <div>
        <img src={product.image} alt={productName} className="photo"/>
      </div>
      <div className="product-info">
        <div
          className="title"
          data-testid="cart-item-name"
          data-name={productName}
        >
          {productName}
        </div>

        <div className="price-wrapper">
          <div className="price-and-quantity">
            <div className="price">
              {product.oldPrice && (
                <div className="old-price">${product.oldPrice.toFixed(2)}</div>
              )}
              <div className="current-price">${currentPrice.toFixed(2)}</div>
            </div>

            {/* ✅ Исправлено: testid на правильный */}
            <div className="quantity">
              <div
                className="count-button"
                onClick={handleDecrease}
                data-testid="decrease-cart-btn" // ✅ Правильно
              >
                -
              </div>
              <div
                className="count"
                data-testid="cart-item-quantity" // ✅ Исправлено: было "item-quantity"
              >
                {product.quantity}
              </div>
              <div
                className="count-button"
                onClick={handleIncrease}
                data-testid="increase-cart-btn" // ✅ Правильно
              >
                +
              </div>
            </div>
          </div>

          <div className="total-price">
            ${(currentPrice * product.quantity).toFixed(2)}
          </div>
        </div>

        <div
          className="close"
          onClick={handleRemove}
          data-testid="remove-from-cart-btn" //
        >
          ×
        </div>
      </div>
    </div>
  );
};

export default CartItem;
