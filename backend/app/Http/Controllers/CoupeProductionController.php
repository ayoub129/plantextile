<?php

namespace App\Http\Controllers;

use App\Models\CoupeProduction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CoupeProductionController extends Controller
{
    // Fetch the CoupeProduction data for a specific model
    public function show($modelId)
    {
        $totalValue = CoupeProduction::where('model_id', $modelId)->sum('value');
        if($totalValue) {
            return response()->json($totalValue);
        } else {
            return response()->json(['message' => 'Data not found'], 404);
        }
    }

    // Update the CoupeProduction value for a specific model
    public function update(Request $request, $modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Production_coupe']);

        $request->validate([
            'value' => 'required|integer'
        ]);

        $coupeProduction = CoupeProduction::create([
            'model_id' => $modelId,
            'value' => $request->value
        ]);

        return response()->json($coupeProduction, 201);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }

}