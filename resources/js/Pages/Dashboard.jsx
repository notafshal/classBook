import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Container,
    Row,
    Col,
} from "react-bootstrap";
import axios from "axios";
import NavBar from "../components/Navbar";

const AdminDashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [formData, setFormData] = useState({
        room: "",
        capacity: "",
        type: "",
        location: "",
        image: null,
    });

    const [analytics, setAnalytics] = useState({
        totalRooms: 0,
        blockedRooms: 0,
    });

    const fetchRooms = async () => {
        try {
            const response = await axios.get("http://localhost:8000/rooms");
            const roomsData = response.data.rooms;
            setRooms(roomsData);
            setAnalytics({
                totalRooms: roomsData.length,
                blockedRooms: roomsData.filter((room) => room.is_blocked)
                    .length,
            });
        } catch (error) {
            console.error("Error fetching rooms", error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async () => {
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });

        console.log(currentRoom);
        try {
            if (currentRoom) {
                await axios.put(
                    `http://localhost:8000/rooms/${currentRoom.id}`,
                    form,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
            } else {
                await axios.post("http://localhost:8000/rooms", form);
            }
            fetchRooms();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving room", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/rooms/${id}`);
            fetchRooms();
        } catch (error) {
            console.error("Error deleting room", error);
        }
    };

    const handleBlockToggle = async (id) => {
        try {
            await axios.post(`http://localhost:8000/rooms/${id}/block`);
            fetchRooms();
        } catch (error) {
            console.error("Error blocking/unblocking room", error);
        }
    };

    return (
        <>
            <NavBar />
            <Container>
                <Row className="my-4">
                    <Col>
                        <h2>Admin Dashboard</h2>
                    </Col>
                    <Col className="text-end">
                        <Button
                            className="btn-dark"
                            onClick={() => setShowModal(true)}
                        >
                            Add Room
                        </Button>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <h5>Total Rooms: {analytics.totalRooms}</h5>
                        <h5>Blocked Rooms: {analytics.blockedRooms}</h5>
                    </Col>
                </Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Room</th>
                            <th>Capacity</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={room.id}>
                                <td>{index + 1}</td>
                                <td>{room.room}</td>
                                <td>{room.capacity}</td>
                                <td>{room.type}</td>
                                <td>{room.location}</td>
                                <td>
                                    {room.image && (
                                        <img
                                            src={`/storage/${room.image}`}
                                            alt={room.room}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                            }}
                                        />
                                    )}
                                </td>
                                <td>
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setCurrentRoom(room);
                                            setFormData(room);
                                            setShowModal(true);
                                        }}
                                    >
                                        Edit
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(room.id)}
                                    >
                                        Delete
                                    </Button>{" "}
                                    <Button
                                        variant={
                                            room.is_blocked
                                                ? "secondary"
                                                : "primary"
                                        }
                                        onClick={() =>
                                            handleBlockToggle(room.id)
                                        }
                                    >
                                        {room.is_blocked ? "Unblock" : "Block"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {currentRoom ? "Edit Room" : "Add Room"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Room Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="room"
                                    value={formData.room}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Capacity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </Button>
                        <Button variant="dark" onClick={handleSubmit}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default AdminDashboard;
