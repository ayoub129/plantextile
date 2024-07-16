<?php

namespace App\Http\Controllers;

use App\Models\EffectifFix;
use App\Models\SystemConstant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SystemConstController extends Controller
{
    public function update(Request $request, $id)
    {
        $this->authorize(['developer', 'admin', 'superadmin']);
    
        $systemConstant = SystemConstant::findOrFail($id);
    
        $request->validate([
            'Nombre_d_heures_par_jour' => 'sometimes|required|numeric',
            'Taux_horaire_SMIG_16_29' => 'sometimes|required|numeric',
            'Taux_horaire_17_00' => 'sometimes|required|numeric',
            'Taux_horaire_17_50' => 'sometimes|required|numeric',
            'Masse_salariale_16_29' => 'sometimes|required|numeric',
            'Masse_salariale_17_00' => 'sometimes|required|numeric',
            'Masse_salariale_17_50' => 'sometimes|required|numeric',
            'Capacité_par_unité_transport' => 'sometimes|required|numeric',
            'cotisation_entroprise_trans' => 'sometimes|required|numeric',
            'Coût_énergie_journalier' => 'sometimes|required|numeric',
            'Coût_par_trajet' => 'sometimes|required|numeric',
            'Coût_charges_fixes_journalier' => 'sometimes|required|numeric',
            'effectif_fix' => 'nullable|array',
            'effectif_fix.*.Coupe' => 'nullable|integer',
            'effectif_fix.*.Production' => 'nullable|integer',
            'effectif_fix.*.Repassage_final' => 'nullable|integer',
            'effectif_fix.*.Contrôle_final' => 'nullable|integer',
            'effectif_fix.*.Magasin_final' => 'nullable|integer',
            'effectif_fix.*.Magasin_fournitures' => 'nullable|integer',
            'effectif_fix.*.Achats_Logistique' => 'nullable|integer',
            'effectif_fix.*.Transit' => 'nullable|integer',
            'effectif_fix.*.Comptabilité_Finances' => 'nullable|integer',
            'effectif_fix.*.RH' => 'nullable|integer',
            'effectif_fix.*.Ménage' => 'nullable|integer',
            'effectif_fix.*.Autres' => 'nullable|integer',
        ]);
    
        $systemConstant->update($request->all());
    
        if ($request->has('effectif_fix')) {
            foreach ($request->effectif_fix as $effectifFixData) {
                $effectifFix = EffectifFix::updateOrCreate(
                    ['system_constant_id' => $systemConstant->id], 
                    $effectifFixData
                );
            }
        }
    
        return response()->json($systemConstant->load('effectifFix'), 200);
    }

        public function show()
    {
        $this->authorize(['developer', 'admin', 'superadmin']);
        $systemConstant = SystemConstant::with('effectifFix')->latest()->firstOrFail();
        return response()->json($systemConstant);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
