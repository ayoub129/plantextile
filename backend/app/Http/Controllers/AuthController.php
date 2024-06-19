<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json(['token' => $token, 'user' => $user]);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $this->authorize(['developer', 'super-admin', 'admin']);

        $users = User::all();
        return response()->json($users);
    }

    /**
     * Display a single user.
     */
    public function show($id)
    {
        $this->authorize(['developer', 'super-admin', 'admin']);

        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Create a new user.
     */
    public function store(Request $request)
    {
        $this->authorize(['developer', 'super-admin', 'admin']);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'authorization_level' => 'required|string',
        ]);

        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'authorization_level' => $request->authorization_level,
        ]);

        $user->save();

        return response()->json($user, 201);
    }

    /**
     * Update an existing user.
     */
    public function update(Request $request, $id)
    {
        $this->authorize(['developer', 'super-admin', 'admin']);

        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:8|confirmed',
            'authorization_level' => 'sometimes|required|string',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }
        if ($request->has('authorization_level')) {
            $user->authorization_level = $request->authorization_level;
        }

        $user->save();

        return response()->json($user, 200);
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        $this->authorize(['developer', 'super-admin']);

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }

    /**
     * Authorization check.
     */
    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->authorization_level, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
