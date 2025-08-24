export interface CityColumns {
    city_id: number;
    city: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface CityFieldErrors {
  city?: string[];
}