export interface Supervisor<T> {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  title: string;
  specialisation: string;
  createdAt: T;
  updatedAt?: T;
}
