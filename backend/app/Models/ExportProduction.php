<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExportProduction extends Model
{
    use HasFactory;
    protected $fillable = [
        'model_id',
        'value',
        'date'
    ];

    public function model()
    {
        return $this->belongsTo(Models::class);
    }

}
