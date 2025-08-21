import { useState, useEffect } from 'react';
import { Feedback, FeedbackStats } from '@/types/feedback';

const STORAGE_KEY = 'feedback-radar-data';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading feedback data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever feedbacks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
  }, [feedbacks]);

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'date'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const getStats = (): FeedbackStats => {
    const total = feedbacks.length;
    const average = total > 0 ? 
      feedbacks.reduce((sum, f) => sum + f.rating, 0) / total : 0;
    
    const distribution = feedbacks.reduce((acc, feedback) => {
      acc[feedback.rating] = (acc[feedback.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Ensure all ratings (1-5) are represented
    for (let i = 1; i <= 5; i++) {
      if (!distribution[i]) distribution[i] = 0;
    }

    return { total, average, distribution };
  };

  const filterByRating = (minRating: number) => {
    return feedbacks.filter(f => f.rating >= minRating);
  };

  return {
    feedbacks,
    addFeedback,
    getStats,
    filterByRating,
  };
};