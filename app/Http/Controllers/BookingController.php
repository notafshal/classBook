<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Inertia\Inertia;

class BookingController extends Controller
{


    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,approved,cancelled',
        ]);

        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $booking->status = $request->status;
        $booking->save();

        return response()->json([
            'message' => 'Booking status updated successfully',
            'booking' => $booking,
        ], 200);
    }

   
    public function index()
    {
        $bookings = Booking::with(['user', 'room'])->get();
        return response()->json(['data' => $bookings]);
    }

    
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'room_id' => 'required|exists:rooms,id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i:s',
            'duration' => 'required|integer|min:1',
            'status' => 'required|string',
            'purpose' => 'sometimes|required|string',
        ]);
        $datetime = $validatedData['date'] . ' ' . $validatedData['time'];
        $validatedData['time'] = $datetime;
       


        $booking = Booking::create([
            'date' => $validatedData['date'],
            'time' => $validatedData['time'],
            'duration' => $validatedData['duration'],
            'status' => $validatedData['status'],
            'purpose' => $validatedData['purpose'] ?? null,
            'user_id' => $validatedData['user_id'],
            'room_id' => $validatedData['room_id'],
        ]);

        return response()->json(['message' => 'Booking created successfully', 'data' => $booking], 201);
    }

    

    public function show($userId)
    {
        $bookings = Booking::with(['user', 'room'])
                            ->where('user_id', $userId)
                            ->get();
    
        if (request()->wantsJson()) {
            
            return response()->json(['bookings' => $bookings]);
        }
    
        
        return Inertia::render('ViewBooking', [
            'bookings' => $bookings
        ]);
    }
    

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $validatedData = $request->validate([
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required|date_format:H:i',
            'duration' => 'sometimes|required|integer|min:1',
            'purpose' => 'sometimes|required|string',
            'status' => 'sometimes|required|string',
            'user_id' => 'sometimes|required|exists:users,id',
            'room_id' => 'sometimes|required|exists:rooms,id',
        ]);

        if (isset($validatedData['date']) && isset($validatedData['time']) && isset($validatedData['duration'])) {
            $bookingStart = $validatedData['date'] . ' ' . $validatedData['time'];
            $bookingEnd = (new \DateTime($bookingStart))
                ->modify('+' . $validatedData['duration'] . ' hours')
                ->format('Y-m-d H:i:s');

            $conflictingBooking = Booking::where('room_id', $validatedData['room_id'])
                ->where('id', '!=', $id)
                ->where(function ($query) use ($bookingStart, $bookingEnd) {
                    $query->whereBetween('date', [$bookingStart, $bookingEnd])
                          ->orWhere(function ($query) use ($bookingStart, $bookingEnd) {
                              $query->whereRaw('DATE_ADD(date, INTERVAL duration HOUR) > ?', [$bookingStart])
                                    ->where('date', '<', $bookingEnd);
                          });
                })->exists();

            if ($conflictingBooking) {
                return response()->json(['message' => 'Room is already booked for the selected time period'], 422);
            }
        }

        $booking->update($validatedData);

        return response()->json(['message' => 'Booking updated successfully', 'data' => $booking]);
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }

    public function checkAvailability(Request $request)
{
    $validatedData = $request->validate([
        'room_id' => 'required|exists:rooms,id',
        'date' => 'required|date',
        'time' => 'required|date_format:H:i:s',
        'duration' => 'required|integer|min:1',
    ]);

    $startDateTime = new \DateTime($validatedData['date'] . ' ' . $validatedData['time']);
    $endDateTime = (clone $startDateTime)->modify('+' . $validatedData['duration'] . ' hours');

    $conflictingBookings = Booking::where('room_id', $validatedData['room_id'])
        ->where('date', $validatedData['date'])
        ->where(function ($query) use ($startDateTime, $endDateTime) {
            $query->whereBetween('time', [$startDateTime, $endDateTime])
                ->orWhereRaw('? BETWEEN time AND ADDTIME(time, SEC_TO_TIME(duration * 3600))', [$startDateTime]);
        })
        ->exists();

    if ($conflictingBookings) {
        return response()->json(['message' => 'Room is not available for the selected time'], 409);
    }

    return response()->json(['message' => 'Room is available']);
}

}
