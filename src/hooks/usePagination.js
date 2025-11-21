import { useState, useMemo } from 'react';

export const usePagination = (items = [], itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Гарантируем, что items — массив
  const safeItems = Array.isArray(items) ? items : [];

  // ✅ Пересчитываем количество страниц
  const totalPages = Math.ceil(safeItems.length / itemsPerPage);

  // ✅ Сбрасываем страницу на 1 при изменении items (без useEffect)
  const resetPagination = () => setCurrentPage(1);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return safeItems.slice(startIndex, startIndex + itemsPerPage);
  }, [safeItems, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    resetPagination, // ✅ Добавляем функцию для ручного сброса
  };
};