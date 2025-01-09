import React from 'react';
import { Clock, User, ThumbsUp, Eye } from 'lucide-react';
import { News } from '../db/types';
import dbOperations from '../db/database';
import { Link } from 'react-router-dom';

interface NewsListProps {
  news: News[];
  onNewsUpdated: () => void;
}

export default function NewsList({ news, onNewsUpdated }: NewsListProps) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLike = async (e: React.MouseEvent, newsId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    
    await dbOperations.toggleLike(user.id, newsId);
    onNewsUpdated();
  };

  return (
    <div className="space-y-6">
      {news.map((item) => (
        <article 
          key={item.id} 
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold mb-2">{item.title}</h2>
          <p className="text-gray-600 mb-4">{item.content}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link 
              to={`/profile/${item.author_id}`} 
              className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            >
              <User size={16} />
              <span>{item.author_username}</span>
            </Link>
            
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
            </div>

            <button 
              onClick={(e) => handleLike(e, item.id)}
              className={`flex items-center gap-1 ${
                item.isLiked ? 'text-blue-500' : 'hover:text-blue-500'
              } transition-colors`}
              disabled={!user}
            >
              <ThumbsUp size={16} />
              <span>{item.likes_count}</span>
            </button>

            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{item.views_count}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}