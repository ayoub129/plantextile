<?php

namespace App\Http\Controllers;

use App\Models\ExportProduction;
use App\Http\Requests\StoreExportProductionRequest;
use App\Http\Requests\UpdateExportProductionRequest;

class ExportProductionController extends Controller
{
    public function update(Request $request, $modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Logistique']);

        $request->validate([
            'value' => 'required|integer',
            'entre' => 'required|integer',
            'encore' => 'required|integer'
        ]);

        $repassageProduction = ExportProduction::updateOrCreate(
            ['model_id' => $modelId],
            [
                'value' => $request->value,
                'entre' => $request->entre,
                'encore' => $request->encore
            ]
        );

        return response()->json($repassageProduction, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Logistique']);

        $repassageProduction = ExportProduction::where('model_id', $modelId)->first();
        if ($repassageProduction) {
            return response()->json($repassageProduction);
        } else {
            return response()->json(['message' => 'Data not found'], 404);
        }
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }


}
