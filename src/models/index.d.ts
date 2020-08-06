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
  export interface PlaceType {
    description: string;
    place_id: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
      main_text_matched_substrings: [
        {
          offset: number;
          length: number;
        },
      ];
    };
  }
}
