import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, fetchNewRequestsCount } from '@/lib/firestore';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationBell = () => {
  const { currentUser } = useAuth();
  const [newRequestsCount, setNewRequestsCount] = useState(0);

  useEffect(() => {
    const checkForNewRequests = async () => {
      if (!currentUser) return;

      const profile = await getUserProfile(currentUser.uid);
      if (profile && profile.state && profile.lastCheckedNotifications) {
        const count = await fetchNewRequestsCount(profile.state, profile.lastCheckedNotifications);
        setNewRequestsCount(count);
      }
    };

    if (currentUser) {
      // Check for notifications shortly after the app loads
      const timer = setTimeout(checkForNewRequests, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  return (
    <Link to="/donate" className="relative">
      <Bell className="h-6 w-6" />
      {newRequestsCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </Link>
  );
};