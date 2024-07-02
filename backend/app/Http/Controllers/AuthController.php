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
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = request(['email', 'password']);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = $request->user();
        $token = $user->createToken('token-name')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $this->authorize(['developer', 'superadmin', 'admin' , 'HR']);
        $excludedRoles = ['developer', 'superadmin', 'admin'];

        $users = User::whereNotIn('role', $excludedRoles)->get();
        return response()->json($users);
    }

    /**
     * Display a single user.
     */
    public function show($id)
    {
        $this->authorize(['developer', 'superadmin', 'admin' , 'HR']);
        $excludedRoles = ['developer', 'superadmin', 'admin', 'HR'];
        $user = User::findOrFail($id);

        if (in_array($user->role, $excludedRoles)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($user);
    }

    /**
     * Create a new user.
     */
    public function store(Request $request)
    {
        $this->authorize(['developer', 'superadmin', 'admin' , 'HR']);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string',
        ]);

        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $user->save();

        return response()->json($user, 201);
    }

    /**
     * Update an existing user.
     */
    public function update(Request $request, $id)
    {
        $this->authorize(['developer', 'superadmin', 'admin' , 'HR']);

        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:8|confirmed',
            'role' => 'sometimes|required|string',
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
        if ($request->has('role')) {
            $user->role = $request->role;
        }

        $user->save();

        return response()->json($user, 200);
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        $this->authorize(['developer', 'superadmin', 'admin' , 'HR']);

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }

    /**
     * Authorization check.
     */
    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
