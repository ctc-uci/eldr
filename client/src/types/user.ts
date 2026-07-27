export type User = {
  id: number;
  email: string;
  firebaseUid: string;
  role: "guest" | "volunteer" | "staff" | "supervisor";
};
