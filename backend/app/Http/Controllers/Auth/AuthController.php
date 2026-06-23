<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        $relation = match ($user->role) {
            'patient' => 'patient',
            default   => 'patient', // expand di EPIC 2
        };

        return response()->json([
            'data' => new UserResource($user->load($relation)),
        ]);
    }
}
