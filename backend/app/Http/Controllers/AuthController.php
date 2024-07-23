<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    // login function 
    public function login(Request $request)
    {
        // accept two parameters: email and password
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // add them as a variable
        $credentials = request(['email', 'password']);

        // attepmt to login the user with the credentials
        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // if the user exist them login and send a token to the frontend
        $user = $request->user();
        $token = $user->createToken('token-name')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function getProfilePicture()
    {
        $user = Auth::user();

        if ($user->image) {
            return response()->json(['image' => $user->image]);
        } else {
            return response()->json(['message' => 'No profile picture found'], 202);
        }
    }

    public function index()
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'RH']);
        $excludedRoles = ['developer', 'superadmin', 'admin'];

        $users = User::whereNotIn('role', $excludedRoles)->get();
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'RH']);

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

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:8|confirmed',
            'role' => 'sometimes|required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($user->image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $user->image));
            }
            // Store the new image
            $imagePath = $request->file('image')->store('images', 'public');
            $validatedData['image'] = Storage::url($imagePath);
        }
    
        $user->update($validatedData);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ], 200);
    }

    public function destroy($id)
    {
        $this->authorize(['developer', 'superadmin', 'admin', 'RH']);

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        // Validate the new password
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        // Check if the current password is correct
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        // Update the password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully'], 200);
    }


    private function authorize(array $roles)
    {
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
