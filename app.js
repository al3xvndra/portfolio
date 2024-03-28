const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("myDB.db");

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

db.run(
  `CREATE TABLE IF NOT EXISTS projects(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  category TEXT,
  description TEXT, 
  imageURL1 TEXT,
  repository TEXT,
  link TEXT,
  date TEXT)`
);

app.get("/", function (request, response) {
  response.render("home.hbs");
});

app.get("/projects", function (request, response) {
  const query = "SELECT * FROM projects ORDER BY id DESC";

  db.all(query, function (error, projects) {
    if (error) {
      console.log(error);
      const model = {
        errorMessage: true,
      };
      response.render("projects.hbs", model);
    } else {
      const model = {
        projects,
        errorMessage: false,
      };

      response.render("projects.hbs", model);
    }
  });
});

app.get("/projects/:id", function (request, response) {
  const id = request.params.id;
  const query = "SELECT * FROM projects WHERE id = ?";
  const values = [id];

  db.get(query, values, function (error, project) {
    if (error) {
      console.log(error);
    } else {
      const model = {
        project,
      };

      response.render("project.hbs", model);
    }
  });
});

// manage projects

app.get("/projectCreate", function (request, response) {
  response.render("projectCreate.hbs");
});

app.post("/projectCreate", function (request, response) {
  const title = request.body.title;
  const category = request.body.category;
  const description = request.body.description;
  const imageURL1 = request.body.imageURL1;
  const repository = request.body.repository;
  const link = request.body.link;
  const date = request.body.date;

  const query =
    "INSERT INTO projects (title, category, description, imageURL1, repository, link, date) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    title,
    category,
    description,
    imageURL1,
    repository,
    link,
    date,
  ];

  db.run(query, values, function (error) {
    if (error) {
      console.log(error);
    } else {
      response.redirect("/projects");
    }
  });
});

app.get("/projectEdit/:id", function (request, response) {
  const id = request.params.id;
  const queryProject = `SELECT * FROM projects WHERE id = ?`;
  const values = [id];

  db.get(queryProject, values, function (error, project) {
    if (error) {
      console.log(error);
    } else {
      const model = {
        project,
      };
      response.render("projectEdit.hbs", model);
    }
  });
});

app.post("/projectEdit/:id", function (request, response) {
  const id = request.params.id;
  const title = request.body.title;
  const category = request.body.category;
  const description = request.body.description;
  const imageURL1 = request.body.imageURL1;
  const repository = request.body.repository;
  const link = request.body.link;
  const date = request.body.date;
  const query = `UPDATE projects
  SET title = ?, category = ?, description = ?, imageURL1 = ?, repository = ?, link = ?, date = ? WHERE id = ?;`;

  const values = [
    title,
    category,
    description,
    imageURL1,
    repository,
    link,
    date,
    id,
  ];

  db.run(query, values, function (error) {
    if (error) {
      console.log(error);
    } else {
      response.redirect("/projects");
    }
  });
});

app.get("/sure/:id", function (request, response) {
  const id = request.params.id;
  const query = "SELECT * FROM projects WHERE id = ?";
  const values = [id];

  db.get(query, values, function (error, project) {
    if (error) {
      console.log(error);
    } else {
      const model = {
        project,
      };
      response.render("sure.hbs", model);
    }
  });
});

app.post("/projectDelete/:id", function (request, response) {
  const id = request.params.id;
  const query = `DELETE FROM projects WHERE id = ?;`;
  const values = [id];

  db.run(query, values, function (error) {
    if (error) {
      console.log(error);
    } else {
      response.redirect("/projects");
    }
  });
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
