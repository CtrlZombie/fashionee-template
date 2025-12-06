import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from '../Cart';

// Мокаем CSS импорт
jest.mock('../Cart.css', () => ({}));

describe('Cart Component - Critical Business Logic', () => {
  
  test('Правильно рассчитывает итоговую сумму с учетом доставки', () => {
    render(<Cart />);
    
    // Ищем элемент с текстом "Total" и проверяем родителя
    const totalElement = screen.getByText('Total').closest('.price-row');
    expect(totalElement).toHaveTextContent('$162.98');
  });

  test('Обновляет сумму при изменении количества товаров', () => {
    render(<Cart />);
    
    // Находим все кнопки "+"
    const increaseButtons = screen.getAllByText('+');
    fireEvent.click(increaseButtons[0]);
    
    const totalElement = screen.getByText('Total').closest('.price-row');
    expect(totalElement).toHaveTextContent('$198.97');
  });

  test('Удаляет товар из корзины и пересчитывает сумму', () => {
    render(<Cart />);
    
    const deleteButtons = screen.getAllByText('×');
    fireEvent.click(deleteButtons[0]);
    
    const totalElement = screen.getByText('Total').closest('.price-row');
    expect(totalElement).toHaveTextContent('$126.99');
    expect(screen.queryByText('Fashionee - cotton shirt (S)')).not.toBeInTheDocument();
  });
});

describe('Cart Component - User Experience', () => {
  test('Корзина отображается с правильным data-testid', () => {
    render(<Cart />);
    const cartPage = screen.getByTestId('cart-page');
    expect(cartPage).toBeInTheDocument();
  });
});