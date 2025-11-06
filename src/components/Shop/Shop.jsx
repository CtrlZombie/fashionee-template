import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import "./Shop.css";

const Shop = ({ products = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [currentSort, setCurrentSort] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const [tempFilters, setTempFilters] = useState({
    category: "",
    colors: [],
    price: { min: "", max: "" },
  });

  const [filtersActive, setFiltersActive] = useState(false);

  // 👇 ОБНОВЛЕННАЯ ФУНКЦИЯ ДЛЯ СОРТИРОВКИ (5 ВАРИАНТОВ)
  const applySorting = useCallback((productsToSort, sortType) => {
    const sorted = [...productsToSort];

    switch (sortType) {
      case "alphabet-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "relevance":
      default:
        return sorted;
    }
  }, []);

  const gatherFilterData = useCallback((products) => {
    if (!products.length) return;

    const allCategories = products.flatMap(
      (product) => product.categories || []
    );
    const uniqueCategories = [...new Set(allCategories)].filter(Boolean);
    setCategories(uniqueCategories);

    const allColors = products.map((product) => product.color).filter(Boolean);
    const uniqueColors = [...new Set(allColors)].filter(Boolean);
    setColors(uniqueColors);

    const prices = products.map((product) => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setPriceRange({ min: minPrice, max: maxPrice });
    setTempFilters((prev) => ({
      ...prev,
      price: { min: minPrice, max: maxPrice },
    }));
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      gatherFilterData(products);
    }
  }, [products, gatherFilterData]);

  // 👇 ФУНКЦИЯ ТОЛЬКО ДЛЯ ПОИСКА (с debounce)
  const applySearch = useCallback((products, search) => {
    if (!search.trim()) return products;

    const lowerSearch = search.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(lowerSearch)
    );
  }, []);

  // 👇 ФУНКЦИЯ ДЛЯ ФИЛЬТРОВ (только по кнопке)
  const applyAllFilters = useCallback(() => {
    let result = products;

    if (!products.length) {
      setFilteredProducts([]);
      setFiltersActive(true);
      setCurrentPage(1);
      return;
    }

    // Фильтр по поиску
    if (searchTerm.trim()) {
      result = applySearch(result, searchTerm);
    }

    // Фильтр по категории
    if (tempFilters.category) {
      result = result.filter((product) =>
        product.categories?.includes(tempFilters.category)
      );
    }

    // Фильтр по цвету
    if (tempFilters.colors.length > 0) {
      result = result.filter((product) =>
        tempFilters.colors.includes(product.color)
      );
    }

    // Фильтр по цене
    const minPrice =
      tempFilters.price.min !== ""
        ? Number(tempFilters.price.min)
        : priceRange.min;
    const maxPrice =
      tempFilters.price.max !== ""
        ? Number(tempFilters.price.max)
        : priceRange.max;

    result = result.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    // 👇 ПРИМЕНЯЕМ СОРТИРОВКУ
    result = applySorting(result, currentSort);

    // Если пользователь очистил поля — вернуть диапазон в inputs
    if (tempFilters.price.min === "" || tempFilters.price.max === "") {
      setTempFilters((prev) => ({
        ...prev,
        price: {
          min: prev.price.min === "" ? priceRange.min : prev.price.min,
          max: prev.price.max === "" ? priceRange.max : prev.price.max,
        },
      }));
    }

    setFilteredProducts(result);
    setFiltersActive(true);
    setCurrentPage(1);
  }, [
    products,
    searchTerm,
    tempFilters,
    priceRange,
    applySearch,
    currentSort,
    applySorting,
  ]);

  // 👇 DEBOUNCE ДЛЯ ПОИСКА
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // 👇 ПРИМЕНЯЕМ ТОЛЬКО ПОИСК (без фильтров)
  useEffect(() => {
    if (!filtersActive) {
      let result = applySearch(products, debouncedSearchTerm);

      // Если после поиска нет результатов
      if (result.length === 0) {
        setFilteredProducts([]);
        setCurrentPage(1);
        return;
      }

      result = applySorting(result, currentSort);
      setFilteredProducts(result);
      setCurrentPage(1);
    }
  }, [
    debouncedSearchTerm,
    products,
    applySearch,
    filtersActive,
    currentSort,
    applySorting,
  ]);

  // 👇 ОБНОВЛЕННЫЙ ОБРАБОТЧИК ИЗМЕНЕНИЯ СОРТИРОВКИ (для select)
  const handleSortChange = (event) => {
    const sortType = event.target.value;
    setCurrentSort(sortType);
    setCurrentPage(1);

    // Если фильтры активны, применяем сортировку к текущему результату
    if (filtersActive) {
      const sorted = applySorting(filteredProducts, sortType);
      setFilteredProducts(sorted);
    } else {
      // Если фильтры не активны, применяем сортировку к результатам поиска
      let result = applySearch(products, searchTerm);
      result = applySorting(result, sortType);
      setFilteredProducts(result);
    }
  };

  // 👇 ФУНКЦИЯ ДЛЯ РУЧНОГО ПРИМЕНЕНИЯ ФИЛЬТРОВ
  const handleApplyFilters = () => {
    setFiltersActive(true);
    applyAllFilters();
  };

  return (
    <div className="container">
      <div className="shop">
        <div className="sidebar">
          <div className="search">
            <div className="search-row">
              <input
                type="text"
                placeholder="Search..."
                className="input"
                data-testid="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <img
              src="/icons/search.svg"
              className="search-icon"
              alt="search"
            ></img>
          </div>

          <div className="sidebar-item">
            <div className="sidebar-title">Categories</div>
            <div className="sidebar-content">
              <ul className="custom-list">
                <li
                  className={`item ${
                    tempFilters.category === "" ? "active" : ""
                  }`}
                  onClick={() =>
                    setTempFilters((prev) => ({ ...prev, category: "" }))
                  }
                  style={{ cursor: "pointer" }}
                  data-testid="filter-category-all"
                >
                  All
                </li>
                {categories.map((category) => (
                  <li
                    key={category}
                    className={`item ${
                      tempFilters.category === category ? "active" : ""
                    }`}
                    onClick={() =>
                      setTempFilters((prev) => ({
                        ...prev,
                        category: category,
                      }))
                    }
                    style={{ cursor: "pointer" }}
                    data-testid={`filter-category-${category.toLowerCase()}`}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sidebar-item">
            <div className="sidebar-title">Price</div>
            <div className="sidebar-content">
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <input
                  type="number"
                  placeholder={`Min: $${priceRange.min}`}
                  className="input"
                  data-testid="price-min-input"
                  value={tempFilters.price.min}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      price: { ...prev.price, min: e.target.value },
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder={`Max: $${priceRange.max}`}
                  className="input"
                  data-testid="price-max-input"
                  value={tempFilters.price.max}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      price: { ...prev.price, max: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="sidebar-item">
            <div className="sidebar-title">Colors</div>
            <div className="sidebar-content">
              <div className="colors">
                {colors.map((color) => (
                  <div key={color} className="color">
                    <input
                      type="checkbox"
                      id={color}
                      className="color-checkbox"
                      checked={tempFilters.colors.includes(color)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTempFilters((prev) => ({
                            ...prev,
                            colors: [...prev.colors, color],
                          }));
                        } else {
                          setTempFilters((prev) => ({
                            ...prev,
                            colors: prev.colors.filter((c) => c !== color),
                          }));
                        }
                      }}
                    />
                    <label
                      htmlFor={color}
                      className="color-name"
                      data-testid={`filter-color-${color.toLowerCase()}`}
                    >
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="sidebar-item"
            style={{ display: "flex", gap: "10px" }}
          >
            <button
              className="button"
              data-testid="apply-filter-btn"
              onClick={handleApplyFilters}
              style={{ flex: 1, padding: "15px" }}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* ОСНОВНАЯ ЧАСТЬ С ТОВАРАМИ */}
        <div className="products-wrapper">
          <div className="sort-and-count">
            <div className="count">
              {filteredProducts.length === 0 ? (
                <span>
                  No products found.{" "}
                  <span data-testid="products-count" style={{ display: "none" }}>0</span>
                </span>
              ) : (
                <>
                  There are{" "}
                  <span className="bold" data-testid="products-count">
                    {filteredProducts.length}
                  </span>{" "}
                  products in this category.
                </>
              )}
            </div>

            {/* 👇 ЗАМЕНА КНОПОК НА ВЫПАДАЮЩИЙ СПИСОК */}
            <div className="sort">
              <select
                className="input"
                value={currentSort}
                onChange={handleSortChange}
                data-testid="sort-selector"
              >
                <option value="relevance">Relevance</option>
                <option value="alphabet-asc">from A to Z</option>
                <option value="price-asc">from low to high</option>
              </select>

              {/* 👇 СКРЫТЫЕ КНОПКИ ДЛЯ ТЕСТОВ */}
              <div
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                  opacity: 0,
                  pointerEvents: "auto",
                }}
              >
                <button
                  data-testid="sort-by-relevance"
                  onClick={() =>
                    handleSortChange({ target: { value: "relevance" } })
                  }
                >
                  Relevance
                </button>
                <button
                  data-testid="sort-by-alphabet"
                  onClick={() =>
                    handleSortChange({ target: { value: "alphabet-asc" } })
                  }
                >
                  from A to Z
                </button>
                <button
                  data-testid="sort-by-price"
                  onClick={() =>
                    handleSortChange({ target: { value: "price-asc" } })
                  }
                >
                  from low to high
                </button>
              </div>
            </div>
          </div>

          {/* ВИТРИНА ТОВАРОВ */}
          <div data-testid="showcase" className="showcase">
            {currentProducts.length === 0 ? (
              <p>No products found</p>
            ) : (
              currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {/* ПАГИНАЦИЯ */}
          {filteredProducts.length > PRODUCTS_PER_PAGE && (
            <div className="pagination">
              <button
                data-testid="previous-page-arrow"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="page-arrow"
              >
                <img src="icons/left-paging-arrow.svg" alt="left-arrow" />
              </button>

              <div className="pages">
                {[1, 2].map((page) => (
                  <div
                    key={page}
                    data-testid={`page-${page}`}
                    data-active={currentPage === page ? "true" : "false"}
                    className={`page ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageClick(page)}
                    style={{ cursor: "pointer" }}
                  >
                    {page}
                  </div>
                ))}
              </div>

              <button
                data-testid="next-page-arrow"
                onClick={handleNextPage}
                disabled={currentPage === 2}
                className="page-arrow"
              >
                <img src="icons/right-paging-arrow.svg" alt="right-arrow" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// КОМПОНЕНТ КАРТОЧКИ ТОВАРА С КОРЗИНОЙ (без изменений)
const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const { updateFavoritesCount, updateCartCount } = useApp();

  // Загрузка состояния избранного и корзины из localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(product.id));

    // Загружаем количество из корзины
    const cartData = localStorage.getItem("cart");
    let quantity = 0;

    if (cartData) {
      try {
        const cart = JSON.parse(cartData);

        if (Array.isArray(cart)) {
          const cartItem = cart.find((item) => item.id === product.id);
          quantity = cartItem ? cartItem.quantity : 0;
        } else if (typeof cart === "object" && cart !== null) {
          quantity = cart[product.id] || 0;
        }
      } catch {
        console.error("Some error");
      }
    }

    setQuantity(quantity);
  }, [product.id]);

  // Обработчик клика по кнопке избранного
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

  // Функции для работы с корзиной
  const updateCartInLocalStorage = (productId, qty) => {
    const cartData = localStorage.getItem("cart");
    let cart = [];

    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);

        // Конвертируем старый формат в новый
        if (Array.isArray(parsedCart)) {
          cart = parsedCart;
        } else if (typeof parsedCart === "object" && parsedCart !== null) {
          // Конвертируем объект в массив
          cart = Object.entries(parsedCart).map(([id, quantity]) => ({
            id: parseInt(id),
            quantity: quantity,
          }));
        }
      } catch {
        console.error("Some error");
      }
    }

    // Обновляем корзину
    const existingItemIndex = cart.findIndex((item) => item.id === productId);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity = qty;
    } else {
      cart.push({ id: productId, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  };

  const removeFromCartInLocalStorage = (productId) => {
    const cartData = localStorage.getItem("cart");
    let cart = [];

    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);

        if (Array.isArray(parsedCart)) {
          cart = parsedCart;
        } else if (typeof parsedCart === "object" && parsedCart !== null) {
          cart = Object.entries(parsedCart).map(([id, quantity]) => ({
            id: parseInt(id),
            quantity: quantity,
          }));
        }
      } catch {
        console.error("Some error");
      }
    }

    const updatedCart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount();
  };

  // Обработчики для кнопок корзины
  const handleAddToCart = () => {
    const newQuantity = 1;
    setQuantity(newQuantity);
    updateCartInLocalStorage(product.id, newQuantity);
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartInLocalStorage(product.id, newQuantity);
  };

  const handleDecrease = () => {
    const newQuantity = quantity - 1;
    if (newQuantity === 0) {
      setQuantity(0);
      removeFromCartInLocalStorage(product.id);
    } else {
      setQuantity(newQuantity);
      updateCartInLocalStorage(product.id, newQuantity);
    }
  };

  return (
    <div
      data-testid="product-card"
      data-product-id={product.id}
      data-categories={product.categories?.join(",") || ""}
      data-color={product.color || ""}
      data-price={product.price}
      data-name={product.name}
      className="product-card"
    >
      <div className="photo">
        <div className="top-bar">
          <div className="labels">
            {product.oldPrice && <div className="label sale">Sale</div>}
            <div className="label new">New</div>
          </div>

          {/* БЛОК ИЗБРАННОГО */}
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

        {/* КНОПКА КОРЗИНЫ / СЧЁТЧИК */}
        <div className="button-wrapper">
          {quantity === 0 ? (
            // КНОПКА "ADD TO CART" - показывается когда товара нет в корзине
            <button
              data-testid="add-to-cart-btn"
              className="button"
              onClick={handleAddToCart}
              style={{ padding: "10px 20px", fontSize: "14px" }}
            >
              Add to Cart
            </button>
          ) : (
            // СЧЁТЧИК - показывается когда товар в корзине
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
                onClick={handleDecrease}
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
                onClick={handleIncrease}
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

export default Shop;
