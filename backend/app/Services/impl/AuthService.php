<?php

namespace App\Services\impl;

use App\Models\Patient;
use App\Models\User;

class AuthService implements \App\Services\AuthService
{
    public function registerPatient(array $data): User
    {
        $user = User::create([
            'email'    => $data['email'],
            'password' => $data['password'],
            'role'     => 'patient',
            'status'   => 'active',
        ]);

        Patient::create([
            'user_id' => $user->id,
            'name'    => $data['name'],
            'phone'   => $data['phone'],
        ]);

        return $user->load('patient');
    }
}
