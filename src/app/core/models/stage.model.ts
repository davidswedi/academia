import { FieldValue, Timestamp } from '@angular/fire/firestore';

type DbId = string;

export interface Internship<T> {
  id: string;
  internerId: string;
  departement: String;
  supervisor: String;
  range: {
    startDate: T;
    endDate: T;
  };
  intershipType: String;
  registrationFee: string;
  internshipFee: string;
  createdAt: T;
  updatedAt: T;
}
