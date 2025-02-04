<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Room;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ClassroomControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_toggle_room_block_status()
    {
        // Create an admin user and authenticate
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);
        $this->actingAs($admin);

        // Create a room
        $room = Room::factory()->create(['isBlocked' => false]);

        // Make the request as the authenticated admin
        $response = $this->json('POST', route('toggleBlock', $room->id));

        // Assertions
        $response->assertStatus(200)
                 ->assertJson(['message' => 'Room block status updated successfully']);

        $this->assertDatabaseHas('rooms', ['id' => $room->id, 'isBlocked' => true]);
    }

    /** @test */
    public function it_can_retrieve_all_rooms()
    {
        Room::factory()->count(3)->create();

        $response = $this->getJson(route('index'));

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'rooms']);
    }

    /** @test */
    public function test_it_can_store_a_new_room() 
{
    Storage::fake('public');
    $image = UploadedFile::fake()->image('room.jpg');
    $this->withoutMiddleware();
    // Create and authenticate a user
    $admin = User::factory()->create(['role' => 'admin']); 
$this->actingAs($admin);
    $roomData = [
        'room' => 'Room 101',
        'capacity' => 20,
        'type' => 'Lecture',
        'location' => 'Building A',
        'image' => $image,
    ];

    $response = $this->postJson(route('store'), $roomData);

    // Debugging: Dump the response if test fails
    $response->dump();

    $response->assertStatus(201)
             ->assertJson(['message' => 'Room booked successful']);

    $this->assertDatabaseHas('rooms', ['room' => 'Room 101']);
}

    /** @test */
    public function it_can_update_a_room()
    {
        $room = Room::factory()->create();
        $this->withoutMiddleware();
        $updatedData = [
            'room' => 'Updated Room',
            'capacity' => 30,
            'type' => 'Lab',
            'location' => 'Building B',
        ];

        $response = $this->putJson(route('update', $room->id), $updatedData);

        $response->assertStatus(201)
                 ->assertJson(['message' => 'Room updated successfully']);

        $this->assertDatabaseHas('rooms', ['id' => $room->id, 'room' => 'Updated Room']);
    }

    /** @test */
    public function it_can_delete_a_room()
    {
        $room = Room::factory()->create();
        $this->withoutMiddleware();
        $response = $this->deleteJson(route('destroy', $room->id));

        $response->assertStatus(201)
                 ->assertJson(['message' => 'Room Deleted successful']);

        $this->assertDatabaseMissing('rooms', ['id' => $room->id]);
    }
}
