export type Achievement = {
  id: string;
  icon: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  earnedDate: string | null;
  isEarned: boolean;
};