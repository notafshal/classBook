import { Link } from "@inertiajs/react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useEffect, useState } from "react";

const NavBar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const userName = localStorage.getItem("userName");
        const userRole = localStorage.getItem("userRole");

        if (userId) {
            setUser({ id: userId, name: userName, role: userRole });
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} href="/">
                        classBook
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} href="/">
                                Home
                            </Nav.Link>
                            {user && (
                                <Nav.Link as={Link} href="/profile">
                                    Profile
                                </Nav.Link>
                            )}
                            {!user ? (
                                <>
                                    <Nav.Link as={Link} href="/login">
                                        Login
                                    </Nav.Link>
                                    <Nav.Link as={Link} href="/register">
                                        Register
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    {user.role === "admin" && (
                                        <Nav.Link as={Link} href="/dashboard">
                                            Dashboard
                                        </Nav.Link>
                                    )}
                                    <Nav.Link onClick={handleLogout}>
                                        Logout
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default NavBar;
