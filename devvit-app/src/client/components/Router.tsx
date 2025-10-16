import { useState } from 'react';
import { HomePage } from '../pages/HomePage';
import { AdminPage } from '../pages/AdminPage';

type Page = 'home' | 'admin';

export const Router = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  switch (currentPage) {
    case 'admin':
      return <AdminPage onBack={() => navigateTo('home')} />;
    case 'home':
    default:
      return <HomePage onNavigateToAdmin={() => navigateTo('admin')} />;
  }
};
