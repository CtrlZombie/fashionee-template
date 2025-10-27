import React from "react";
import "./Header.css";

const Header = ({
  cartItemsCount = 0,
  favoriteItemsCount = 0,
  onCartClick = () => {},
  onFavoritesClick = () => {},
  onSearchClick = () => {},
  onProfileClick = () => {},
}) => {
  return (
    <header className="header" data-testid="header">
      <div className="left-side">
        <div className="logo-container">
          <div className="burger-menu">
            <input
              type="checkbox"
              id="burger-checkbox"
              className="burger-checkbox"
            />
            <label className="burger" htmlFor="burger-checkbox"></label>
          </div>
          <div className="logo">
            <img src="/icons/logo.svg" alt="logo" />
          </div>
        </div>
        <div className="menu">
          <div className="menu-item">
            <span>Home</span>
          </div>
          <div className="menu-item">
            <span>Pages</span>
            <img src="/icons/arrow.svg" alt="arrow" className="arrow-default" />
            <img
              src="/icons/arrow-pink.svg"
              alt="arrow"
              className="arrow-hover"
            />
          </div>
          <div className="menu-item active">
            <span>Shop</span>
            <img src="/icons/arrow.svg" alt="arrow" className="arrow-default" />
            <img
              src="/icons/arrow-pink.svg"
              alt="arrow"
              className="arrow-hover"
            />
          </div>
          <div className="menu-item">
            <span>Blog</span>
          </div>
          <div className="menu-item">
            <span>Contact</span>
          </div>
        </div>
      </div>
      <div className="right-side">
        <div className="header-icon" onClick={onSearchClick}>
          <img src="/icons/search.svg" alt="search" />
        </div>

        <div className="header-icon" onClick={onProfileClick}>
          <img src="/icons/profile.svg" alt="profile" />
        </div>

        <div className="header-icon" onClick={onFavoritesClick}>
          <img src="/icons/heart.svg" alt="favorites" />
          {favoriteItemsCount > 0 && (
            <div className="counter">{favoriteItemsCount}</div>
          )}
        </div>

        <div className="header-icon" onClick={onCartClick}>
          <img src="/icons/cart.svg" alt="cart" />
          {cartItemsCount > 0 && (
            <div className="counter">{cartItemsCount}</div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
