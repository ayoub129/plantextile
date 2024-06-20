<?php

namespace App\Http\Controllers;

use App\Models\SystemConstant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SystemconstantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize(['admin' , 'developer' , 'superadmin' ]);

        return SystemConstant::all();
    }

    public function store(Request $request)
    {
        $this->authorize(['admin','developer','superadmin']);

        $request->validate([
            'Nombre_d_heures_par_jour' => 'nullable|integer|max:255',
            'Taux_horaire_SMIG_16_29' => 'nullable|integer|max:255',
            'Taux_horaire_17_00' => 'nullable|integer|max:255',
            'Taux_horaire_17_50' => 'nullable|integer|max:255',
            'Masse_salariale_16_29' => 'nullable|integer',
            'Masse_salariale_17_00' => 'nullable|integer',
            'Masse_salariale_17_50' => 'nullable|integer',
            'Capacité_par_unité_transport' => 'nullable|numeric',
            'cotisation_entroprise_trans' => 'nullable|numeric',
            'Total_prime_par_modèle' => 'nullable|numeric',
            'Coût_par_trajet' => 'nullable|integer|max:255',
            'Coût_énergie_journalier' => 'nullable|integer',
            'Coût_charges_fixes_journalier' => 'nullable|numeric',
            'Coupe' => 'nullable|numeric',
            'Production'  => 'nullable|numeric',
            'Repassage_final'  => 'nullable|numeric',
            'Contrôle_final'  => 'nullable|numeric',
            'Magasin_final' => 'nullable|numeric',
            'Magasin_fournitures' => 'nullable|numeric',
            'Achats_Logistique' => 'nullable|numeric',
            'Transit' => 'nullable|numeric',
            'Comptabilité_Finances' => 'nullable|numeric',
            'RH' => 'nullable|numeric',
            'Ménage'  => 'nullable|numeric'   
        ]);

        $model = new SystemConstant($request->all());

        $model->save();

        return response()->json($model, 201);
    }

    public function show($id)
    {
        $this->authorize([ 'developer' , 'admin' , 'superadmin']);

        return SystemConstant::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $this->authorize(['admin' , 'developer' , 'superadmin']);

        $request->validate([
            'Nombre_d_heures_par_jour' => 'nullable|integer|max:255',
            'Taux_horaire_SMIG_16_29' => 'nullable|integer|max:255',
            'Taux_horaire_17_00' => 'nullable|integer|max:255',
            'Taux_horaire_17_50' => 'nullable|integer|max:255',
            'Masse_salariale_16_29' => 'nullable|integer',
            'Masse_salariale_17_00' => 'nullable|integer',
            'Masse_salariale_17_50' => 'nullable|integer',
            'Capacité_par_unité_transport' => 'nullable|numeric',
            'cotisation_entroprise_trans' => 'nullable|numeric',
            'Total_prime_par_modèle' => 'nullable|numeric',
            'Coût_par_trajet' => 'nullable|integer|max:255',
            'Coût_énergie_journalier' => 'nullable|integer',
            'Coût_charges_fixes_journalier' => 'nullable|numeric',
            'Coupe' => 'nullable|numeric',
            'Production'  => 'nullable|numeric',
            'Repassage_final'  => 'nullable|numeric',
            'Contrôle_final'  => 'nullable|numeric',
            'Magasin_final' => 'nullable|numeric',
            'Magasin_fournitures' => 'nullable|numeric',
            'Achats_Logistique' => 'nullable|numeric',
            'Transit' => 'nullable|numeric',
            'Comptabilité_Finances' => 'nullable|numeric',
            'RH' => 'nullable|numeric',
            'Ménage'  => 'nullable|numeric'   
        ]);

        $model = SystemConstant::findOrFail($id);
        $model->update($request->all());

        return response()->json($model, 200);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
