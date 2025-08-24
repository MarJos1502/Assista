export interface StreetColumns {
    street_id: number;
    street: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface StreetFieldErrors {
  street?: string[];
}