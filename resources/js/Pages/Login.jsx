import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import { Link, router } from "@inertiajs/react";

const Login = () => {
    const [formData, setFormData] = useState({
        loginname: "",
        loginpassword: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.get("/sanctum/csrf-cookie");
            const response = await axios.post(
                "http://localhost:8000/login",
                formData,
                { withCredentials: true }
            );
            if (response.status === 200) {
                const user = response.data.user;
                localStorage.setItem("userId", user.id);
                localStorage.setItem("userName", user.name);
                localStorage.setItem("userRole", user.role);
                router.get("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <>
            <NavBar />
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h3 className="text-center">Login</h3>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="loginname">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    name="loginname"
                                    value={formData.loginname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="loginpassword"
                            >
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    name="loginpassword"
                                    value={formData.loginpassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button
                                variant="dark"
                                type="submit"
                                className="w-100"
                            >
                                Login
                            </Button>
                        </Form>
                    </Col>
                    <p className="text-center py-2">
                        Do not have an account?{" "}
                        <span className="text-decoration-underline text-primary">
                            <Link href="/register"> Register</Link>
                        </span>
                    </p>
                </Row>
            </Container>
        </>
    );
};

export default Login;
