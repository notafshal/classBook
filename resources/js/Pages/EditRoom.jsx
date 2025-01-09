import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Form, Button, Container, Alert } from "react-bootstrap";
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

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess("");

        // const data = new FormData();
        // Object.entries(formData).forEach(([key, value]) => {
        //     console.log(key);
        //     console.log(value);
        //     data.append(
        //         key,
        //         value !== null && value !== undefined ? value : ""
        //     );
        // });

        try {
            const response = await axios.put(`/rooms/${room.id}`, formData);
            setSuccess("Room updated successfully!", response);
            router.get("/dashboard");
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data);
                setErrors(error.response.data.errors || {});
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    return (
        <>
            <NavBar />
            <Container>
                <h2>Edit Room</h2>
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Room Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="room"
                            value={formData.room}
                            onChange={handleInputChange}
                            isInvalid={!!errors.room}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.room}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Capacity</Form.Label>
                        <Form.Control
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            isInvalid={!!errors.capacity}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.capacity}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <Form.Select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            isInvalid={!!errors.type}
                        >
                            <option value="">Select a Type</option>
                            <option value="Class">Class</option>
                            <option value="Hall">Hall</option>
                            <option value="Canteen">Canteen</option>
                            <option value="Labs">Labs</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.type}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            isInvalid={!!errors.location}
                        >
                            <option value="">Select a Building</option>
                            <option value="Building A">Building A</option>
                            <option value="Building B">Building B</option>
                            <option value="Building C">Building C</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.location}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {/* <Form.Group>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleImageChange}
                            isInvalid={!!errors.image}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.image}
                        </Form.Control.Feedback>
                    </Form.Group> */}
                    <Button variant="dark" type="submit">
                        Save
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default EditRoom;
