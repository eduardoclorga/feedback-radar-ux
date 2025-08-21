export interface Feedback {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FeedbackStats {
  total: number;
  average: number;
  distribution: Record<number, number>;
}