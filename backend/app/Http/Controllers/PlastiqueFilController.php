<?php

namespace App\Http\Controllers;

use App\Models\PlastiqueFil;
use Illuminate\Http\Request;

class PlastiqueFilController extends Controller
{
    public function show($model_id)
    {
        $data = PlastiqueFil::where('model_id', $model_id)->first();
        return response()->json($data);
    }

    public function store(Request $request, $model_id)
    {
        $validatedData = $request->validate([
            'plastiqueReal' => 'required|integer',
            'filReal' => 'required|integer',
        ]);

        $data = PlastiqueFil::updateOrCreate(
            ['model_id' => $model_id],
            [
                'plastique_real' => $validatedData['plastiqueReal'],
                'fil_real' => $validatedData['filReal'],
            ]
        );

        return response()->json($data, 201);
    }
}
