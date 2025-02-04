<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    protected $model = \App\Models\Room::class;

    public function definition()
    {
        return [
            'room' => $this->faker->unique()->word, 
            'capacity' => $this->faker->numberBetween(10, 100),
            'type' => $this->faker->randomElement(['Lecture', 'Lab', 'Seminar']),
            'location' => $this->faker->address,
            'image' => null,
            'isBlocked' => false,
        ];
    }
}
