<?php

namespace App\Http\Controllers;

use App\Models\Coupe;
use App\Models\EffectifIndirect;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EffectifIndirectController extends Controller
{
    public function index()
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'method']);

        return EffectifIndirect::with('coupes')->get();
    }

    public function store(Request $request)
    {
        $this->authorize(['developer',  'method']);

        $request->validate([
            'effective_standard_id' => 'required|exists:effective_standards,id',
            'mag_four' => 'nullable|integer',
            'mag_fin' => 'nullable|integer',
            'machines_sp_manuelle' => 'nullable|integer',
            'cont_fin' => 'nullable|integer',
            'mach_retouche' => 'nullable|integer',
            'repassage' => 'nullable|integer',
            'gabaret' => 'nullable|integer',
            'preparation_stagieres' => 'nullable|integer',
            'preparation' => 'nullable|integer',
            'preparation_elastique' => 'nullable|integer',
            'coupes' => 'nullable|array',
            'coupes.*.matlasseurs' => 'nullable|integer',
            'coupes.*.coupeurs' => 'nullable|integer',
            'coupes.*.tiquitage' => 'nullable|integer',
            'coupes.*.vesline' => 'nullable|integer',
        ]);

        $effectifIndirect = new EffectifIndirect($request->all());
        $effectifIndirect->save();

        // Create associated Coupe if provided
        if ($request->has('coupes')) {
            foreach ($request->coupes as $coupeData) {
                $effectifIndirect->coupes()->create($coupeData);
            }
        }

        return response()->json($effectifIndirect, 201);
    }

    public function show($id)
    {
        $this->authorize(['developer', 'super-admin', 'admin', 'method']);

        return EffectifIndirect::with('coupes')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $this->authorize(['developer',  'method']);

        $effectifIndirect = EffectifIndirect::findOrFail($id);

        $request->validate([
            'mag_four' => 'nullable|integer',
            'mag_fin' => 'nullable|integer',
            'machines_sp_manuelle' => 'nullable|integer',
            'cont_fin' => 'nullable|integer',
            'mach_retouche' => 'nullable|integer',
            'repassage' => 'nullable|integer',
            'gabaret' => 'nullable|integer',
            'preparation_stagieres' => 'nullable|integer',
            'preparation' => 'nullable|integer',
            'preparation_elastique' => 'nullable|integer',
            'coupes' => 'nullable|array',
            'coupes.*.matlasseurs' => 'nullable|integer',
            'coupes.*.coupeurs' => 'nullable|integer',
            'coupes.*.tiquitage' => 'nullable|integer',
            'coupes.*.vesline' => 'nullable|integer',
        ]);

        $effectifIndirect->update($request->all());

        // Update associated Coupe if provided
        if ($request->has('coupes')) {
            foreach ($request->coupes as $coupeData) {
                $coupe = Coupe::find($coupeData['id']);
                $coupe->update($coupeData);
            }
        }

        return response()->json($effectifIndirect, 200);
    }

    public function destroy($id)
    {
        $this->authorize(['developer', 'super-admin']);

        $effectifIndirect = EffectifIndirect::findOrFail($id);
        $effectifIndirect->delete();

        return response()->json(null, 204);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->authorization_level, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
