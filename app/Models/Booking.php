<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Booking extends Model
{
   
    protected $fillable = [
        'date',
        'time',
       ' duration',
        'status',
        'purpose',  
        'user_id',
        'room_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

   
    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

   

 
    
}
