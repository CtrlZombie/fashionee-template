import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { updateCartCount, updateFavoritesCount } = useApp();

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (!cartData) return;

    try {
      const cart = JSON.parse(cartData);
      let currentQuantity = 0;

      if (Array.isArray(cart)) {
        // Новый формат: массив объектов
        const item = cart.find((item) => item.id === product.id);
        if (item) currentQuantity = item.quantity;
      } else if (typeof cart === "object" && cart !== null) {
        // Старый формат: { "1": 2 }
        currentQuantity = cart[product.id] || 0;
      }

      setQuantity(currentQuantity);
    } catch {
      // Ошибка обработана
    }
  }, [product.id]);

  useEffect(() => {
    // Читаем избранное из localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    // Устанавливаем состояние, если товар в избранном
    if (favorites.includes(product.id)) {
      setIsFavorite(true);
    }
  }, [product.id]);

  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (newFavoriteState) {
      const updatedFavorites = [...favorites, product.id];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = favorites.filter((id) => id !== product.id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }

    updateFavoritesCount();
  };

  // 🟢 Добавить товар в корзину
  const addToCart = () => {
    const cartData = localStorage.getItem("cart");
    let cart = [];

    if (cartData) {
      try {
        const parsed = JSON.parse(cartData);
        if (Array.isArray(parsed)) {
          cart = parsed;
        } else if (typeof parsed === "object" && parsed !== null) {
          // Конвертируем старый формат в новый
          cart = Object.entries(parsed).map(([id, qty]) => ({
            id: Number(id),
            quantity: Number(qty),
          }));
        }
      } catch {
        // Ошибка обработана
      }
    }

    // Ищем товар в корзине
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: product.id, quantity: 1 });
    }

    // Сохраняем в localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantity((prev) => prev + 1);
    updateCartCount(); // Обновляем счётчик в хедере
  };

  // 🔴 Уменьшить количество
  const decreaseQuantity = () => {
    if (quantity <= 1) {
      // Удаляем товар полностью
      const cartData = localStorage.getItem("cart");
      if (!cartData) return;

      try {
        const cart = JSON.parse(cartData);
        let newCart = [];

        if (Array.isArray(cart)) {
          newCart = cart.filter((item) => item.id !== product.id);
        } else if (typeof cart === "object" && cart !== null) {
          const { [product.id]: _, ...rest } = cart;
          newCart = rest;
        }

        localStorage.setItem("cart", JSON.stringify(newCart));
        setQuantity(0);
        updateCartCount();
      } catch {
        // Ошибка обработана
      }
      return;
    }

    // Уменьшаем количество
    const cartData = localStorage.getItem("cart");
    if (!cartData) return;

    try {
      const cart = JSON.parse(cartData);
      if (Array.isArray(cart)) {
        const item = cart.find((item) => item.id === product.id);
        if (item) {
          item.quantity -= 1;
          localStorage.setItem("cart", JSON.stringify(cart));
          setQuantity((prev) => prev - 1);
          updateCartCount();
        }
      }
    } catch {
      // Ошибка обработана
    }
  };

  return (
    <div
      className="product-card"
      data-testid="product-card"
      data-product-id={product.id}
      data-categories={product.categories?.join(",")}
      data-color={product.color?.toLowerCase()}
      data-price={Number(product.price).toFixed(2)}
      data-name={product.name}
    >
      <div className="photo">
        <div className="top-bar">
          <div className="labels">
            {product.oldPrice && <div className="label sale">Sale</div>}
            <div className="label new">New</div>
          </div>
          <div className="favorites">
            <button
              data-testid="favorite-btn"
              data-active={isFavorite}
              onClick={handleFavoriteClick}
              className="favorite-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              <img
                src="/icons/heart.svg"
                alt="favorites"
                className="favorite-icon"
                style={{
                  filter: isFavorite
                    ? "brightness(0) saturate(100%) invert(60%) sepia(90%) saturate(500%) hue-rotate(300deg) brightness(100%) contrast(100%)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="info">
        <div className="name">{product.name}</div>
        <div className="price">
          <span className="current-price">${product.price}</span>
          {product.oldPrice && (
            <span className="old-price">${product.oldPrice}</span>
          )}
        </div>

        <div className="button-wrapper">
          {quantity === 0 ? (
            // КНОПКА "ADD TO CART"
            <button
              data-testid="add-to-cart-btn"
              className="button"
              onClick={addToCart}
              style={{ padding: "10px 20px", fontSize: "14px" }}
            >
              Add to Cart
            </button>
          ) : (
            // СЧЁТЧИК КОЛИЧЕСТВА
            <div
              className="quantity-counter"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <button
                data-testid="decrease-qty-btn"
                onClick={decreaseQuantity}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                -
              </button>

              <span
                data-testid="product-quantity"
                style={{
                  minWidth: "20px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {quantity}
              </span>

              <button
                data-testid="increase-qty-btn"
                onClick={addToCart}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
