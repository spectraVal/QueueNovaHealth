<?php

namespace Tests\Feature\Api\Auth;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LogoutTest extends TestCase
{
    use RefreshDatabase;

    private string $endpoint = '/api/auth/logout';

    private function createPatientUser(): User
    {
        $user = User::factory()->create([
            'role'   => 'patient',
            'status' => 'active',
        ]);

        Patient::factory()->create([
            'user_id' => $user->id,
        ]);

        return $user;
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = $this->createPatientUser();

        $response = $this->actingAs($user, 'web')->postJson($this->endpoint);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Logout Successful.',
            ]);
    }

    public function test_logout_invalidates_session(): void
    {
        $user = $this->createPatientUser();

        $this->actingAs($user, 'web')->postJson($this->endpoint);

        $this->app['auth']->forgetGuards();
        $this->flushSession();

        $response = $this->postJson($this->endpoint);
        $response->assertStatus(401);
    }

    public function test_guest_cannot_logout(): void
    {
        $response = $this->postJson($this->endpoint);

        $response->assertStatus(401);
    }

    public function test_logout_followed_by_protected_route_returns_unauthenticated(): void
    {
        $response = $this->getJson('/api/auth/me');
        $response->assertStatus(401);
    }

    public function test_logout_clears_session_data(): void
    {
        $user = $this->createPatientUser();

        $this->actingAs($user, 'web')->postJson($this->endpoint);
        $this->assertGuest('web');
    }
}
