<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Booking extends Model
{
    // Define which fields are mass assignable
    protected $fillable = [
        'date',
        'time',
       ' duration',
        'status',
        'purpose',  
        'user_id',
        'room_id',
    ];


    // Relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship with the Room model
    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

   

 
    
}
