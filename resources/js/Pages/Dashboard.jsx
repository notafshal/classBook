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
import AdminSidebar from "../components/AdminSidebar";
import { router } from "@inertiajs/react";

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
                blockedRooms: roomsData.filter((room) => room.isBlocked).length,
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
        if (
            !formData.room ||
            !formData.capacity ||
            !formData.type ||
            !formData.location
        ) {
            alert("All fields are required.");
            return;
        }

        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                form.append(key, value);
            }
        });

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

    const addRoom = () => {
        setCurrentRoom("");
        setShowModal(true);
    };

    return (
        <>
            <NavBar />
            <div className="d-flex">
                <div style={{ width: "15%", minWidth: "200px" }}>
                    <AdminSidebar />
                </div>
                <div style={{ width: "85%" }} className="flex-grow-1 p-4">
                    <Container>
                        <Row className="my-4">
                            <Col>
                                <h2>Room Management</h2>
                            </Col>
                            <Col className="text-end">
                                <Button className="btn-dark" onClick={addRoom}>
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
                                                    router.get(
                                                        `/rooms/${room.id}/edit`
                                                    );
                                                }}
                                            >
                                                Edit
                                            </Button>{" "}
                                            <Button
                                                variant="danger"
                                                onClick={() =>
                                                    handleDelete(room.id)
                                                }
                                            >
                                                Delete
                                            </Button>{" "}
                                            <Button
                                                variant={
                                                    room.isBlocked
                                                        ? "secondary"
                                                        : "primary"
                                                }
                                                onClick={() =>
                                                    handleBlockToggle(room.id)
                                                }
                                            >
                                                {room.isBlocked
                                                    ? "Unblock"
                                                    : "Block"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Modal
                            show={showModal}
                            onHide={() => setShowModal(false)}
                        >
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
                                        <Form.Select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">
                                                Select a Type
                                            </option>
                                            <option value="Class">Class</option>
                                            <option value="Hall">Hall</option>
                                            <option value="Canteen">
                                                Canteen
                                            </option>
                                            <option value="Labs">Labs</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Location</Form.Label>
                                        <Form.Select
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">
                                                Select a Building
                                            </option>
                                            <option value="Building A">
                                                Building A
                                            </option>
                                            <option value="Building B">
                                                Building B
                                            </option>
                                            <option value="Building C">
                                                Building C
                                            </option>
                                        </Form.Select>
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
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
