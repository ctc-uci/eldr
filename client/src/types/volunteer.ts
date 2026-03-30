export interface Volunteer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  roles?: string[];
  specializations?: string[];
  languages?: string[];
  experienceLevel?: string;
}
