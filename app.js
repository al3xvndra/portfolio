const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const data = require("./data.js");

const app = express();

app.engine(
  "hbs",
  expressHandlebars.engine({
    defaultLayout: "main.hbs",
  })
);

app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get("/", function (request, response) {
  response.render("home.hbs");
});

app.get("/projects", function (request, response) {
  const model = {
    projects: data.projects,
  };

  response.render("projects.hbs", model);
});

app.get("/projects/:id", function (request, response) {
  const id = request.params.id;

  const project = data.projects.find((p) => p.id == id);

  const model = {
    project: project,
  };

  response.render("project.hbs", model);
});

// manage projects

app.get("/projectCreate", function (request, response) {
  response.render("projectCreate.hbs");
});

// app.post("/projectCreate", function (request, response) {
//   const title = request.body.name;
//   const category = request.body.category;
//   const description = request.body.description;
//   const repository = request.body.repository;
//   const link = request.body.link;

//   const project = {
//     title,
//     category,
//     description,
//     repository,
//     link,
//     id: projects.length + 1,
//   };

//   projects.push(project);
//   response.redirect("/projects/" + project.id);
// });

app.get("/projectEdit", function (request, response) {
  response.render("projectEdit.hbs");
});

app.get("/contact", function (request, response) {
  response.render("contact.hbs");
});

app.get("/about", function (request, response) {
  response.render("about.hbs");
});

app.get("/login", function (request, response) {
  response.render("login.hbs");
});

app.listen(8080);
