<?php

namespace Tests\Feature\Api\Auth;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    private string $endpoint = '/api/auth/login';

    private function createPatientUser(array $overrides = []): User
    {
        $user = User::factory()->create(array_merge([
            'email'    => 'handika@example.com',
            'password' => Hash::make('Password123!'),
            'role'     => 'patient',
            'status'   => 'active',
        ], $overrides));

        Patient::factory()->create([
            'user_id' => $user->id,
            'name'    => 'Handika Testing',
            'phone'   => '081234567890',
        ]);

        return $user;
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $this->createPatientUser();

        $response = $this->postJson($this->endpoint, [
            'email'    => 'handika@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'user' => [
                        'id',
                        'email',
                        'role',
                        'status',
                        'profile' => [
                            'patient_id',
                            'name',
                            'phone',
                        ],
                    ],
                ],
            ])
            ->assertJsonPath('data.user.email', 'handika@example.com')
            ->assertJsonPath('data.user.role', 'patient');
    }

    public function test_login_response_does_not_contain_bearer_token(): void
    {
        $this->createPatientUser();

        $response = $this->postJson($this->endpoint, [
            'email'    => 'handika@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertJsonMissingPath('data.token');
        $response->assertJsonMissingPath('data.token_type');
    }

    public function test_login_authenticates_user_in_session(): void
    {
        $user = $this->createPatientUser();

        $this->postJson($this->endpoint, [
            'email'    => 'handika@example.com',
            'password' => 'Password123!',
        ]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $this->createPatientUser();

        $response = $this->postJson($this->endpoint, [
            'email'    => 'handika@example.com',
            'password' => 'WrongPassword!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        $this->assertGuest();
    }

    public function test_login_fails_when_email_not_registered(): void
    {
        $response = $this->postJson($this->endpoint, [
            'email'    => 'notfound@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        $this->assertGuest();
    }

    public function test_login_fails_when_email_missing(): void
    {
        $response = $this->postJson($this->endpoint, [
            'password' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_fails_when_password_missing(): void
    {
        $this->createPatientUser();

        $response = $this->postJson($this->endpoint, [
            'email' => 'handika@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_login_fails_when_email_format_invalid(): void
    {
        $response = $this->postJson($this->endpoint, [
            'email'    => 'not-an-email',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_login_is_rate_limited_after_too_many_attempts(): void
    {
        $this->createPatientUser();

        for ($i = 0; $i < 5; $i++) {
            $this->postJson($this->endpoint, [
                'email'    => 'handika@example.com',
                'password' => 'WrongPassword!',
            ]);
        }

        $response = $this->postJson($this->endpoint, [
            'email'    => 'handika@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        $this->assertGuest();
    }

    public function test_already_authenticated_user_cannot_hit_login_due_to_guest_middleware(): void
    {
        $user = $this->createPatientUser();

        $response = $this->actingAs($user)->postJson($this->endpoint, [
            'email'    => 'handika@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(409);
    }
}
