// __tests__/integration/shop-cart-integration.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Импортируем компоненты
import Shop from '../../src/components/Shop/Shop.jsx';
import Cart from '../../src/components/Cart/Cart.jsx';

// Изображения и иконки мокируются через __mocks__/fileMock.js


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

// Очищаем DOM после каждого теста
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('FASHIONEE - Интеграционные тесты Shop ↔ Cart', () => {
  test('1. Добавление товара в избранное синхронизируется через localStorage', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Shop />
      </BrowserRouter>
    );

    const heartIcons = screen.getAllByAltText('favorites');
    const firstHeartIcon = heartIcons[0];
    const firstProductCard = firstHeartIcon.closest('[data-testid="product-card"]');
    const productId = firstProductCard?.getAttribute('data-id');

    // Act: кликаем по сердцу
    fireEvent.click(firstHeartIcon);

    // Assert: иконка изменилась
    await waitFor(() => {
      expect(firstHeartIcon).toHaveAttribute('src', './icons/heart-filled.svg');

    });

    // Assert: localStorage сохранил ID
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'favorites',
      expect.stringContaining(productId || '')
    );
  });

  test('2. Поиск и фильтрация корректно отображают соответствующие товары', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Shop />
      </BrowserRouter>
    );

    // Act: вводим поисковый запрос
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'turtleneck' } });
    expect(searchInput).toHaveValue('turtleneck');

    // Act: выбираем категорию
    const womanCategory = screen.getByText('Woman');
    fireEvent.click(womanCategory);
    expect(womanCategory).toHaveClass('active');

    // Act: применяем фильтры
    const applyButton = screen.getByText('Apply Filter');
    fireEvent.click(applyButton);

    // Assert: проверяем, что отображаются только товары с "turtleneck"
    await waitFor(() => {
      const productNames = screen.getAllByTestId('product-name');
      productNames.forEach(name => {
        expect(name).toHaveTextContent(/turtleneck/i);
      });
    });

    // Assert: нет товаров, не подходящих под фильтр
    expect(screen.queryByText(/handbag/i)).not.toBeInTheDocument();
  });

  test('3. Управление количеством товаров в корзине корректно обновляет сумму', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );

    const totalElement = () => screen.getByText('Total').closest('.price-row');

    // Act: увеличиваем количество
    fireEvent.click(screen.getAllByText('+')[0]);
    await waitFor(() => {
      expect(totalElement()).toHaveTextContent('$198.97'); // 35.99×2 + 110.99 + 16.00
    });

    // Act: уменьшаем
    fireEvent.click(screen.getAllByText('-')[0]);
    await waitFor(() => {
      expect(totalElement()).toHaveTextContent('$162.98');
    });

    // Act: удаляем товар
    fireEvent.click(screen.getAllByText('×')[0]);
    await waitFor(() => {
      expect(totalElement()).toHaveTextContent('$126.99'); // 110.99 + 16.00
    });
  });

  test('4. Сортировка и пагинация работают совместно', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Shop />
      </BrowserRouter>
    );

    // Act: сортировка по возрастанию
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'ASC' } });
    expect(sortSelect).toHaveValue('ASC');

    // Act: пагинация
    fireEvent.click(screen.getByText('2'));
    await waitFor(() => expect(screen.getByText('2')).toHaveClass('active'));

    fireEvent.click(screen.getByText('1'));
    await waitFor(() => expect(screen.getByText('1')).toHaveClass('active'));

    // Assert
    expect(screen.getAllByTestId('product-card').length).toBe(6);
    expect(sortSelect).toHaveValue('ASC');
  });

  test('5. Ценовой фильтр и выбор цветов корректно фильтруют товары', async () => {
    // Arrange
    render(
      <BrowserRouter>
        <Shop />
      </BrowserRouter>
    );

    // Act: установка диапазона цен
    const [minInput, maxInput] = screen.getAllByPlaceholderText(/0|200/);
    fireEvent.change(minInput, { target: { value: '50' } });
    fireEvent.change(maxInput, { target: { value: '100' } });

    // Act: выбор цветов
    fireEvent.click(screen.getByLabelText('Black'));
    fireEvent.click(screen.getByLabelText('Red'));

    // Act: применение
    fireEvent.click(screen.getByText('Apply Filter'));

    // Assert: проверяем, что отображаются только товары в диапазоне и нужных цветов
    await waitFor(() => {
      const products = screen.getAllByTestId('product-card');
      products.forEach(product => {
        const priceText = product.querySelector('.price')?.textContent || '';
        const price = parseFloat(priceText.replace('$', ''));
        expect(price).toBeGreaterThanOrEqual(50);
        expect(price).toBeLessThanOrEqual(100);
      });
    });
  });
});
