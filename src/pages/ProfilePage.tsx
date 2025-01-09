import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../db/types';
import dbOperations from '../db/database';
import { FileText, Eye, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      if (id) {
        try {
          const userData = await dbOperations.getUserProfile(parseInt(id));
          setProfile(userData);
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadProfile();
  }, [id]);

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800">Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{profile.username}'s Profile</h1>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar size={16} />
            Joined {new Date(profile.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-blue-500" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Published Posts</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{profile.published_count}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="text-green-500" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Total Views</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{profile.total_views}</p>
          </div>
        </div>
      </div>
    </div>
  );
}