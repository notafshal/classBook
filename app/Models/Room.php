<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'room',
        'capacity',
        'type',
        'location',
        'image',
        'isBlocked'
    ];
}
