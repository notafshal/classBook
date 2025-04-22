describe("Login Page", () => {
    it("logs in with correct credentials", () => {
        cy.visit("/login");
        cy.get('input[name="loginname"]').type("Test User");
        cy.get('input[name="loginpassword"]').type("password123");
        cy.get("form").submit();

        cy.url().should("include", "/");
    });

    it("shows error for wrong credentials", () => {
        cy.visit("/login");
        cy.get('input[name="loginname"]').type("wronguser");
        cy.get('input[name="loginpassword"]').type("wrongpass");
        cy.get("form").submit();

        cy.contains("An error occurred");
    });
});
