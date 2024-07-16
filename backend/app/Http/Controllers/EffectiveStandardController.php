<?php

namespace App\Http\Controllers;

use App\Models\Coupe;
use App\Models\EffectifDirect;
use App\Models\EffectifIndirect;
use App\Models\EffectiveStandard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EffectiveStandardController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Méthode']);

        $request->validate([
            'chain' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'cointa' => 'nullable',
            'price_by_part' => 'nullable|numeric',
            'effectif_directs' => 'nullable|array',
            'effectif_directs.*.machinistes' => 'nullable|integer',
            'effectif_directs.*.machinistes_stagiaires' => 'nullable|integer',
            'effectif_directs.*.repassage_preparation' => 'nullable|integer',
            'effectif_directs.*.trassage' => 'nullable|integer',
            'effectif_directs.*.transport' => 'nullable|integer',
            'effectif_directs.*.chef' => 'nullable|integer',
            'effectif_directs.*.machines_speciales' => 'nullable|integer',
            'effectif_directs.*.trassage_special' => 'nullable|integer',
            'effectif_directs.*.controle_table' => 'nullable|integer',
            'effectif_directs.*.controle_final' => 'nullable|integer',
            'effectif_directs.*.machinistes_retouche' => 'nullable|integer',
            'effectif_directs.*.repassage_final' => 'nullable|integer',
            'effectif_directs.*.finition' => 'nullable|integer',
            'effectif_directs.*.transp_fin' => 'nullable|integer',
            'effectif_indirects' => 'nullable|array',
            'effectif_indirects.*.mag_four' => 'nullable|integer',
            'effectif_indirects.*.mag_fin' => 'nullable|integer',
            'effectif_indirects.*.machines_sp_manuelle' => 'nullable|integer',
            'effectif_indirects.*.cont_fin' => 'nullable|integer',
            'effectif_indirects.*.mach_retouche' => 'nullable|integer',
            'effectif_indirects.*.repassage' => 'nullable|integer',
            'effectif_indirects.*.gabaret' => 'nullable|integer',
            'effectif_indirects.*.preparation_stagieres' => 'nullable|integer',
            'effectif_indirects.*.preparation' => 'nullable|integer',
            'effectif_indirects.*.preparation_elastique' => 'nullable|integer',
        ]);

        $effectiveStandard = new EffectiveStandard($request->all());

        if (!$request->cointa) {
            $effectiveStandard->price_by_part = null;
        }

        $effectiveStandard->save();

        if ($request->has('effectif_directs')) {
            foreach ($request->effectif_directs as $effectifDirect) {
                $effectiveStandard->effectifDirects()->create($effectifDirect);
            }
        }

        if ($request->has('effectif_indirects')) {
            foreach ($request->effectif_indirects as $effectifIndirectData) {
                $effectifIndirect = $effectiveStandard->effectifIndirects()->create($effectifIndirectData);
                if (isset($effectifIndirectData['coupes'])) {
                    foreach ($effectifIndirectData['coupes'] as $coupeData) {
                        $effectifIndirect->coupes()->create($coupeData);
                    }
                }
            }
        }
    
        return response()->json($effectiveStandard, 201);
    }

    public function getEffectiveData(Request $request, $modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Méthode']);

        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $effectiveStandard = EffectiveStandard::with(['effectifDirects', 'effectifIndirects'])
            ->where('model', $modelId)
            ->whereBetween('start_date', [$startDate, $endDate])
            ->get();

        if ($effectiveStandard->isEmpty()) {
            return response()->json(['message' => 'No Effective found for this model and date range'], 404);
        }

        return response()->json($effectiveStandard);
    }


    public function getEffectiveByModel($modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Méthode']);
    
        $effectifStandard = EffectiveStandard::with(['effectifDirects', 'effectifIndirects'])
            ->where('model', $modelId)
            ->first();
    
        if (!$effectifStandard) {
            return response()->json(['message' => 'No Effective found for this model'], 404);
        }
    
        return response()->json($effectifStandard);
    }
    
    public function update(Request $request, $id)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Méthode']);

        $effectiveStandard = EffectiveStandard::findOrFail($id);

        $request->validate([
            'chain' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'cointa' => 'nullable',
            'price_by_part' => 'nullable|numeric',
            'effectif_directs' => 'nullable|array',
            'effectif_directs.*.machinistes' => 'nullable|integer',
            'effectif_directs.*.machinistes_stagiaires' => 'nullable|integer',
            'effectif_directs.*.repassage_preparation' => 'nullable|integer',
            'effectif_directs.*.trassage' => 'nullable|integer',
            'effectif_directs.*.transport' => 'nullable|integer',
            'effectif_directs.*.chef' => 'nullable|integer',
            'effectif_directs.*.machines_speciales' => 'nullable|integer',
            'effectif_directs.*.trassage_special' => 'nullable|integer',
            'effectif_directs.*.controle_table' => 'nullable|integer',
            'effectif_directs.*.controle_final' => 'nullable|integer',
            'effectif_directs.*.machinistes_retouche' => 'nullable|integer',
            'effectif_directs.*.repassage_final' => 'nullable|integer',
            'effectif_directs.*.finition' => 'nullable|integer',
            'effectif_directs.*.transp_fin' => 'nullable|integer',
            'effectif_indirects' => 'nullable|array',
            'effectif_indirects.*.mag_four' => 'nullable|integer',
            'effectif_indirects.*.mag_fin' => 'nullable|integer',
            'effectif_indirects.*.machines_sp_manuelle' => 'nullable|integer',
            'effectif_indirects.*.cont_fin' => 'nullable|integer',
            'effectif_indirects.*.mach_retouche' => 'nullable|integer',
            'effectif_indirects.*.repassage' => 'nullable|integer',
            'effectif_indirects.*.gabaret' => 'nullable|integer',
            'effectif_indirects.*.preparation_stagieres' => 'nullable|integer',
            'effectif_indirects.*.preparation' => 'nullable|integer',
            'effectif_indirects.*.preparation_elastique' => 'nullable|integer',
            'effectif_indirects.*.coupes' => 'nullable|array',
            'effectif_indirects.*.coupes.*.matlasseurs' => 'nullable|integer',
            'effectif_indirects.*.coupes.*.coupeurs' => 'nullable|integer',
            'effectif_indirects.*.coupes.*.tiquitage' => 'nullable|integer',
            'effectif_indirects.*.coupes.*.vesline' => 'nullable|integer',
        ]);

        if ($request->has('cointa') && !$request->cointa) {
            $effectiveStandard->price_by_part = null;
        }

        $effectiveStandard->update($request->all());

        if ($request->has('effectif_directs')) {
            foreach ($request->effectif_directs as $effectifDirectData) {
                if (isset($effectifDirectData['id'])) {
                    $effectifDirect = EffectifDirect::find($effectifDirectData['id']);
                    $effectifDirect->update($effectifDirectData);
                } else {
                    $effectiveStandard->effectifDirects()->create($effectifDirectData);
                }
            }
        }

        if ($request->has('effectif_indirects')) {
            foreach ($request->effectif_indirects as $effectifIndirectData) {
                if (isset($effectifIndirectData['id'])) {
                    $effectifIndirect = EffectifIndirect::find($effectifIndirectData['id']);
                    $effectifIndirect->update($effectifIndirectData);
                    
                    if (isset($effectifIndirectData['coupes'])) {
                        foreach ($effectifIndirectData['coupes'] as $coupeData) {
                            if (isset($coupeData['id'])) {
                                $coupe = Coupe::find($coupeData['id']);
                                $coupe->update($coupeData);
                            } else {
                                $effectifIndirect->coupes()->create($coupeData);
                            }
                        }
                    }
                } else {
                    $newEffectifIndirect = $effectiveStandard->effectifIndirects()->create($effectifIndirectData);
                    
                    if (isset($effectifIndirectData['coupes'])) {
                        foreach ($effectifIndirectData['coupes'] as $coupeData) {
                            $newEffectifIndirect->coupes()->create($coupeData);
                        }
                    }
                }
            }
        }
            return response()->json($effectiveStandard, 200);
    }
    
    public function destroy($id)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Méthode']);
    
        $effectiveStandard = EffectiveStandard::findOrFail($id);
        $effectiveStandard->delete();
    
        return response()->json(null, 204);
    }

    public function getEffectiveIndirect()
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Méthode']);

        $effectiveIndirect = EffectifIndirect::whereNotNull('effective_standard_id')->with('coupes')->first();

        if (!$effectiveIndirect) {
            return response()->json(['message' => 'No Effective Indirect found for this Effective Standard ID'], 404);
        }

        return response()->json($effectiveIndirect);
    }


    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}