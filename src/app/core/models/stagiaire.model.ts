export interface Interner<T> {
  id: string;
  name: string;
  lastname: string;
  firstname: string;
  gender: string;
  email: string;
  phone: string;
  college: string;
  promotion: string;
  departement: string;
  createdAt: T;
  updatedAt?: T;
}
