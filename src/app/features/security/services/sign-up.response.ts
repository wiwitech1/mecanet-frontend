export interface SignUpResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  company: {
    ruc: string;
    legalName: string;
    commercialName: string;
    address: string;
    city: string;
    country: string;
    tenantPhone: string;
    tenantEmail: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
  message?: string;
  success: boolean;
}

export interface SignUpRequest {
  ruc: string;
  legalName: string;
  commercialName: string;
  address: string;
  city: string;
  country: string;
  tenantPhone: string;
  tenantEmail: string;
  website: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}
