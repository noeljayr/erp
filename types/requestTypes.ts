type User = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  user_id: string;
};

export type RequestTypes = {
  _id: string;
  requestNumber: number;
  requestedBy: User;
  amount: number;
  currency: string;
  approverId: string;
  purpose: string;
  description: string;
  requiredOn: string | null; // could also be Date if parsed
  status: string;
  initiatedOn: string;
  approver: User;
};
