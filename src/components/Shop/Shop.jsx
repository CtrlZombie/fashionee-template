import React, { useState } from 'react';
import './Shop.css';

const Shop = () => {
  // Состояние для фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Men');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState('RELEVANCE');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  // Данные категорий
  const categories = ['All', 'Men', 'Woman', 'Accessories', 'New Arrivals'];
  
  // Данные цветов
  const colors = [
    { id: 'black', name: 'Black' },
    { id: 'blue', name: 'Blue' },
    { id: 'red', name: 'Red' },
    { id: 'yellow', name: 'Yellow' },
    { id: 'green', name: 'Green' }
  ];

  // Данные просмотренных товаров
  const reviewedProducts = [
    {
      id: 1,
      name: 'Retro style handbag',
      currentPrice: 35.99,
      oldPrice: 52.99,
      image: './images/handbag.jpg'
    },
    {
      id: 2,
      name: 'Warm casual sweater',
      currentPrice: 35.99,
      oldPrice: null,
      image: './images/sweater.jpg'
    },
    {
      id: 3,
      name: 'Textured turtleneck with zip',
      currentPrice: 35.99,
      oldPrice: null,
      image: './images/turtleneck.jpg'
    }
  ];

  // Данные товаров
  const products = [
    {
      id: 1,
      name: 'Textured turtleneck with zip',
      currentPrice: 53.99,
      oldPrice: 52.99,
      image: './images/product1.jpg',
      labels: ['sale', 'new'],
      isFavorite: false
    },
    {
      id: 2,
      name: 'Textured turtleneck with zip',
      currentPrice: 53.99,
      oldPrice: 52.99,
      image: './images/product2.jpg',
      labels: ['sale', 'new'],
      isFavorite: false
    },
    {
      id: 3,
      name: 'Textured turtleneck with zip',
      currentPrice: 53.99,
      oldPrice: 52.99,
      image: './images/product3.jpg',
      labels: ['sale', 'new'],
      isFavorite: false
    },
    {
      id: 4,
      name: 'Textured turtleneck with zip',
      currentPrice: 53.99,
      oldPrice: 52.99,
      image: './images/product4.jpg',
      labels: ['sale', 'new'],
      isFavorite: false
    },
    {
      id: 5,
      name: 'Textured turtleneck with zip',
      currentPrice: 53.99,
      oldPrice: 52.99,
      image: './images/product5.jpg',
      labels: ['sale', 'new'],
      isFavorite: false
    },
    {
      id: 6,
      name: 'Textured turtleneck with zip',
      currentPrice: 53.99,
      oldPrice: 52.99,
      image: './images/product6.jpg',
      labels: ['sale', 'new'],
      isFavorite: false
    }
  ];

  // Обработчики
  const handleColorChange = (colorId) => {
    setSelectedColors(prev =>
      prev.includes(colorId)
        ? prev.filter(color => color !== colorId)
        : [...prev, colorId]
    );
  };

  const handleApplyFilter = () => {
    console.log('Applied filters:', {
      searchTerm,
      selectedCategory,
      priceRange,
      selectedColors
    });
    // Здесь будет логика применения фильтров
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="shop">
      <div className="sidebar">
        {/* Поиск */}
        <div className="search">
          <label>
            <input
              type="text"
              placeholder="Search"
              className="search-row input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img src="./icons/search.svg" alt="Search Icon" className="search-icon" />
          </label>
        </div>

        {/* Категории */}
        <div className="sidebar-item">
          <div className="sidebar-title">Categories</div>
          <div className="sidebar-content">
            <ul className="custom-list">
              {categories.map(category => (
                <li
                  key={category}
                  className={`item ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Цена */}
        <div className="sidebar-item">
          <div className="sidebar-title">Price</div>
          <div className="sidebar-content">
            <div className="price-bar">
              <input
                type="text"
                placeholder="0"
                className="input"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
              <input
                type="text"
                placeholder="200"
                className="input"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Цвета */}
        <div className="sidebar-item">
          <div className="sidebar-title">Colors</div>
          <div className="sidebar-content">
            <div className="colors">
              {colors.map(color => (
                <div key={color.id} className="color">
                  <input
                    type="checkbox"
                    className="color-checkbox"
                    id={color.id}
                    name={color.id}
                    value={color.id}
                    checked={selectedColors.includes(color.id)}
                    onChange={() => handleColorChange(color.id)}
                  />
                  <label htmlFor={color.id} className="color-name">
                    {color.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Кнопка применения фильтра */}
        <div className="sidebar-item">
          <div className="button-wrapper">
            <button className="button" onClick={handleApplyFilter}>
              Apply Filter
            </button>
            <div className="vertical-line"></div>
          </div>
        </div>

        {/* Просмотренные товары */}
        <div className="sidebar-item">
          <div className="sidebar-title">Reviewed by you</div>
          <div className="sidebar-content">
            <div className="reviewed-products">
              {reviewedProducts.map(product => (
                <div key={product.id} className="product">
                  <div className="image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="info">
                    <div className="name">{product.name}</div>
                    <div className="price">
                      <div className="current-price">${product.currentPrice.toFixed(2)}</div>
                      {product.oldPrice && (
                        <div className="old-price">${product.oldPrice.toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Баннер */}
        <div>
          <a href="#">
            <img src="./images/season-sale-banner.svg" alt="Season Sale Banner" />
          </a>
        </div>
      </div>

      {/* Основной контент с товарами */}
      <div className="products-wrapper">
        {/* Сортировка и количество */}
        <div className="sort-and-count">
          <div className="products-count">
            There are <span className="bold">67</span> products in this category
          </div>
          <div className="sort">
            <select 
              className="input" 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="RELEVANCE">Relevance</option>
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </div>
        </div>

        {/* Сетка товаров */}
        <div className="showcase" data-testid='showcase'>
          {products.map(product => (
            <div key={product.id} className="product-card" data-testid='product-card'>
              <div className="photo">
                <img src={product.image} alt={product.name} />
                <div className="top-bar">
                  <div className="labels">
                    {product.labels.includes('sale') && (
                      <div className="label sale">Sale</div>
                    )}
                    {product.labels.includes('new') && (
                      <div className="label new">New</div>
                    )}
                  </div>
                  <div 
                    className="favorites"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <img 
                      src={favorites.includes(product.id) ? "./icons/heart-filled.svg" : "./icons/heart.svg"} 
                      alt="favorites" 
                    />
                  </div>
                </div>
              </div>
              <div className="info">
                <div className="name" data-testid="product-name">{product.name}</div>
                <div className="price">
                  <div className="current-price">${product.currentPrice.toFixed(2)}</div>
                  {product.oldPrice && (
                    <div className="old-price">${product.oldPrice.toFixed(2)}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация */}
        <div className="pagination">
          <div 
            className="button left" 
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <img src="./icons/left-paging-arrow.svg" alt="left" />
          </div>
          <div className="pages">
            {[1, 2, 3].map(page => (
              <div
                key={page}
                className={`page ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </div>
            ))}
          </div>
          <div 
            className="button right"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <img src="./icons/right-paging-arrow.svg" alt="right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;