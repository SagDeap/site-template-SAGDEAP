// Database types
export interface User {
  id: number;
  username: string;
  created_at: string;
  views_count?: number;
}

export interface UserProfile extends User {
  published_count: number;
  total_views: number;
}

export interface News {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_username?: string;
  created_at: string;
  likes_count: number;
  views_count: number;
  isLiked?: boolean;
}