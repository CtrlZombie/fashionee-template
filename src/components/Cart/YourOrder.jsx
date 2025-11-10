import React from "react";

const YourOrder = ({
  subtotal,
  discount,
  delivery,
  total,
  onCheckout,
  isPromoValid,
}) => {
  return (
    <div className="order">
      <div className="title">Your order</div>
      <div className="order-price-wrapper">
        {/* Order Price (только товары) */}
        <div className="price-row">
          <div className="name">Order price</div>
          <div className="price">
            $<span data-testid="order-price">{subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Discount - ИСПРАВЛЕНО: "10%" когда промокод применён */}
        <div className="price-row">
          <div className="name">Discount for promo code</div>
          <div data-testid="discount">{isPromoValid ? "10%" : "no"}</div>
        </div>

        {/* Delivery */}
        <div className="price-row delimiter">
          <div className="name">
            Delivery <span className="additional">(Aug 02 at 16:00)</span>
          </div>
          <div className="price">
            $<span data-testid="delivery">{delivery.toFixed(2)}</span>
          </div>
        </div>

        {/* Total (вся сумма) */}
        <div className="price-row total">
          <div className="name">Total</div>
          <div className="price">
            $<span data-testid="total-price">{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <div className="button-wrapper">
        <button
          className="button"
          data-testid="checkout-btn"
          onClick={onCheckout}
        >
          Checkout
        </button>
        <div className="vertical-line"></div>
      </div>
    </div>
  );
};

export default YourOrder;
