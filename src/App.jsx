// App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import Shop from "./components/Shop/Shop";
import Cart from "./components/Cart/Cart";
import ContentBlock from "./components/common/ContentBlock/ContentBlock";
import { useApp, AppProvider } from "./context/AppContext";
import productsData from "../public/products.json"; // ✅ Синхронный импорт
import "./components/common/Commons.css";

const AppContent = () => {
  const { currentPage, setCurrentPage, cartCount, favoritesCount } = useApp();
  const [products, setProducts] = useState([]);

  // Загружаем товары сразу
  useEffect(() => {
    if (productsData?.products?.length) {
      setProducts(productsData.products);
    }
  }, []);

  return (
    <div className="app">
      <Header
        cartItemsCount={cartCount}
        favoriteItemsCount={favoritesCount}
        onCartClick={() => setCurrentPage("cart")}
        onSearchClick={() => {}}
        onProfileClick={() => {}}
        onFavoritesClick={() => {}}
      />

      <ContentBlock />

      <main className="main-content">
        {currentPage === "shop" ? (
          <Shop products={products} />
        ) : (
          <Cart productsData={products} />
        )}
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
