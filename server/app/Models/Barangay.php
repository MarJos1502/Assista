<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Barangay extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_barangays';
    protected $primaryKey = 'barangay_id';
    protected $fillable = [
        'barangay',
        'is_deleted',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'barangay_id', 'barangay_id');
    }
}