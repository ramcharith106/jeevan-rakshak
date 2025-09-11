import { useEffect, useState } from 'react';
import { getToken } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { messaging, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from './button';
import { BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// IMPORTANT: Replace this with your own VAPID key from the Firebase console.
const VAPID_KEY = 'YOUR_VAPID_KEY_FROM_FIREBASE_CONSOLE';

export const NotificationManager = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [notificationStatus, setNotificationStatus] = useState(Notification.permission);

  const requestPermission = async () => {
    if (!currentUser) return;

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);

      if (permission === 'granted') {
        const currentToken = await getToken(messaging, {
          vapidKey: 'JoWGSeZgLFrpPtKFj8_NPm5OBUCZaRLIjs-p5jnHYJU'
        });

        if (currentToken) {
          // Save the token to the user's document in Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userDocRef, {
            fcmTokens: arrayUnion(currentToken), // Add token to an array
          });

          toast({
            title: '✅ Notifications Enabled',
            description: 'You will now receive alerts for new blood requests.',
          });
        } else {
          toast({
            title: 'Could not get notification token.',
            description: 'Please try again or check your browser settings.',
            variant: 'destructive',
          });
        }
      } else {
         toast({
            title: 'Notifications Denied',
            description: 'You can enable notifications from your browser settings later.',
            variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
       toast({
        title: 'An error occurred',
        description: 'Could not enable notifications.',
        variant: 'destructive',
      });
    }
  };

  // Render a button only if notifications are not yet granted
  if (notificationStatus === 'granted') {
    return <p className="text-sm text-green-600">✓ Notifications are enabled.</p>;
  }

  if (notificationStatus === 'denied') {
     return <p className="text-sm text-yellow-600">Notifications are disabled. Please enable them in your browser settings.</p>;
  }

  return (
    <Button onClick={requestPermission}>
      <BellRing className="mr-2 h-4 w-4" /> Enable Notifications
    </Button>
  );
};