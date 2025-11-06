import React, { useState } from "react";
import "./Cart.css"; 

const Cart = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Fashionee - cotton shirt (S)",
      oldPrice: 52.99,
      currentPrice: 35.99,
      quantity: 1,
      image: "./images/shirt.jpg", 
    },
    {
      id: 2,
      name: "Spray wrap skirt",
      oldPrice: null,
      currentPrice: 110.99,
      quantity: 1,
      image: "./images/skirt.jpg", 
    },
  ]);

  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id, change) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          const newQuantity = Math.max(0, product.quantity + change);
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  const removeProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (total, product) => total + product.currentPrice * product.quantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const delivery = 16.0;
    return subtotal + delivery;
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="cart" data-testid='cart-page'>
      <div className="order-wrapper">
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product">
              <div className="photo">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <div className="title">{product.name}</div>
                <div className="price-wrapper">
                  <div className="price-and-quantity">
                    <div className="price">
                      {product.oldPrice && (
                        <div className="old-price">
                          ${product.oldPrice.toFixed(2)}
                        </div>
                      )}
                      <div className="current-price">
                        ${product.currentPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="quantity">
                      <div
                        className="count-button"
                        onClick={() => updateQuantity(product.id, -1)}
                      >
                        -
                      </div>
                      <div className="count">{product.quantity}</div>
                      <div
                        className="count-button"
                        onClick={() => updateQuantity(product.id, 1)}
                      >
                        +
                      </div>
                    </div>
                  </div>
                  <div className="total-price">
                    ${(product.currentPrice * product.quantity).toFixed(2)}
                  </div>
                </div>
                <div
                  className="close"
                  onClick={() => removeProduct(product.id)}
                >
                  ×
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="order">
          <div className="title">Your order</div>
          <div className="order-price-wrapper">
            <div className="price-row">
              <div className="name">Order price</div>
              <div className="price">${calculateSubtotal().toFixed(2)}</div>
            </div>
            <div className="price-row">
              <div className="name">Discount for promo code</div>
              <div>No</div>
            </div>
            <div className="price-row delimiter">
              <div className="name">
                Delivery <span className="additional">(Aug 02 at 16:00)</span>
              </div>
              <div className="price">$16.00</div>
            </div>
            <div className="price-row total">
              <div className="name">Total</div>
              <div className="price">${calculateTotal().toFixed(2)}</div>
            </div>
          </div>
          <div className="button-wrapper">
            <button className="button">Checkout</button>
            <div className="vertical-line"></div>
          </div>
        </div>
      </div>

      <div className="promo-code-wrapper">
        <div className="info">
          <div className="title">You Have A Promo Code?</div>
          <div className="description">
            To receive up-to-date promotional codes, subscribe to us on social
            networks.
          </div>
        </div>
        <form className="promo-code" onSubmit={handlePromoSubmit}>
          <input
            type="text"
            name="promo-code"
            className="input"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <div className="button-wrapper">
            <button type="submit" className="button">
              <img src="./icons/button-arrow.svg" alt="Arrow icon" />
            </button>
            <div className="vertical-line"></div>
          </div>
        </form>
        <div className="find-us">
          <div className="find-us-text">Find us here:</div>
          <div className="find-us-links">
            <div className="find-us-link">
              <a href="#">FB</a>
            </div>
            <div className="line"></div>
            <div className="find-us-link">
              <a href="#">TW</a>
            </div>
            <div className="line"></div>
            <div className="find-us-link">
              <a href="#">INS</a>
            </div>
            <div className="line"></div>
            <div className="find-us-link">
              <a href="#">PT</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
