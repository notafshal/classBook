import { useEffect, useState } from "react";
import NavBar from "../components/Navbar";
import { Button, Container, Spinner } from "react-bootstrap";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        role: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
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
        router.get("/bookings");
    };

    return (
        <>
            <NavBar />
            <Container>
                <h1 className="my-4">Your Profile</h1>
                {loading ? (
                    <Spinner animation="border" />
                ) : (
                    <div>
                        <p>
                            <strong>Name:</strong> {profile.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {profile.email}
                        </p>
                        <p>
                            <strong>Role:</strong> {profile.role}
                        </p>
                        <Button
                            className="mt-3"
                            variant="primary"
                            onClick={handleEditProfile}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            className="mt-3 ms-3"
                            variant="secondary"
                            onClick={handleCheckBookings}
                        >
                            Check Bookings
                        </Button>
                    </div>
                )}
            </Container>
        </>
    );
}
