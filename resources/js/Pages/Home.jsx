import { Link } from "@inertiajs/react";
import NavBar from "../components/Navbar";
import { useEffect, useState } from "react";
import {
    Card,
    Col,
    Container,
    Row,
    Spinner,
    Modal,
    Form,
    Button,
    Alert,
    Toast,
    ToastContainer,
} from "react-bootstrap";
import axios from "axios";

function Home() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        duration: 1,
        purpose: "",
    });
    const [bookingStatus, setBookingStatus] = useState({
        success: false,
        message: "",
    });
    const [showToast, setShowToast] = useState(false);

    const fetchRooms = async () => {
        try {
            const response = await axios.get("http://localhost:8000/rooms");
            setRooms(response.data.rooms);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
        if (name === "time" && value.length === 5) {
            updatedValue += ":00";
        }
        setFormData({ ...formData, [name]: updatedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem("userId");
            const response = await axios.post(
                `http://localhost:8000/bookings`,
                {
                    room_id: selectedRoom.id,
                    user_id: userId,
                    status: "pending",
                    ...formData,
                }
            );
            setBookingStatus({ success: true, message: "Booking successful!" });
            setShowToast(true);
            setShowModal(false);
        } catch (error) {
            setBookingStatus({
                success: false,
                message:
                    error.response?.data?.message || "Failed to book the room.",
            });
            console.error("Booking error:", error);
        }
    };

    const openModal = (room) => {
        setSelectedRoom(room);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRoom(null);
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    return (
        <>
            <NavBar />

            <Container className="py-5">
                <h1 className="text-center mb-4">Available Rooms</h1>
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {rooms.length > 0 ? (
                            rooms.map((room) => (
                                <Col key={room.id}>
                                    <Card>
                                        <Card.Img
                                            variant="top"
                                            src={`/storage/${room.image}`}
                                            alt={room.room}
                                            style={{
                                                height: "200px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Card.Body>
                                            <Card.Title>{room.room}</Card.Title>
                                            <Card.Text>
                                                <strong>Type:</strong>{" "}
                                                {room.type} <br />
                                                <strong>Capacity:</strong>{" "}
                                                {room.capacity} <br />
                                                <strong>Location:</strong>{" "}
                                                {room.location}
                                            </Card.Text>
                                            <Button
                                                variant="dark"
                                                onClick={() => openModal(room)}
                                            >
                                                Book Now
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p className="text-center">
                                No rooms available at the moment.
                            </p>
                        )}
                    </Row>
                )}
            </Container>

            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Book Room: {selectedRoom?.room}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {bookingStatus.message && (
                        <Alert
                            variant={
                                bookingStatus.success ? "success" : "danger"
                            }
                        >
                            {bookingStatus.message}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="date">
                            <Form.Label>Booking Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="time">
                            <Form.Label>Booking Time</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="HH:mm:ss"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                required
                            />
                            <Form.Text className="text-muted">
                                Please enter time in HH:mm:ss format.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="duration">
                            <Form.Label>Duration (Hours)</Form.Label>
                            <Form.Control
                                type="number"
                                name="duration"
                                placeholder="Enter duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </Form.Group>
                        <Form.Group controlId="purpose">
                            <Form.Label>Purpose</Form.Label>
                            <Form.Control
                                type="text"
                                name="purpose"
                                placeholder="Enter purpose of booking"
                                value={formData.purpose}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            className="mt-3"
                            variant="primary"
                        >
                            Confirm Booking
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-end" className="p-3">
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">
                            Booking Notification
                        </strong>
                    </Toast.Header>
                    <Toast.Body>Booking successful!</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}

export default Home;
