export interface Appointment {
  _id?: string;
  date: string;
  time: string;
  personName: string;
  reason: string;
  petType: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
