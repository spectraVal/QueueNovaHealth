<?php

namespace App\Services;

use App\Models\User;

interface AuthService
{
    public function registerPatient(array $data): User;

}
