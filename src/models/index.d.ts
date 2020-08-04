declare namespace Models {
  export interface Renter {
    id?: number;
    name: string;
    phone: string;
    social: string;
    title: string;
    country: string;
    city: string;
    description: string | null;
    tenantsDescription: string | null;
    minBudget: number;
    maxBudget: number;
    willPayFee: boolean;
    housingType: string;
    currency: string;
  }
  export interface Catalog {
    offset?: number;
    limit?: number;
  }
}
