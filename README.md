A mini movie website project developed using node.js

EJS template was used

++++  Set-up instructions   +++++

Run "npm install" to add node_modules
 

++++ Implimentation +++++



1. **Home Page Route**
- **Description**: Renders the index.ejs view for the home page with the title "HomePage" using the specified layout.

2. **Index Page Route**
    - **Description**: Renders the `index.ejs` view for the index page with the title "HomePage" using the specified layout. This route is essentially a duplicate of the home page route.

3. **Inspiration Page Route**
    - **Description**: Renders the `inspiration.ejs` view for the inspiration page with the title "Inspiration Page" using the specified layout.

4. **Contact Page Route**
    - **Description**: Renders the `contact.ejs` view for the contact page with the title "Contact Page" using the specified layout.

5. **Packages Page Route**
    - **Description**: Renders the `packages.ejs` view for the account packages page with the title "Account Packages Page" using the specified layout.

6. **Catalog Page Route**
    - **Description**: Renders the `catalog.ejs` view for the movie catalog page with the title "Movie Catalog Page" using the specified layout. It also passes an array of articles to the view.

7. **Contact Form Submission Route**
    - **Description**: Handles form submissions from the contact page. It extracts data from the request body, creates a new contact, adds it to the contacts array, and responds with a success message and the submitted data.

8. **Error Handling for Invalid Routes**
    - **Description**: Catches all unmatched routes and responds with a 404 error page.