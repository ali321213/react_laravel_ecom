<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /* Register User (Customer by default) */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'status'   => 'active',
        ]);
        $user->assignRole('customer');
        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    /* Login User */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);
        $user = User::where('email', $request->email)->first();
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }
        if (! $user->isActive()) {
            return response()->json(['message' => 'Account is inactive'], 403);
        }
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);
        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    /* Logout */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    /* Get Authenticated User */
    public function me(Request $request)
    {
        return response()->json($request->user()->load('roles'));
    }
}
