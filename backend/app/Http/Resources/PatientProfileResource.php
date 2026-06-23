<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'patient_id'  => $this->patient_id,
            'name'        => $this->name,
            'phone'       => $this->phone,
            'bpjs_number' => $this->bpjs_number,
            'birth_place' => $this->birth_place,
            'birth_date'  => $this->birth_date?->format('Y-m-d'),
            'gender'      => $this->gender,
            'user_id'     => $this->user_id,
        ];
    }
}
