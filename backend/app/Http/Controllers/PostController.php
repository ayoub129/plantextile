<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index()
    {
        $posts = Posts::all();
        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Méthode']);

        $request->validate([
            'name' => 'required|string',
        ]);

        $post = Posts::create($request->all());
        return response()->json($post, 201);
    }

    public function show($id)
    {
        $post = Posts::findOrFail($id);
        return response()->json($post);
    }

    public function update(Request $request, $id)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Méthode']);

        $request->validate([
            'name' => 'required|string',
        ]);

        $post = Posts::findOrFail($id);
        $post->update($request->all());
        return response()->json($post);
    }

    public function destroy($id)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'Méthode']);

        $post = Posts::findOrFail($id);
        $post->delete();
        return response()->json(null, 204);
    }

    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }

}
