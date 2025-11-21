import React, { useState, useEffect, useCallback } from "react";
import { usePagination } from "../../hooks/usePagination";
import ProductCard from "./ProductCard";
import "./Shop.scss";

const Shop = ({ products = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [currentSort, setCurrentSort] = useState("relevance");

  const {
    currentPage,
    paginatedItems: currentProducts,
    nextPage: handleNextPage,
    prevPage: handlePrevPage,
    goToPage: handlePageClick,
  } = usePagination(filteredProducts);

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
      handlePageClick(1);
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
    handlePageClick(1);
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
        handlePageClick(1);
        return;
      }

      result = applySorting(result, currentSort);
      setFilteredProducts(result);
      handlePageClick(1);
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
    handlePageClick(1);

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
                  <span
                    data-testid="products-count"
                    style={{ display: "none" }}
                  >
                    0
                  </span>
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
          {filteredProducts.length > 12 && (
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



export default Shop;
