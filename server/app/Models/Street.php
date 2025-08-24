<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Street extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_streets';
    protected $primaryKey = 'street_id';
    protected $fillable = [
        'street',
        'is_deleted',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'street_id', 'street_id');
    }
}