// src/pages/TransmisionExterna/hooks/useScreenNotifications.ts

import { useState, useRef } from 'react';
import { ScreenNotification } from '../types/transmision.types';

export const useScreenNotifications = () => {
  const [screenNotifications, setScreenNotifications] = useState<ScreenNotification[]>([]);
  const notificationQueueRef = useRef<ScreenNotification[]>([]);
  const isProcessingRef = useRef(false);

  const processNotificationQueue = async () => {
    if (isProcessingRef.current || notificationQueueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    const notification = notificationQueueRef.current.shift()!;
    
    setScreenNotifications(prev => [...prev, { ...notification, isExiting: false }]);
    
    const duration = notification.tier === 'large' ? 5000 : notification.tier === 'medium' ? 4000 : 3000;
    
    setTimeout(() => {
      setScreenNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isExiting: true } : n)
      );
      
      setTimeout(() => {
        setScreenNotifications(prev => prev.filter(n => n.id !== notification.id));
        isProcessingRef.current = false;
        
        if (notificationQueueRef.current.length > 0) {
          setTimeout(() => processNotificationQueue(), 500);
        }
      }, 800);
    }, duration);
  };

  const addScreenNotification = (notification: ScreenNotification) => {
    notificationQueueRef.current.push(notification);
    processNotificationQueue();
  };

  const clearNotifications = () => {
    setScreenNotifications([]);
    notificationQueueRef.current = [];
    isProcessingRef.current = false;
  };

  return {
    screenNotifications,
    addScreenNotification,
    clearNotifications
  };
};
