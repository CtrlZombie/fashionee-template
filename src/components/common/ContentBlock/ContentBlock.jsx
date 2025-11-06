import React from 'react';
import { useApp } from '../../../context/AppContext';
import './ContentBlock.css';

const ContentBlock = () => {
  const { currentPage, setCurrentPage } = useApp();

  const getPageName = () => {
    return currentPage === 'shop' ? 'Shop' : 'Cart';
  };

  const getMenuItems = () => {
    if (currentPage === 'shop') {
      return [
        { name: 'Home', page: 'home' },
        { name: 'Shop', page: 'shop', active: true },
        { name: 'Cart', page: 'cart', active: true }
      ];
    } else {
      return [
        { name: 'Home', page: 'home' },
        { name: 'Shop', page: 'shop' },
        { name: 'Cart', page: 'cart', active: true }
      ];
    }
  };

  const handleMenuItemClick = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="content-block" data-testid="content-block">
      <div className="top-screen">
        <div className="big-balls-top">
          <img src="/icons/big-balls-top.svg" alt="Decoration" />
        </div>
        <div className="left-area">
          <div className="navigation-menu">
            <div className="page-name">{getPageName()}</div>
            {getMenuItems().map((item, index) => (
              <span 
                key={index}
                className={'menu-item'}
                onClick={() => handleMenuItemClick(item.page)}
                style={{ cursor: 'pointer' }}
                data-testid={
                  item.page === 'shop' ? 'shop-btn' : 
                  item.page === 'cart' ? 'cart-btn' : null 
                }
              >
                {item.name}
                {index < getMenuItems().length - 1 && ' '}
              </span>
            ))}
          </div>
        </div>
        <div className="right-area">
          <div className="banner"></div>
        </div>
      </div>
    </div>
  );
};

export default ContentBlock;