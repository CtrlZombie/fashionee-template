import React, { useState, useEffect } from "react";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import Shop from "./components/Shop/Shop";
import Cart from "./components/Cart/Cart";
import ContentBlock from "./components/common/ContentBlock/ContentBlock";
import { useApp, AppProvider } from "./context/AppContext";
import "./components/common/Commons.css";

const AppContent = () => {
  const { currentPage, setCurrentPage, cartCount, favoritesCount } = useApp();
  const [products, setProducts] = useState([]);

  // Загрузка товаров
  useEffect(() => {
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.products) {
          setProducts(data.products);
        }
      });
  }, []);

  // ОБРАБОТЧИКИ ДЛЯ HEADER
  const handleCartClick = () => {
    setCurrentPage("cart");
  };

  const handleSearchClick = () => {
    //console.log("Search clicked");
  };

  const handleProfileClick = () => {
   // console.log("Profile clicked");
  };

  const handleFavoritesClick = () => {
    //console.log("Favorites clicked");
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

      <ContentBlock />

      <main className="main-content">
        {currentPage === "shop" ? <Shop products={products} /> : <Cart />}
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
