export interface BarangayColumns {
    barangay_id: number;
    barangay: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface BarangayFieldErrors {
  barangay?: string[];
}