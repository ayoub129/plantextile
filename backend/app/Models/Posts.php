<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'logistique',
        'la_coupe',
        'production',
        'repassage',
        'control_final',
        'depot'
    ];
}
