import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Form, Button, Container } from "react-bootstrap";
import NavBar from "../components/Navbar";
import axios from "axios";

const EditRoom = ({ room }) => {
    const [formData, setFormData] = useState({
        room: room.room || "",
        capacity: room.capacity || "",
        type: room.type || "",
        location: room.location || "",
        image: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async () => {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        try {
            await axios.put(`/rooms/${formData.id}`, data);

            console.log("Room updated successfully");
        } catch (error) {
            console.error("Error updating room", error);
        }
    };

    return (
        <>
            <NavBar />
            <Container>
                <h2>Edit Room</h2>
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
                            <option value="">Select a Type</option>
                            <option value="Class">Class</option>
                            <option value="Hall">Hall</option>
                            <option value="Canteen">Canteen</option>
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
                            <option value="">Select a Building</option>
                            <option value="Building A">Building A</option>
                            <option value="Building B">Building B</option>
                            <option value="Building C">Building C</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleImageChange}
                        />
                    </Form.Group>
                    <Button variant="dark" onClick={handleSubmit}>
                        Save
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default EditRoom;
