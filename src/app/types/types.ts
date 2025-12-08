export type PlayerInput = {
  id: number;
  name: string;
  hoursInput: string; // string supaya bisa kosong
};

export type PlayerShare = {
  id: string; 
  name: string;
  hours: number;
  portion: number;
  amount: number;
  paid: boolean;
};

export type Session = {
  id: string;
  date: string; // "YYYY-MM-DD"
  startTime: string;
  totalHours: number;
  totalCost: number;
  totalPlayerHours: number;
  players: PlayerShare[];
  createdAt: string; // ISO
  sessionName?: string;
  location?: string;
};
