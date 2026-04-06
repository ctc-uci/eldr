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

export interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  startDate?: string;
}

export interface ArchivedVolunteer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roles?: string[];
  reactivation?: string;
  archivedDate?: string;
  archivedNotes?: string;
}
