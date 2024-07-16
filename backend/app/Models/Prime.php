<?php

// app/Models/Prime.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prime extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_id',
        'amount',
    ];

    public function model()
    {
        return $this->belongsTo(Models::class, 'model_id');
    }
}
