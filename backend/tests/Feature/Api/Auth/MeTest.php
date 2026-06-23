<?php

namespace Tests\Feature\Api\Auth;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class MeTest extends TestCase
{
    use RefreshDatabase;

    private string $endpoint = '/api/auth/me';

    private function createPatientUser(array $patientOverrides = []): User
    {
        $user = User::factory()->create([
            'role'   => 'patient',
            'status' => 'active',
        ]);

        Patient::factory()->create(array_merge([
            'user_id' => $user->id,
            'name'    => 'Handika Testing',
            'phone'   => '081234567890',
        ], $patientOverrides));

        return $user;
    }

    public function test_authenticated_user_can_get_own_data(): void
    {
        $user = $this->createPatientUser();

        $response = $this->actingAs($user)->getJson($this->endpoint);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'email',
                    'role',
                    'status',
                    'profile' => [
                        'patient_id',
                        'name',
                        'phone',
                        'bpjs_number',
                        'birth_place',
                        'birth_date',
                        'gender',
                        'user_id',
                    ],
                ],
            ])
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonPath('data.role', 'patient')
            ->assertJsonPath('data.profile.name', 'Handika Testing');
    }

    public function test_guest_cannot_access_me_endpoint(): void
    {
        $response = $this->getJson($this->endpoint);

        $response->assertStatus(401);
    }

    public function test_me_returns_correct_user_when_multiple_users_exist(): void
    {
        $otherUser = $this->createPatientUser();
        $targetUser = $this->createPatientUser();

        $response = $this->actingAs($targetUser)->getJson($this->endpoint);

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $targetUser->id)
            ->assertJsonPath('data.email', $targetUser->email);

        $this->assertNotEquals($otherUser->id, $response->json('data.id'));
    }

    public function test_me_profile_reflects_nullable_fields_as_null_when_not_filled(): void
    {
        $user = $this->createPatientUser([
            'bpjs_number' => null,
            'birth_place' => null,
            'birth_date'  => null,
            'gender'      => null,
        ]);

        $response = $this->actingAs($user)->getJson($this->endpoint);

        $response->assertStatus(200)
            ->assertJsonPath('data.profile.bpjs_number', null)
            ->assertJsonPath('data.profile.birth_place', null)
            ->assertJsonPath('data.profile.birth_date', null)
            ->assertJsonPath('data.profile.gender', null);
    }
}
