import { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { Button, Container, Spinner, Card, Row, Col } from "react-bootstrap";
import { FaEdit, FaCalendarCheck } from "react-icons/fa";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        role: "",
    });
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        axios
            .get(`/user/${userId}`)
            .then((response) => {
                setProfile(response.data.user);
                setLoading(false);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleEditProfile = () => {
        router.get("/profile/edit");
    };

    const handleCheckBookings = () => {
        router.get(`/bookings/${userId}`);
    };

    return (
        <>
            <NavBar />
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="text-center">
                                    <h1>Your Profile</h1>
                                </Card.Title>
                                {loading ? (
                                    <div className="d-flex justify-content-center">
                                        <Spinner animation="border" />
                                    </div>
                                ) : (
                                    <div>
                                        <Row>
                                            <Col md={6}>
                                                <p>
                                                    <strong>Name:</strong>{" "}
                                                    {profile.name}
                                                </p>
                                                <p>
                                                    <strong>Email:</strong>{" "}
                                                    {profile.email}
                                                </p>
                                                <p>
                                                    <strong>Role:</strong>{" "}
                                                    {profile.role}
                                                </p>
                                            </Col>
                                            <Col
                                                md={6}
                                                className="d-flex align-items-center justify-content-center"
                                            >
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${profile.name}&size=128`}
                                                    alt="Profile"
                                                    className="rounded-circle"
                                                    width="150"
                                                    height="150"
                                                />
                                            </Col>
                                        </Row>
                                        <div className="text-center mt-4">
                                            <Button
                                                className="me-2"
                                                variant="dark"
                                                onClick={handleEditProfile}
                                            >
                                                <FaEdit className="me-2" />
                                                Edit Profile
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={handleCheckBookings}
                                            >
                                                <FaCalendarCheck className="me-2" />
                                                Check Bookings
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
