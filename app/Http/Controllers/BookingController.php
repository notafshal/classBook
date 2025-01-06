<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    /**
     * Display all bookings.
     */
    public function index()
    {
        $bookings = Booking::with(['user', 'room'])->get();
        return response()->json(['data' => $bookings]);
    }

    /**
     * Store a new booking.
     */
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

    public function show($id)
    {
        $booking = Booking::with(['user', 'room'])->findOrFail($id);
        return response()->json(['data' => $booking]);
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
}
