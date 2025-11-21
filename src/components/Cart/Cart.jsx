/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import CartList from "./CartList";
import YourOrder from "./YourOrder";
import PromoCode from "./PromoCode";
import "./Cart.scss";
import "../common/Commons.css";

const Cart = ({ productsData }) => {
  const [products, setProducts] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);

  useEffect(() => {
    const loadCartWithProductData = () => {
      try {
        if (!productsData || !Array.isArray(productsData)) {
          return;
        }

        const cartData = localStorage.getItem("cart");
        if (!cartData) return;

        const cart = JSON.parse(cartData);
        if (!Array.isArray(cart)) return;

        const cartWithDetails = cart
          .map((cartItem) => {
            const productDetails = productsData.find(
              (p) => p.id === cartItem.id
            );
            if (productDetails) {
              return {
                ...productDetails,
                quantity: cartItem.quantity,
                currentPrice: productDetails.price,
              };
            }
            return null;
          })
          .filter(Boolean);

        setProducts(cartWithDetails);
      } catch {
        // Ошибка загрузки корзины
      }
    };

    loadCartWithProductData();
  }, [productsData]);

  const updateQuantity = (id, change) => {
    setProducts((prev) => {
      const newProducts = prev
        .map((product) => {
          if (product.id === id) {
            const newQuantity = Math.max(0, product.quantity + change);
            if (newQuantity === 0) return null;
            return { ...product, quantity: newQuantity };
          }
          return product;
        })
        .filter(Boolean);

      // Сохраняем в localStorage
      const cartToSave = newProducts.map((p) => ({
        id: p.id,
        quantity: p.quantity,
      }));
      localStorage.setItem("cart", JSON.stringify(cartToSave));

      return newProducts;
    });
  };

  const removeProduct = (id) => {
    setProducts((prev) => {
      const newProducts = prev.filter((p) => p.id !== id);

      // Сохраняем в localStorage
      const cartToSave = newProducts.map((p) => ({
        id: p.id,
        quantity: p.quantity,
      }));
      localStorage.setItem("cart", JSON.stringify(cartToSave));

      return newProducts;
    });
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (total, product) =>
        total + (product.currentPrice || product.price || 0) * product.quantity,
      0
    );
  };

  const calculateDiscount = () => {
    if (isPromoValid) {
      return calculateSubtotal() * 0.1;
    }
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return Number(subtotal.toFixed(2));
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (promoCode === "ilovereact") {
      setIsPromoValid(true);
    } else {
      setIsPromoValid(false);
    }
  };

  const handleCheckout = () => {
    const orderData = {
      items: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number((p.currentPrice || p.price || 0).toFixed(2)),
        quantity: p.quantity,
      })),
      promoCode: isPromoValid ? "ilovereact" : "",
      discount: Number(calculateDiscount().toFixed(2)),
      deliveryPrice: 15,
      finalPrice: Number(
        (calculateSubtotal() - calculateDiscount() + 15).toFixed(2)
      ),
    };

    // ✅ Выводим даже если корзина пустая
    console.log("Your order:", orderData);
  };

  // Вычисляем цены (оставляем старые названия для YourOrder компонента)
  const orderPrice = calculateTotal();
  const totalWithDelivery = Number((orderPrice - calculateDiscount() + 15).toFixed(2));


  return (
    <div className="container">
      <div className="cart" data-testid="cart-page">
        <div className="order-wrapper">
          <CartList
            products={products}
            onUpdateQuantity={updateQuantity}
            onRemove={removeProduct}
          />

          {products.length > 0 && (
            <YourOrder
              subtotal={orderPrice}
              discount={calculateDiscount()}
              delivery={15}
              total={totalWithDelivery}
              isPromoValid={isPromoValid}
              onCheckout={handleCheckout}
            />
          )}
        </div>

        <PromoCode
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          onSubmit={handlePromoSubmit}
          isPromoValid={isPromoValid}
        />
      </div>
    </div>
  );
};

export default Cart;
