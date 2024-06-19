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
        return SystemConstant::all();
    }

    public function store(Request $request)
    {
        $this->authorize(['admin' , 'developer']);

        $request->validate([
            'Taux_horaire_SMIG_16,29' => 'required|string|max:255',
            'Taux_horaire_17,00' => 'required|string|max:255',
            'Taux_horaire_17,50' => 'required|string|max:255',
            'Masse_salariale_16,29' => 'required|integer',
            'Masse_salariale_17.00' => 'required|integer',
            'Masse_salariale_17.50' => 'required|integer',
            'Capacité_par_unité_transport' => 'required|numeric',
            'Coût_par_trajet' => 'required|string|max:255',
            'Coût_énergie_journalier' => 'required|date',
            'Coût_charges_fixes_journalier' => 'required|numeric',
            'Coupe' => 'required|numeric',
            'Production'  => 'required|numeric',
            'Repassage_final'  => 'required|numeric',
            'Contrôle_final'  => 'required|numeric',
            'Magasin_final' => 'required|numeric',
            'Magasin_fournitures' => 'required|numeric',
            'Achats_Logistique' => 'required|numeric',
            'Transit' => 'required|numeric',
            'Comptabilité_Finances' => 'required|numeric',
            'RH' => 'required|numeric',
            'Ménage'  => 'required|numeric'   
        ]);

        $model = new SystemConstant($request->all());

        $model->save();

        return response()->json($model, 201);
    }

    public function show($id)
    {
        $this->authorize(['logistique' , 'HR' , 'developer' , 'admin' , 'super-admin']);

        return SystemConstant::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $this->authorize(['logistique' , 'developer' ]);

        $model = SystemConstant::findOrFail($id);

        $request->validate([
            'Taux_horaire_SMIG_16,29' => 'required|string|max:255',
            'Taux_horaire_17,00' => 'required|string|max:255',
            'Taux_horaire_17,50' => 'required|string|max:255',
            'Masse_salariale_16,29' => 'required|integer',
            'Masse_salariale_17.00' => 'required|integer',
            'Masse_salariale_17.50' => 'required|integer',
            'Capacité_par_unité_transport' => 'required|numeric',
            'Coût_par_trajet' => 'required|string|max:255',
            'Coût_énergie_journalier' => 'required|date',
            'Coût_charges_fixes_journalier' => 'required|numeric',
        ]);

        $model->update($request->all());

        return response()->json($model, 200);
    }

    public function destroy($id)
    {
        $this->authorize(['developer' , 'admin' ,  'super-admin']);

        $model = SystemConstant::findOrFail($id);
        $model->delete();

        return response()->json(null, 204);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->authorization_level, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
