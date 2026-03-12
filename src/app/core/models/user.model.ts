export interface User<T> {
  id: string;
  fullName: string;
  role: string;
  email: string;
  createdAt: T;
}
