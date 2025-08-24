<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class City extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_citys';
    protected $primaryKey = 'city_id';
    protected $fillable = [
        'city',
        'is_deleted',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'city_id', 'city_id');
    }
}