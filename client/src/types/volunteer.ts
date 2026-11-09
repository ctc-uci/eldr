export interface Volunteer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  secondaryPhoneNumber?: string;
  isPrimaryMobile?: boolean;
  isSecondaryMobile?: boolean;
  canText?: boolean;
  role?: string;
  roles?: string[];
  areasOfPractice?: string[];
  languages?: string[];
  experienceLevel?: string;
  mostRecentEvent?: string;
  isSignedConfidentiality?: boolean;
  isNotary?: boolean | null;
  notaryStatus?: string | null;
  isCaliforniaLicensed?: boolean;
  affiliatedEmployer?: string;
  lawSchoolYear?: string;
  stateBarCertificate?: string;
  stateBarNumber?: string;
  profilePictureUrl?: string | null;
  firebaseUid?: string | null;
  formReceived?: boolean;
  formLink?: string | null;
  handbookUrl?: string | null;
  handbookUploadedAt?: string | null;
  handbookAcknowledged?: boolean;
  emergencyContactVerified?: boolean;
  confidentialityWaiverVerified?: boolean;
}

export interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  secondaryPhoneNumber?: string;
  isPrimaryMobile?: boolean;
  isSecondaryMobile?: boolean;
  canText?: boolean;
  startDate?: string;
  profilePictureUrl?: string | null;
  firebaseUid?: string | null;
}

export interface ArchivedVolunteer {
  id: number;
  listKey: string;
  source: "volunteer" | "staff";
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roles?: string[];
  reactivation?: string;
  archivedDate?: string;
  archivedNotes?: string;
}
