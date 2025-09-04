
## Portfolio project

In this portfolio, you can find the chosen projects that I have completed in my journey to become a graphic designer and a web developer.

## Deployment

To deploy this project, run

```bash
node app.js
```
The app runs on http://localhost:8080

## CRUD Operations

- Create: only the admin can create portfolio entries.
- Read: both users and the admin can view projects.
- Update: only the admin can modify existing projects.
- Delete: only the admin can remove projects.

## Features

Project filter: Users can filter through projects by selecting the category that they are interested in.

Admin Interface: Allows for creating and managing projects and feedback.

## Architecture

Utilizes a relational database with resources for projects, and feedback messages. The web application's architecture facilitates efficient HTTP request handling.

## Technologies

This project was created using JavaScript, with the help of HTML, CSS, and Handlebars – a templating language implemented in JavaScript. The framework used in this project was Express. Some of the used packages that come from the npm software library include:

- bcrypt – hashing the password,
- body-parser - parsing HTTP request body,
- express-session - establishing server-based sessions,
- multer - handling uploaded files

## Security

The application incorporates multiple security measures to handle vulnerabilities, such as injections, broken authentication, and XSS.
