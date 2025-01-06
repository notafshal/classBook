import { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { router } from "@inertiajs/react";
import NavBar from "../components/Navbar";

const ViewBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        axios
            .get(`/bookings/${userId}`)
            .then((response) => {
                const bookingsData = response.data.bookings || [];
                setBookings(bookingsData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching bookings:", error);
                setError("Failed to load booking data.");
                setLoading(false);
            });
    }, []);

    return (
        <>
            <NavBar />
            <Container>
                <h1 className="my-4">Booking Status and History</h1>
                {loading ? (
                    <Spinner animation="border" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : bookings && bookings.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Booking ID</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={booking.id}>
                                    <td>{index + 1}</td>
                                    <td>{booking.id}</td>
                                    <td>
                                        {new Date(
                                            booking.date
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>{booking.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info">No bookings found.</Alert>
                )}
            </Container>
        </>
    );
};

export default ViewBooking;
