<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    public function toggleBlock($id)
    {
        $room = Room::findOrFail($id);
    
        
        $room->isBlocked = !$room->isBlocked;
        $room->save();
    
        return response()->json([
            'message' => 'Room block status updated successfully',
            'isBlocked' => $room->isBlocked
        ]);
    }
    public function index()
    {
        $rooms = Room::all();
        return response()->json([
            'message' => 'Rooms retrieved successfully',
            'rooms' => $rooms,
        ], 200);
    }

   

public function create()
{
    return Inertia::render('Rooms/Create');
}


    
    public function store(Request $request)
    {
        $request->validate([
            'room' => 'required|unique:rooms,room|max:255',
            'capacity' => 'required|integer|min:1',
            'type' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);
    
        $data = $request->all();
    
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('room_images', 'public');
            $data['image'] = $imagePath;
        }
    
        Room::create($data);
        return response()->json(['message' => 'Room booked successful'], 201);
    }
   


    public function edit($id)
    {
        $room = Room::findOrFail($id);
        
      
        return Inertia::render('EditRoom', [
            'room' => $room
        ]);
    }
    
   
    public function update(Request $request, $id)
    {
        $request->validate([
            'room' => 'required|max:255|unique:rooms,room,' . $id,
            'capacity' => 'required|integer|min:1',
            'type' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        $room = Room::findOrFail($id);
        $data = $request->only(['room', 'capacity', 'type', 'location']);
    
        if ($request->hasFile('image')) {
            if ($room->image) {
                Storage::disk('public')->delete($room->image);
            }
            $imagePath = $request->file('image')->store('room_images', 'public');
            $data['image'] = $imagePath;
        }
    
        $room->update($data);
    
        return response()->json(['message' => 'Room updated successfully'], 201);
    }
    

    
    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json(['message' => 'Room Deleted successful'], 201);
    }
}
