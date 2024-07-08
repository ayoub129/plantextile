<?php

namespace App\Http\Controllers;

use App\Models\EffectifDirect;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EffectifDirectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'Method' , 'HR']);

        return EffectifDirect::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'Method' , 'HR']);

        $request->validate([
            'machinistes' => 'nullable|integer',
            'machinistes_stagiaires' => 'nullable|integer',
            'repassage_preparation' => 'nullable|integer',
            'trassage' => 'nullable|integer',
            'transport' => 'nullable|integer',
            'chef' => 'nullable|integer',
            'machines_speciales' => 'nullable|integer',
            'trassage_special' => 'nullable|integer', 
            'controle_table' => 'nullable|integer', 
            'controle_final' => 'nullable|integer',
            'machinistes_retouche' => 'nullable|integer',
            'repassage_final' => 'nullable|integer',
            'finition' => 'nullable|integer',
            'transp_fin' => 'nullable|integer',
        ]);

        $effectifDirect = new EffectifDirect($request->all());
        $effectifDirect->save();

        return response()->json($effectifDirect, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'Method' , 'HR']);

        return EffectifDirect::findOrFail($id);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function update(Request $request, $id)
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'Method' , 'HR']);

        $effectifDirect = EffectifDirect::findOrFail($id);

        $request->validate([
            'machinistes' => 'nullable|integer',
            'machinistes_stagiaires' => 'nullable|integer',
            'repassage_preparation' => 'nullable|integer',
            'trassage' => 'nullable|integer',
            'transport' => 'nullable|integer',
            'chef' => 'nullable|integer',
            'machines_speciales' => 'nullable|integer',
            'trassage_special' => 'nullable|integer', 
            'controle_table' => 'nullable|integer', 
            'controle_final' => 'nullable|integer',
            'machinistes_retouche' => 'nullable|integer',
            'repassage_final' => 'nullable|integer',
            'finition' => 'nullable|integer',
            'transp_fin' => 'nullable|integer',
        ]);

        $effectifDirect->update($request->all());

        return response()->json($effectifDirect, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'Method' , 'HR']);

        $effectifDirect = EffectifDirect::findOrFail($id);
        $effectifDirect->delete();

        return response()->json(null, 204);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }

}
