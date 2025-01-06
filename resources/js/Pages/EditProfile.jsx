import { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { Button, Container, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function EditProfile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        role: "",
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        axios
            .get(`/user/${userId}`)
            .then((response) => {
                setProfile(response.data.user);
                setLoading(false);
            })
            .catch((error) => console.error(error));
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/user/${userId}`, profile);
            setMessage("Profile updated successfully!");
            router.get("/profile");
        } catch {
            setMessage("Failed to update profile.");
        }
    };

    const handleCancel = () => {
        router.get("/profile");
    };

    return (
        <>
            <NavBar />
            <Container>
                <h1 className="my-4">Edit Profile</h1>
                {loading ? (
                    <Spinner animation="border" />
                ) : (
                    <Form onSubmit={handleSubmit}>
                        {message && <Alert variant="info">{message}</Alert>}
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                type="text"
                                name="role"
                                value={profile.role}
                                disabled
                            />
                        </Form.Group>
                        <Button className="mt-3" type="submit" variant="dark">
                            Save Changes
                        </Button>
                        <Button
                            className="mt-3 ms-3"
                            variant="secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </Form>
                )}
            </Container>
        </>
    );
}
