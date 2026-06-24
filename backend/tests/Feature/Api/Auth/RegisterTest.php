<?php

namespace Tests\Feature\Api\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    private string $endpoint = '/api/auth/register';

    public function test_patient_can_register_with_valid_data(): void
    {
        $payload = [
            'name'                  => 'Handika Testing',
            'email'                 => 'handika@example.com',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->postJson($this->endpoint, $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'email',
                    'role',
                    'status',
                    'profile' => [
                        'patient_id',
                        'name',
                        'bpjs_number',
                        'birth_place',
                        'birth_date',
                        'gender',
                        'user_id',
                    ],
                ],
            ])
            ->assertJsonPath('data.email', 'handika@example.com')
            ->assertJsonPath('data.role', 'patient')
            ->assertJsonPath('data.status', 'active')
            ->assertJsonPath('data.profile.name', 'Handika Testing');

        $this->assertDatabaseHas('users', [
            'email' => 'handika@example.com',
            'role'  => 'patient',
        ]);

        $user = User::where('email', 'handika@example.com')->first();

        $this->assertDatabaseHas('patients', [
            'user_id' => $user->id,
            'name'    => 'Handika Testing',
        ]);
    }

    public function test_register_hashes_password(): void
    {
        $payload = [
            'name'                  => 'Handika Testing',
            'email'                 => 'handika@example.com',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $this->postJson($this->endpoint, $payload);

        $user = User::where('email', 'handika@example.com')->first();

        $this->assertNotEquals('Password123!', $user->password);
        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('Password123!', $user->password));
    }

    public function test_register_fails_when_email_already_taken(): void
    {
        User::factory()->create(['email' => 'handika@example.com']);

        $payload = [
            'name'                  => 'Handika Testing',
            'email'                 => 'handika@example.com',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->postJson($this->endpoint, $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_fails_when_password_confirmation_does_not_match(): void
    {
        $payload = [
            'name'                  => 'Handika Testing',
            'email'                 => 'handika@example.com',
            'password'              => 'Password123!',
            'password_confirmation' => 'WrongPassword!',
        ];

        $response = $this->postJson($this->endpoint, $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_register_fails_when_password_too_short(): void
    {
        $payload = [
            'name'                  => 'Handika Testing',
            'email'                 => 'handika@example.com',
            'password'              => 'short',
            'password_confirmation' => 'short',
        ];

        $response = $this->postJson($this->endpoint, $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    #[DataProvider('missingFieldProvider')]
    public function test_register_fails_when_required_field_missing(string $field): void
    {
        $payload = [
            'name'                  => 'Handika Testing',
            'email'                 => 'handika@example.com',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        unset($payload[$field]);

        $response = $this->postJson($this->endpoint, $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([$field]);
    }

    public static function missingFieldProvider(): array
    {
        return [
            'missing name'     => ['name'],
            'missing email'    => ['email'],
            'missing password' => ['password'],
        ];
    }

    public function test_register_fails_when_email_format_invalid(): void
    {
        $payload = [
            'name'                  => 'Handika Testing',
            'email'                 => 'not-an-email',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->postJson($this->endpoint, $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_register_does_not_create_patient_record_if_validation_fails(): void
    {
        $payload = [
            'name'                  => 'Handika Testing',
            'email'                 => 'not-an-email',
            'password'              => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $this->postJson($this->endpoint, $payload);

        $this->assertDatabaseCount('patients', 0);
        $this->assertDatabaseCount('users', 0);
    }
}
