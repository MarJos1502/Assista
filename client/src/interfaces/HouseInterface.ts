export interface HouseColumns {
    house_id: number;
    house: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface HouseFieldErrors {
  house?: string[];
}