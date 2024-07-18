<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MagasinFournitureProduction;

class MagasinFournitureProductionController extends Controller
{
    // Fetch the RepassageProduction data for a specific model
    public function show($modelId)
    {
        $repassageProduction = MagasinFournitureProduction::where('model_id', $modelId)->first();
        if ($repassageProduction) {
            return response()->json($repassageProduction);
        } else {
            return response()->json(['message' => 'Data not found'], 404);
        }
    }

    // Update the RepassageProduction value for a specific model
    public function update(Request $request, $modelId)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Magasin_fourniture']);

        $request->validate([
            'value' => 'required|integer',
        ]);

        $repassageProduction = MagasinFournitureProduction::updateOrCreate(
            ['model_id' => $modelId],
            [
                'value' => $request->value,
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
