describe("Profile Page", () => {
    beforeEach(() => {
        localStorage.setItem("userId", "1"); // set mock userId
        cy.intercept("GET", "/user/1", {
            statusCode: 200,
            body: {
                user: {
                    name: "John Doe",
                    email: "john@example.com",
                    role: "student",
                },
            },
        }).as("getProfile");

        cy.visit("/profile");
    });

    it("displays profile info", () => {
        cy.wait("@getProfile");

        cy.contains("Your Profile").should("exist");
        cy.contains("John Doe");
        cy.contains("john@example.com");
        cy.contains("student");
    });

    it("has buttons to edit profile and check bookings", () => {
        cy.get("button").contains("Edit Profile").click();
        cy.url().should("include", "/profile/edit");

        cy.visit("/profile");

        cy.get("button").contains("Check Bookings").click();
        cy.url().should("include", "/bookings/1");
    });
});
