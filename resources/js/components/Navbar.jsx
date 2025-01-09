import { Link, usePage } from "@inertiajs/react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useEffect, useState } from "react";

const NavBar = () => {
    const [user, setUser] = useState(null);
    const { url } = usePage(); // Get current URL from Inertia

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

    // Function to check if the current URL matches the link's href
    const isActive = (path) => (url === path ? "active" : "");

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
                            <Nav.Link
                                as={Link}
                                href="/"
                                className={isActive("/")}
                            >
                                Home
                            </Nav.Link>
                            {user && (
                                <Nav.Link
                                    as={Link}
                                    href="/profile"
                                    className={isActive("/profile")}
                                >
                                    Profile
                                </Nav.Link>
                            )}
                            {!user ? (
                                <>
                                    <Nav.Link
                                        as={Link}
                                        href="/login"
                                        className={isActive("/login")}
                                    >
                                        Login
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        href="/register"
                                        className={isActive("/register")}
                                    >
                                        Register
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    {user.role === "admin" && (
                                        <Nav.Link
                                            as={Link}
                                            href="/dashboard"
                                            className={isActive("/dashboard")}
                                        >
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
