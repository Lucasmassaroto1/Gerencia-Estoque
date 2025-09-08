<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller{
  // regra: min 8, 1 maiúscula, 1 número, 1 especial
  private const STRONG_PASSWORD_REGEX = '/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/';

  public function register(Request $request): JsonResponse{
    $data = $request->validate([
        'name'     => ['required','string','max:255'],
        'email'    => ['required','email','max:255', Rule::unique('users','email')],
        'password' => ['required','string','regex:'.self::STRONG_PASSWORD_REGEX],
      ],
      [
        'password.regex' => 'A senha deve ter 8+ caracteres, 1 maiúscula, 1 número e 1 símbolo.',
      ]
    );

    $user = User::create([
      'name'     => $data['name'],
      'email'    => $data['email'],
      'password' => Hash::make($data['password']),
      'role'     => 'rep', // padrão
    ]);

    Auth::login($user);

    return response()->json([
      'ok' => true,
      'redirect' => '/login',
      'user' => [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
      ],
    ], 201);
  }

  public function login(Request $request): JsonResponse{
    $credentials = $request->validate([
      'email'    => ['required','email'],
      'password' => ['required','string'],
    ]);

    if (!Auth::attempt($credentials, true)) {
      return response()->json([
        'ok' => false,
        'message' => 'Credenciais inválidas.',
      ], 401);
    }

    $request->session()->regenerate();

    return response()->json([
      'ok' => true,
      'redirect' => '/',
    ]);

  }

  public function logout(Request $request): JsonResponse{
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json([
      'ok' => true,
      'redirect' => '/login',
    ]);
  }

}
