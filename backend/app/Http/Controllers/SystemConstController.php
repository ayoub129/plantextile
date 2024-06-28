<?php

namespace App\Http\Controllers;

use App\Models\SystemConstant;
use Illuminate\Http\Request;

class SystemConstantController extends Controller
{
    public function index()
    {
        $systemConstants = SystemConstant::all();
        return response()->json($systemConstants);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
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

        $systemConstant = SystemConstant::create($validatedData);

        return response()->json($systemConstant, 201);
    }

    public function show(SystemConstant $systemConstant)
    {
        $this->authorize([ 'developer' , 'admin' , 'superadmin']);

        return response()->json($systemConstant);
    }

    public function edit(SystemConstant $systemConstant)
    {
        // Not necessary for API, typically form rendering happens on the client side
    }

    public function update(Request $request, SystemConstant $systemConstant)
    {
        $validatedData = $request->validate([
            'Nombre_d_heures_par_jour' => 'required',
            'Taux_horaire_SMIG_16_29' => 'required',
            // Add validation for other fields
        ]);

        $systemConstant->update($validatedData);

        return response()->json($systemConstant);
    }

    public function destroy(SystemConstant $systemConstant)
    {
        $systemConstant->delete();

        return response()->json(null, 204);
    }
}
