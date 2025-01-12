<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Room;
use App\Models\Booking;

class BookingControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_a_booking()
    {
        $user = User::factory()->create();
        $room = Room::factory()->create();

        $payload = [
            'user_id' => $user->id,
            'room_id' => $room->id,
            'date' => '2025-01-10',
            'time' => '10:00:00',
            'duration' => 2,
            'status' => 'pending',
            'purpose' => 'Meeting',
        ];

        $response = $this->postJson('/bookings', $payload);

        $response->assertStatus(201)
                 ->assertJson(['message' => 'Booking created successfully']);

        $this->assertDatabaseHas('bookings', $payload);
    }

    /** @test */
    public function it_updates_a_booking()
    {
        $booking = Booking::factory()->create([
            'status' => 'pending',
        ]);

        $payload = [
            'status' => 'approved',
        ];

        $response = $this->putJson("/bookings/{$booking->id}", $payload);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Booking updated successfully']);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'approved',
        ]);
    }

    /** @test */
    public function it_updates_booking_status()
    {
        $booking = Booking::factory()->create([
            'status' => 'pending',
        ]);

        $payload = [
            'status' => 'approved',
        ];

        $response = $this->putJson("/bookings/{$booking->id}/status", $payload);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Booking status updated successfully']);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'approved',
        ]);
    }

    /** @test */
    public function it_deletes_a_booking()
    {
        $booking = Booking::factory()->create();

        $response = $this->deleteJson("/bookings/{$booking->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Booking deleted successfully']);

        $this->assertDatabaseMissing('bookings', [
            'id' => $booking->id,
        ]);
    }

    /** @test */
    public function it_shows_bookings_for_a_user()
    {
        $user = User::factory()->create();
        $bookings = Booking::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->getJson("/bookings/user/{$user->id}");

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'bookings');
    }

    /** @test */
    public function it_handles_conflicting_bookings_during_update()
    {
        $room = Room::factory()->create();

        Booking::factory()->create([
            'room_id' => $room->id,
            'date' => '2025-01-10',
            'time' => '10:00:00',
            'duration' => 2,
        ]);

        $bookingToUpdate = Booking::factory()->create([
            'room_id' => $room->id,
            'date' => '2025-01-11',
            'time' => '12:00:00',
            'duration' => 2,
        ]);

        $payload = [
            'room_id' => $room->id,
            'date' => '2025-01-10',
            'time' => '11:00:00',
            'duration' => 2,
        ];

        $response = $this->putJson("/bookings/{$bookingToUpdate->id}", $payload);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Room is already booked for the selected time period']);
    }
}
