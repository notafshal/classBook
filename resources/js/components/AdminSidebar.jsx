import { Link } from "@inertiajs/react";
import React from "react";

import { Container, Nav } from "react-bootstrap";

const AdminSidebar = () => {
    return (
        <Container fluid>
            <Nav className="flex-column bg-light vh-100 p-3">
                <h4>Admin Panel</h4>
                <Nav.Link as={Link} href="dashboard" activeClassName="active">
                    Room Management
                </Nav.Link>

                <Nav.Link as={Link} href="/book-mgmt" activeClassName="active">
                    Booking Management
                </Nav.Link>
            </Nav>
        </Container>
    );
};

export default AdminSidebar;
