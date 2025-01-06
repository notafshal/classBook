import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import NavBar from "../components/Navbar";

const BookMgmt = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get("/bookings");

            setBookings(response.data.data);
        } catch (error) {
            console.error("Error fetching bookings", error);
        }
    };

    const updateBookingStatus = async (id, status) => {
        try {
            await axios.put(`/bookings/${id}/status`, { status });
            console.log("Status updated successfully");
            fetchBookings();
        } catch (error) {
            console.error("Error updating booking status", error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="d-flex" style={{ height: "100vh" }}>
                <div
                    style={{
                        width: "15%",
                        minWidth: "200px",
                        overflow: "auto",
                        background: "#f8f9fa",
                    }}
                >
                    <AdminSidebar />
                </div>

                <div style={{ width: "85%" }} className="flex-grow-1 p-4">
                    <h2>Booking Management</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Room</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={booking.id}>
                                    <td>{index + 1}</td>
                                    <td>{booking.user.name}</td>
                                    <td>{booking.room.room}</td>
                                    <td>{booking.status}</td>
                                    <td>
                                        {booking.status === "pending" && (
                                            <Button
                                                variant="success"
                                                onClick={() =>
                                                    updateBookingStatus(
                                                        booking.id,
                                                        "approved"
                                                    )
                                                }
                                            >
                                                Approve
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default BookMgmt;
