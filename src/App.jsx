import React from 'react';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import Shop from './components/Shop/Shop';
import Cart from './components/Cart/Cart';
import ContentBlock from './components/common/ContentBlock/ContentBlock';
import { useApp, AppProvider } from './context/AppContext'; 

const AppContent = () => {
  const { currentPage, setCurrentPage, cartCount, favoritesCount } = useApp();

  const handleCartClick = () => {
    setCurrentPage('cart');
  };

  const handleSearchClick = () => {
    console.log('Search clicked');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleFavoritesClick = () => {
    console.log('Favorites clicked');
  };

  const getPageTitle = () => {
    return currentPage === 'shop' ? 'Shop' : 'Cart';
  };

  return (
    <div className="app">
      <Header
        cartItemsCount={cartCount}
        favoriteItemsCount={favoritesCount}
        onCartClick={handleCartClick}
        onSearchClick={handleSearchClick}
        onProfileClick={handleProfileClick}
        onFavoritesClick={handleFavoritesClick}
      />
      
      <ContentBlock
        title={getPageTitle()}
        currentPage={getPageTitle()}
        onTitleClick={() => setCurrentPage('shop')}
      />
      
      <main className="main-content">
        {currentPage === 'shop' ? <Shop /> : <Cart />}
      </main>
      
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;