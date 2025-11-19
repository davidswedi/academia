import { Payment } from './payment.model';
import { FieldValue, Timestamp } from '@angular/fire/firestore';

type DbId = string;

export interface Internship<T> {
  id: string;
  internerId: string;
  departement: string;
  supervisor: string;
  range: {
    startDate: T;
    endDate: T;
  };
  intershipType: string;
  registrationFee: string;
  createdAt: T;
  updatedAt: T;
}
