import { useState } from 'react';
import { HomePage } from '../pages/HomePage';
import { AdminPage } from '../pages/AdminPage';
import { ImageTest } from '../pages/ImageTest';
import { PostsPage } from '../pages/PostsPage';

type Page = 'home' | 'admin' | 'imagetest' | 'posts';

export const Router = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  switch (currentPage) {
    case 'admin':
      return <AdminPage onBack={() => navigateTo('home')} />;
    case 'imagetest':
      return <ImageTest onBack={() => navigateTo('home')} />;
    case 'posts':
      return <PostsPage onBack={() => navigateTo('home')} />;
    case 'home':
    default:
      return (
        <HomePage
          onNavigateToAdmin={() => navigateTo('admin')}
          onNavigateToImageTest={() => navigateTo('imagetest')}
          onNavigateToPosts={() => navigateTo('posts')}
        />
      );
  }
};
