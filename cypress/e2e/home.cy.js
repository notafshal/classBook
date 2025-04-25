describe("Room Booking Flow", () => {
    beforeEach(() => {
        cy.intercept("GET", "http://localhost:8000/rooms", {
            statusCode: 200,
            body: {
                rooms: [
                    {
                        id: 1,
                        room: "Conference Room A",
                        type: "Meeting",
                        capacity: 10,
                        location: "Building 1",
                        isBlocked: 0,
                        image: "room-a.jpg",
                    },
                ],
            },
        }).as("getRooms");

        cy.visit("/");
        cy.wait("@getRooms");
    });

    it("should book a room if available", () => {
        cy.intercept(
            "POST",
            "http://localhost:8000/bookings/check-availability",
            {
                statusCode: 200,
                body: {},
            }
        ).as("checkAvailability");

        cy.intercept("POST", "http://localhost:8000/bookings", {
            statusCode: 201,
            body: {
                message: "Booking successful!",
            },
        }).as("submitBooking");

        cy.contains("Book Now").click();

        cy.get('input[name="date"]').type("2025-04-25");
        cy.get('input[name="time"]').type("10:00:00");
        cy.get('input[name="duration"]').clear().type("2");
        cy.get('input[name="purpose"]').type("Project Discussion");

        cy.window().then((win) => {
            win.localStorage.setItem("userId", "123");
        });

        cy.get("form").submit();

        cy.wait("@checkAvailability");
        cy.wait("@submitBooking");

        cy.get(".toast-body").should("contain.text", "Booking successful");
    });
});
