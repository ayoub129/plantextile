<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::all();
        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $request->validate([
            'logistique' => 'nullable|string',
            'la_coupe' => 'nullable|string',
            'production' => 'nullable|string',
            'repassage' => 'nullable|string',
            'control_final' => 'nullable|string',
            'depot' => 'nullable|string',
        ]);

        $post = Post::create($request->all());
        return response()->json($post, 201);
    }

    public function show($id)
    {
        $post = Post::findOrFail($id);
        return response()->json($post);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'logistique' => 'nullable|string',
            'la_coupe' => 'nullable|string',
            'production' => 'nullable|string',
            'repassage' => 'nullable|string',
            'control_final' => 'nullable|string',
            'depot' => 'nullable|string',
        ]);

        $post = Post::findOrFail($id);
        $post->update($request->all());
        return response()->json($post);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return response()->json(null, 204);
    }
}
