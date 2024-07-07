<?php

namespace App\Http\Controllers;

use App\Models\CoupeProduction;
use Illuminate\Http\Request;

class CoupeProductionController extends Controller
{
    public function index()
    {
        $coupeProductions = CoupeProduction::all();
        return response()->json($coupeProductions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'model_id' => 'required|exists:models,id',
            'day' => 'required|string',
            'hour' => 'required|string',
            'value' => 'required|integer',
        ]);

        $coupeProduction = CoupeProduction::create($request->all());
        return response()->json($coupeProduction, 201);
    }

    public function show(Request $request)
    {
        $request->validate([
            'day' => 'required|string',
            'hour' => 'required|string',
            'model_id' => 'required|exists:models,id',
        ]);

        $coupeProductions = CoupeProduction::where('day', $request->day)
                                           ->where('hour', $request->hour)
                                           ->where('model_id', $request->model_id)
                                           ->get();
        return response()->json($coupeProductions);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'model_id' => 'required|exists:models,id',
            'day' => 'required|string',
            'hour' => 'required|string',
            'value' => 'required|integer',
        ]);

        $coupeProduction = CoupeProduction::findOrFail($id);
        $coupeProduction->update($request->all());
        return response()->json($coupeProduction, 200);
    }

    public function destroy($id)
    {
        $coupeProduction = CoupeProduction::findOrFail($id);
        $coupeProduction->delete();
        return response()->json(null, 204);
    }
}