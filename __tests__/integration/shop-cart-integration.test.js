// __tests__/integration/shop-cart-integration.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Импортируем компоненты
import Shop from '../../src/components/Shop/Shop.jsx';
import Cart from '../../src/components/Cart/Cart.jsx';

// Моки изображений — обрабатываются через __mocks__/fileMock.js
// Моки CSS
jest.mock('../../src/components/Shop/Shop.css', () => ({}));
jest.mock('../../src/components/Cart/Cart.css', () => ({}));

// Мок localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('FASHIONEE - Интеграционные тесты Shop ↔ Cart', () => {
  test('2. Поиск и фильтрация корректно отображают соответствующие товары', async () => {
    render(
      <BrowserRouter>
        <Shop />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'turtleneck' } });
    expect(searchInput).toHaveValue('turtleneck');

    const womanCategory = screen.getByText('Woman');
    fireEvent.click(womanCategory);
    expect(womanCategory).toHaveClass('active');

    const applyButton = screen.getByText('Apply Filter');
    fireEvent.click(applyButton);

    await waitFor(() => {
      const productNames = screen.getAllByTestId('product-name');
      productNames.forEach(name => {
        expect(name).toHaveTextContent(/turtleneck/i);
      });
    });
  });

  test('3. Управление количеством товаров в корзине корректно обновляет сумму', async () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    const totalElement = () => screen.getByText('Total').closest('.price-row');

    fireEvent.click(screen.getAllByText('+')[0]);
    await waitFor(() => {
      expect(totalElement()).toHaveTextContent('$198.97');
    });

    fireEvent.click(screen.getAllByText('-')[0]);
    await waitFor(() => {
      expect(totalElement()).toHaveTextContent('$162.98');
    });

    fireEvent.click(screen.getAllByText('×')[0]);
    await waitFor(() => {
      expect(totalElement()).toHaveTextContent('$126.99');
    });
  });
});
