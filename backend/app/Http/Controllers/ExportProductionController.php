<?php

namespace App\Http\Controllers;

use App\Models\ExportProduction;
use App\Http\Requests\StoreExportProductionRequest;
use App\Http\Requests\UpdateExportProductionRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\ProductPlan;

class ExportProductionController extends Controller
{
    public function update(Request $request, $modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Logistique']);

        $request->validate([
            'value' => 'required|integer',
            'date' => 'required|date'
        ]);

        $repassageProduction = ExportProduction::create([
            'model_id' => $modelId,
            'value' => $request->value,
            'date' => $request->date
        ]);

        return response()->json($repassageProduction, 201);
    }

    public function show($modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Logistique']);

        $totalProduction = ExportProduction::where('model_id', $modelId)
            ->sum('value');

        return response()->json(['total' => $totalProduction], 200);
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
