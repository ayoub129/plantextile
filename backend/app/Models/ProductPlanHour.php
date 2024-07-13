<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPlanHour extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_plan_id',
        'day', 
        'date',
        'hour',
        'models_finished',
    ];

    public function productPlan()
    {
        return $this->belongsTo(ProductPlan::class);
    }
}
