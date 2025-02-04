<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;
    public function test_login_performance()
    {
        $user = User::factory()->create([
            'name' => 'testuser',
            'email' => 'testuser@example.com',
            'password' => bcrypt('password123'),
        ]);

        $loginData = [
            'loginname' => 'testuser',
            'loginpassword' => 'password123',
        ];

        $start = microtime(true);

        $response = $this->postJson('/login', $loginData);

        $end = microtime(true);
        $executionTime = $end - $start;

        // You can set a threshold for how long it should take
        $this->assertLessThan(3, $executionTime);  // Make sure the login completes in less than 2 seconds
        
        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Login successful',
        ]);
    }
    public function test_register_performance()
{
    $registerData = [
        'name' => 'newuser',
        'email' => 'newuser@example.com',
        'password' => 'password123',
        'role' => 'student',
    ];

    $start = microtime(true);

    $response = $this->postJson('/register', $registerData);

    $end = microtime(true);
    $executionTime = $end - $start;

    $this->assertLessThan(2, $executionTime);  // Registration should complete in less than 2 seconds

    $response->assertStatus(201);
    $response->assertJson([
        'message' => 'Registration successful',
    ]);
}

    /** @test */
    public function it_registers_a_user()
    {
        $payload = [
            'name' => 'TestUser',
            'email' => 'testuser@example.com',
            'password' => 'password123',
            'role' => 'student',
        ];

        $response = $this->postJson('/register', $payload);

        $response->assertStatus(201)
                 ->assertJson(['message' => 'Registration successful']);

        $this->assertDatabaseHas('users', [
            'name' => 'TestUser',
            'email' => 'testuser@example.com',
            'role' => 'student',
        ]);
    }

    /** @test */
    public function it_logs_in_a_user()
    {
        $user = User::factory()->create([
            'name' => 'TestUser',
            'password' => Hash::make('password123'),
        ]);

        $payload = [
            'loginname' => 'TestUser',
            'loginpassword' => 'password123',
        ];

        $response = $this->postJson('/login', $payload);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Login successful']);

        $this->assertAuthenticatedAs($user);
    }

    /** @test */
    public function it_fails_to_log_in_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'name' => 'TestUser',
            'password' => Hash::make('password123'),
        ]);

        $payload = [
            'loginname' => 'TestUser',
            'loginpassword' => 'wrongpassword',
        ];

        $response = $this->postJson('/login', $payload);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Invalid login credentials']);

        $this->assertGuest();
    }

    /** @test */
    public function it_logs_out_a_user()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson('/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Logout successful']);

        $this->assertGuest();
    }

    /** @test */
    public function it_retrieves_a_user()
    {
        $user = User::factory()->create();

        $response = $this->getJson("/user/{$user->id}");

        $response->assertStatus(200)
        ->assertJsonPath('message', 'User retrieved successfully')
        ->assertJsonPath('user.id', $user->id)
        ->assertJsonPath('user.name', $user->name)
        ->assertJsonPath('user.email', $user->email);
    }

    /** @test */
    public function it_updates_a_user()
    {
        $user = User::factory()->create([
            'name' => 'OldName',
            'email' => 'oldemail@example.com',
            'role' => 'student',
        ]);

        $payload = [
            'name' => 'NewName',
            'email' => 'newemail@example.com',
            'password' => 'newpassword123',
            'role' => 'admin',
        ];

        $response = $this->putJson("/user/{$user->id}", $payload);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'User updated successfully']);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'NewName',
            'email' => 'newemail@example.com',
            'role' => 'admin',
        ]);

        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }
}
