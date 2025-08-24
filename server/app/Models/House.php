<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class House extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_houses';
    protected $primaryKey = 'house_id';
    protected $fillable = [
        'house',
        'is_deleted',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'house_id', 'house_id');
    }
}