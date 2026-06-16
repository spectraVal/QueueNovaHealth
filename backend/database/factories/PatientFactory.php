<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'        => $this->faker->name(),
            'phone'       => $this->faker->numerify('08##########'),
            'bpjs_number' => null,
            'birth_place' => null,
            'birth_date'  => null,
            'gender'      => null,
        ];
    }
}
