<?php

namespace App\Http\Controllers;

use App\Models\EffectifDirect;
use App\Models\EffectifIndirect;
use App\Models\EffectiveReal;
use App\Models\EffectiveStandard;
use App\Models\Models;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EffectiveRealController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'RH']);

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
        $this->authorize(['developer', 'superadmin', 'admin', 'RH']);

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
        $this->authorize(['developer', 'superadmin', 'admin', 'RH']);

        $effectivereal = EffectiveReal::findOrFail($id);

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
                $newEffectifIndirect = $effectivereal->effectifIndirects()->create($effectifIndirectData);

                if (isset($effectifIndirectData['coupes'])) {
                    foreach ($effectifIndirectData['coupes'] as $coupeData) {
                        $newEffectifIndirect->coupes()->create($coupeData);
                    }
                }
            }
        }

        return response()->json($effectivereal, 200);
    }

    public function destroy($id)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'RH']);

        $effectivereal = EffectiveReal::findOrFail($id);
        $effectivereal->delete();

        return response()->json(null, 204);
    }

    public function getEffectiveData(Request $request, $modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'RH']);

        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $effectiveStandard = EffectiveReal::with(['effectifDirects', 'effectifIndirects'])
            ->where('model', $modelId)
            ->whereBetween('start_date', [$startDate, $endDate])
            ->get();

        if ($effectiveStandard->isEmpty()) {
            return response()->json(['message' => 'No Effective Real found for this model and date range'], 404);
        }

        return response()->json($effectiveStandard);
    }

    public function getEffectiveIndirect()
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'RH']);

        $effectiveIndirect = EffectifIndirect::whereNotNull('effective_real_id')
        ->with('coupes')
        ->orderBy('created_at', 'desc')
        ->first();

        if (!$effectiveIndirect) {
            return response()->json(['message' => 'No Effective Indirect found for this Effective Real ID'], 404);
        }

        return response()->json($effectiveIndirect);
    }

    public function totalEffectifIndirect()
    {
        $this->authorize(['developer', 'superadmin', 'admin']);
    
        // Get the latest single EffectifIndirect record that has a non-null effective_real_id
        $effectiveIndirect = EffectifIndirect::whereNotNull('effective_real_id')
            ->with('coupes')
            ->latest()
            ->first();
    
        if (!$effectiveIndirect) {
            return response()->json(['message' => 'No Effective Indirect found for this Effective Standard ID'], 200);
        }
    
        $totalIndirect = 0;
    
        $totalIndirect += $effectiveIndirect->mag_four +
            $effectiveIndirect->mag_fin +
            $effectiveIndirect->machines_sp_manuelle +
            $effectiveIndirect->cont_fin +
            $effectiveIndirect->mach_retouche +
            $effectiveIndirect->repassage +
            $effectiveIndirect->gabaret +
            $effectiveIndirect->preparation_stagieres +
            $effectiveIndirect->preparation +
            $effectiveIndirect->preparation_elastique;
    
        foreach ($effectiveIndirect->coupes as $coupe) {
            $totalIndirect += $coupe->matlasseurs +
                $coupe->coupeurs +
                $coupe->tiquitage +
                $coupe->vesline;
        }
    
        return response()->json(['total_effectif_indirect' => $totalIndirect]);
    }
    
    public function totalEffectifDirect($modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin']);

        $effectiveReal = EffectiveReal::with(['effectifDirects'])
            ->where('model', $modelId)
            ->get();

        $totalDirect = 0;

        foreach ($effectiveReal as $real) {
            foreach ($real->effectifDirects as $direct) {
                $totalDirect += $direct->machinistes +
                    $direct->machinistes_stagiaires +
                    $direct->repassage_preparation +
                    $direct->trassage +
                    $direct->transport +
                    $direct->chef +
                    $direct->machines_speciales +
                    $direct->trassage_special +
                    $direct->controle_table +
                    $direct->controle_final +
                    $direct->machinistes_retouche +
                    $direct->repassage_final +
                    $direct->finition +
                    $direct->transp_fin;
            }
        }

        return response()->json(['total_effectif_direct' => $totalDirect]);
    }
    public function getEffectiveSumData($modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Méthode']);
    
        // Fetch the effective standard data for the given model
        $effectiveStandard = EffectiveStandard::where('model', $modelId)->first();
    
        if (is_null($effectiveStandard)) {
            return response()->json(['message' => 'No EffectiveStandard found for this model'], 404);
        }
    
        // Fetch all effective real data for the given model
        $effectiveReal = EffectiveReal::with(['effectifDirects', 'effectifIndirects.coupes'])
            ->where('model', $modelId)
            ->get();
    
        if ($effectiveReal->isEmpty()) {
            return response()->json(['message' => 'No EffectiveReal found for this model'], 404);
        }
    
        // Fetch all indirect effective data with an effective_real_id
        $allIndirectEffective = EffectifIndirect::with('coupes')
            ->whereNotNull('effective_real_id')
            ->orderBy('created_at')
            ->get();
    
        // Get the date range from the effective standard data
        $startDate = new \DateTime($effectiveStandard->start_date);
        $endDate = new \DateTime($effectiveStandard->end_date);
    
        // Create a date range
        $dateInterval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod($startDate, $dateInterval, $endDate->modify('+1 day'));
    
        // Organize the data by dates and calculate the sums
        $effectiveDataByDate = [];
        $currentIndirectSum = 0;
    
        foreach ($dateRange as $date) {
            $formattedDate = $date->format('Y-m-d');
            $directsSum = 0;
            $indirectsSum = $currentIndirectSum; // Start with the last known indirect sum
    
            // Get the effective direct data for the current date
            foreach ($effectiveReal as $effective) {
                $effectiveCreatedAt = new \DateTime($effective->created_at);
                if ($date->format('Y-m-d') == $effectiveCreatedAt->format('Y-m-d')) {
                    $directsSum += $effective->effectifDirects->sum(function($direct) {
                        return array_sum([
                            $direct->machinistes,
                            $direct->machinistes_stagiaires,
                            $direct->repassage_preparation,
                            $direct->trassage,
                            $direct->transport,
                            $direct->chef,
                            $direct->machines_speciales,
                            $direct->trassage_special,
                            $direct->controle_table,
                            $direct->controle_final,
                            $direct->machinistes_retouche,
                            $direct->repassage_final,
                            $direct->finition,
                            $direct->transp_fin
                        ]);
                    });
                }
            }
    
            // Check if there is a new indirect effective record for the current date
            foreach ($allIndirectEffective as $indirect) {
                $indirectCreatedAt = new \DateTime($indirect->created_at);
                if ($date->format('Y-m-d') == $indirectCreatedAt->format('Y-m-d')) {
                    $indirectSumForDay = array_sum([
                        $indirect->mag_four,
                        $indirect->mag_fin,
                        $indirect->machines_sp_manuelle,
                        $indirect->cont_fin,
                        $indirect->mach_retouche,
                        $indirect->repassage,
                        $indirect->gabaret,
                        $indirect->preparation_stagieres,
                        $indirect->preparation,
                        $indirect->preparation_elastique
                    ]);
    
                    // Add the sum of coupe data
                    $coupeSum = $indirect->coupes->sum(function($coupe) {
                        return array_sum([
                            $coupe->matlasseurs,
                            $coupe->coupeurs,
                            $coupe->tiquitage,
                            $coupe->vesline
                        ]);
                    });
    
                    $currentIndirectSum = $indirectSumForDay + $coupeSum;
                    break;
                }
            }
    
            $effectiveDataByDate[$formattedDate] = [
                'total' => $directsSum + $currentIndirectSum,
                'effectifDirects' => $directsSum,
                'effectifIndirects' => $currentIndirectSum
            ];
        }
    
        return response()->json($effectiveDataByDate);
    }
            
    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, "Unauthorized action. ");
        }
    }
}
