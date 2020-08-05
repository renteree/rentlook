declare namespace Models {
  export interface Renter {
    id?: number;
    name: string;
    phone: string;
    social?: string;
    title: string;
    country: string;
    city: string;
    cityId: string;
    description?: string;
    tenantsDescription?: string;
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
