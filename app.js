const express = require("express");
const expressHandlebars = require("express-handlebars");
const data = require("./data.js");

const app = express();

app.engine(
  "hbs",
  expressHandlebars.engine({
    defaultLayout: "main.hbs",
  })
);

app.use(express.static("public"));

app.get("/", function (requeste, response) {
  response.render("home.hbs");
});

app.get("/projects", function (requeste, response) {
  const model = {
    projects: data.projects,
  };

  response.render("projects.hbs", model);
});

app.listen(8080);
