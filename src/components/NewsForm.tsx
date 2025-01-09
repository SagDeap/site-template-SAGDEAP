import React, { useState } from 'react';
import { PenSquare } from 'lucide-react';
import dbOperations from '../db/database';

export default function NewsForm({ onNewsCreated }: { onNewsCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setError('You must be logged in to create news');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const user = JSON.parse(userStr);
      await dbOperations.createNews(title, content, user.id);
      setTitle('');
      setContent('');
      onNewsCreated();
    } catch (err) {
      setError('Failed to create news');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <PenSquare size={24} />
        Create News
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 h-32"
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </div>
  );
}