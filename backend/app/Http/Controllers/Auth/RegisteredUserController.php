<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */


    public function __construct(private AuthService $authService) {}

    public function store(RegisterRequest $request): JsonResponse
    {
        $user = $this->authService->registerPatient($request->validated());

        return response()->json([
            'message' => 'Register Success',
            'data'    => new UserResource($user),
        ], 201);
    }
}
