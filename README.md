A mini movie website project developed using node.js

This application is a movie management system built with Express and SQLite. It provides various functionalities for managing movies, contacts, and user interactions. 

**EJS template was used**

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

7. **Dashboard Page Route**
    - **Description**: Renders the `dashboard.ejs`

8. **Contact Form Submission Route**
    - **Description**: Handles form submissions from the contact page. It extracts data from the request body, creates a new contact, adds it to the contacts array, and responds with a success message and the submitted data.

9. **Error Handling for Invalid Routes**
    - **Description**: Catches all unmatched routes and responds with a 404 error page.


## Features
- **Database Management**: Utilizes SQLite for data storage, with tables for movies, packages, contacts, and users. Tables are created if they do not exist.
- **CRUD Operations**: 
  - **Create**: Insert new movies and contacts into the database.
  - **Read**: Retrieve all movies, search for a movie by title, and get all contacts.
  - **Update**: Update movie details by ID.
  - **Delete**: Remove a movie from the database by title.
- **Data Insertion**: Automatically inserts example data into the movies and contacts tables upon server start.

## SQL Features
- **Table Creation**: Tables are created with appropriate columns and data types.
- **Parameterized Queries**: Prevent SQL injection by using placeholders in queries.
- **Error Handling**: Provides error messages for database operations.

## Database Schema
The database consists of the following tables:
- **movies**: Stores movie details including `id`, `title`, `summary`, `year`, `alttext`, and `poster`.
- **packages**: Contains information about different account packages with `id`, `name`, `price`, `description`, and `features`.
- **contacts**: Holds contact form submissions with `id`, `fullname`, `email`, `phone`, and `message`.
- **users**: Manages user accounts with `id`, `username`, `email`, and `password`.

### Rationale
The schema is designed to efficiently manage and retrieve movie-related data while allowing for user interactions through contact forms. Each table is normalized to reduce redundancy and improve data integrity.

## Setup Instructions

1. **Install Dependencies**: 
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

2. **Create the Database**: 
   The database will be automatically created when you run the application for the first time. Ensure you have SQLite installed.

3. **Run the Application**: 
   Start the server with:
   ```bash
   node server.js
   ```
   The server will run at `http://localhost:3000`.

## Routes
- **GET /search-movie**: Search for a movie by title.
- **POST /update-movie/:id**: Update movie details by ID.
- **POST /delete-movie-by-title**: Delete a movie by title.
- **POST /insert-movie**: Insert a new movie.
- **GET /get-movies**: Retrieve all movies.
- **GET /**: Load the homepage.
- **GET /index**: Load the index page.
- **GET /inspiration**: Load the inspiration page.
- **GET /contact**: Load the contact page.
- **GET /packages**: Load the account packages page.
- **GET /catalog**: Load the movie catalog page.
- **GET /dashboard**: Load the dashboard with movies and contacts.
- **POST /submit**: Handle contact form submissions.
- **GET /contacts**: Retrieve all contacts.
- **Error Handling**: Handles invalid routes with a 404 page.