<?php

namespace App\Http\Controllers;

use App\Models\ExportProduction;
use App\Http\Requests\StoreExportProductionRequest;
use App\Http\Requests\UpdateExportProductionRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ExportProductionController extends Controller
{
    public function update(Request $request, $modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Logistique']);

        $request->validate([
            'value' => 'nullable|integer',
            'date' => 'nullable|date'
        ]);

        $repassageProduction = ExportProduction::updateOrCreate(
            ['model_id' => $modelId],
            [
                'value' => $request->value,
                'date' => $request->date
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

    /**
     * Get the sum of all values.
     */
    public function getTotalValue()
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Logistique']);

        $totalValue = ExportProduction::sum('value');
        
        return response()->json(['total_value' => $totalValue], 200);
    }


    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }


}
