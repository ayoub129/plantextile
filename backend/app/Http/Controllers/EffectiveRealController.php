<?php

    namespace App\Http\Controllers;
    
    use App\Models\Coupe;
    use App\Models\EffectifDirect;
    use App\Models\EffectifIndirect;
    use App\Models\EffectiveReal;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Auth;
    
    class EffectiveRealController extends Controller
    {
        public function store(Request $request)
        {
            $this->authorize(['developer', 'super-admin', 'admin', 'HR']);
    
            $request->validate([
                'chain' => 'required|string|max:255',
                'model' => 'required|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'cointa' => 'required',
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
    
            $effectivereal = new EffectiveReal($request->all());
    
            if (!$request->cointa) {
                $effectivereal->price_by_part = null;
            }
    
            $effectivereal->save();
    
            if ($request->has('effectif_directs')) {
                foreach ($request->effectif_directs as $effectifDirect) {
                    $effectivereal->effectifDirects()->create($effectifDirect);
                }
            }
    
            if ($request->has('effectif_indirects')) {
                foreach ($request->effectif_indirects as $effectifIndirectData) {
                    $effectifIndirect = $effectivereal->effectifIndirects()->create($effectifIndirectData);
                    if (isset($effectifIndirectData['coupes'])) {
                        foreach ($effectifIndirectData['coupes'] as $coupeData) {
                            $effectifIndirect->coupes()->create($coupeData);
                        }
                    }
                }
            }
        
            return response()->json($effectivereal, 201);
        }
    
        public function getEffectiveByModel($modelId)
        {
            $this->authorize(['developer', 'super-admin', 'admin', 'HR']);
        
            $effectivereal = EffectiveReal::with(['effectifDirects', 'effectifIndirects'])
                ->where('model', $modelId)
                ->first();
        
            if (!$effectivereal) {
                return response()->json(['message' => 'No Effective found for this model'], 404);
            }
        
            return response()->json($effectivereal);
        }
        
        public function update(Request $request, $id)
        {
            $this->authorize(['developer', 'superadmin', 'admin', 'HR']);
    
            $effectivereal = EffectiveReal::findOrFail($id);
    
            $request->validate([
                'chain' => 'sometimes|string|max:255',
                'model' => 'required|string|max:255',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date',
                'cointa' => 'sometimes',
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
                $effectivereal->price_by_part = null;
            }
    
            $effectivereal->update($request->all());
    
            if ($request->has('effectif_directs')) {
                foreach ($request->effectif_directs as $effectifDirectData) {
                    if (isset($effectifDirectData['id'])) {
                        $effectifDirect = EffectifDirect::find($effectifDirectData['id']);
                        $effectifDirect->update($effectifDirectData);
                    } else {
                        $effectivereal->effectifDirects()->create($effectifDirectData);
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
                        $newEffectifIndirect = $effectivereal->effectifIndirects()->create($effectifIndirectData);
                        
                        if (isset($effectifIndirectData['coupes'])) {
                            foreach ($effectifIndirectData['coupes'] as $coupeData) {
                                $newEffectifIndirect->coupes()->create($coupeData);
                            }
                        }
                    }
                }
            }
                return response()->json($effectivereal, 200);
        }
        
        public function destroy($id)
        {
            $this->authorize(['developer', 'superadmin', 'admin', 'HR']);
        
            $effectivereal = EffectiveReal::findOrFail($id);
            $effectivereal->delete();
        
            return response()->json(null, 204);
        }
    
        private function authorize(array $roles)
        {
            if (!in_array(Auth::user()->role, $roles)) {
                abort(403, "Unauthorized action. hh");
            }
        }
    
}