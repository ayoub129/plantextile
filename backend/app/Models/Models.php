<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Models extends Model
{
    use HasFactory;
    protected $fillable = [
        'modele',
        'category',
        'image',
        'client',
        'quantite_demandee',
        'quantityReceived',
        'qte_societe',
        'prixMOver',
        'devise',
        'prixFacture',
        'dateEtude',
        'cours_devise_etude',
        'dateImport',
        'cours_devise_import',
        'dateExport',
    ];

    public function productPlans()
    {
        return $this->hasMany(ProductPlan::class);
    }

    public function primes()
    {
        return $this->hasMany(Prime::class, 'model_id');
    }

}
