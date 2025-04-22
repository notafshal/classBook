describe("User Registration", () => {
    beforeEach(() => {
        cy.visit("/register");
    });

    it("registers successfully with valid input", () => {
        //after .type("write what u want to test")
        cy.get('input[name="name"]').type("DXGG");
        cy.get('input[name="email"]').type("HHH@example.com");
        cy.get('input[name="password"]').type("HBK66666");
        cy.get('select[name="role"]').select("student");
        cy.get("form").submit();

        cy.contains("Registration successful").should("be.visible");
    });

    it("shows error on failed registration", () => {
        //after .type("write details of existing user")
        cy.get('input[name="name"]').type("Test User");
        cy.get('input[name="email"]').type("testuser@example.com");
        cy.get('input[name="password"]').type("password123");
        cy.get("form").submit();

        cy.contains("Registration failed").should("exist");
    });
});
