<?php

namespace App\Http\Controllers;

use App\Models\RepassageProduction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RepassageProductionController extends Controller
{
    // Fetch the RepassageProduction data for a specific model
    public function show($modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'production_repassage']);

        $repassageProduction = RepassageProduction::where('model_id', $modelId)->first();
        if ($repassageProduction) {
            return response()->json($repassageProduction);
        } else {
            return response()->json(['message' => 'Data not found'], 404);
        }
    }

    // Update the RepassageProduction value for a specific model
    public function update(Request $request, $modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'production_repassage']);

        $request->validate([
            'value' => 'required|integer',
            'entre' => 'required|integer',
            'encore' => 'required|integer'
        ]);

        $repassageProduction = RepassageProduction::updateOrCreate(
            ['model_id' => $modelId],
            [
                'value' => $request->value,
                'entre' => $request->entre,
                'encore' => $request->encore
            ]
        );

        return response()->json($repassageProduction, 200);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
