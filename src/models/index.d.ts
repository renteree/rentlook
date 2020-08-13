type Housing = 'house' | 'flat' | 'room';

declare namespace Models {
  export interface Image {
    url: string;
    width: string;
    height: string;
    type: string;
  }

  export interface User {
    id: number;
    name: string;
    phone: string;
    social?: string;
    createdAt?: Date;
  }

  export interface Location {
    id: number;
    country: string;
    city: string;
    cityId: string;
  }

  export interface Renter {
    id?: number;
    user: User;
    location: Location;
    title: string;
    description?: string;
    tenantsDescription?: string;
    minBudget: number;
    maxBudget: number;
    willPayFee: boolean;
    housingType: Housing;
    currency: string;
    image: Image | null;
    createdAt?: Date;
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
