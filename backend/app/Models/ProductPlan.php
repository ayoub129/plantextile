<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_date',
        'end_date',
        'qte',
        'model_id',
        'chain',
        'consummation_standard_fil',
        'consummation_standard_plastique',
    ];

    public function model()
    {
        return $this->belongsTo(Model::class);
    }

    public function productPlanHours()
    {
        return $this->hasMany(ProductPlanHour::class);
    }
}
