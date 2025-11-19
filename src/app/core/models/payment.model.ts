import { User } from '@angular/fire/auth';

export interface Payment<T> {
  id: string;
  intershipId: string;
  amount: string;
  currency: string;
  date: T;
  user: string;
}
