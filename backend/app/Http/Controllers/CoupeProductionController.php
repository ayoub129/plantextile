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
        $this->authorize(['developer', 'superadmin', 'admin', 'Production_coupe']);

        $coupeProduction = CoupeProduction::where('model_id', $modelId)->first();
        if ($coupeProduction) {
            return response()->json($coupeProduction);
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

        $coupeProduction = CoupeProduction::updateOrCreate(
            ['model_id' => $modelId],
            ['value' => $request->value]
        );

        return response()->json($coupeProduction, 200);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }

}