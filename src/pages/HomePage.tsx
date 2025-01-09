import React, { useEffect, useState } from 'react';
import { News } from '../db/types';
import { useAuth } from '../context/AuthContext';
import dbOperations from '../db/database';
import NewsList from '../components/NewsList';
import NewsForm from '../components/NewsForm';

export default function HomePage() {
  const [news, setNews] = useState<News[]>([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [viewsIncremented, setViewsIncremented] = useState(false);

  const loadNews = async () => {
    try {
      const allNews = await dbOperations.getAllNews(user?.id);
      setNews(allNews);
      
      // Only increment views once when the page loads
      if (!viewsIncremented) {
        for (const item of allNews) {
          await dbOperations.incrementNewsViews(item.id);
        }
        setViewsIncremented(true);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {user && <NewsForm onNewsCreated={loadNews} />}
      <NewsList news={news} onNewsUpdated={loadNews} />
    </div>
  );
}