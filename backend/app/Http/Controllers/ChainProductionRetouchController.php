<?php

namespace App\Http\Controllers;

use App\Models\ChainProductionRetouch;
use Illuminate\Http\Request;

class ChainProductionRetouchController extends Controller
{
    public function index()
    {
        $retouches = ChainProductionRetouch::with(['chain', 'model', 'post'])->get();
        return response()->json($retouches);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'chain_id' => 'nullable',
            'model_id' => 'required|exists:models,id',
            'value' => 'required|integer',
            'post_id' => 'required|exists:posts,id',
        ]);

        $retouch = ChainProductionRetouch::create($validatedData);
        return response()->json($retouch, 201);
    }
}
