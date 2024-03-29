const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("myDB.db");

const minLength = 0;

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

db.run(
  `CREATE TABLE IF NOT EXISTS contact(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  message TEXT)`
);

function getErrorMessagesForProjects(
  title,
  category,
  description,
  imageURL1,
  repository,
  link,
  date
) {
  const errorMessages = [];
  if (title.length == minLength) {
    errorMessages.push("The title field can't be empty.");
  }
  if (category.length == minLength) {
    errorMessages.push("The category field can't be empty.");
  }
  if (description.length == minLength) {
    errorMessages.push("The description field can't be empty.");
  }
  if (imageURL1.length == minLength) {
    errorMessages.push("The image field can't be empty.");
  }
  if (repository.length == minLength) {
    errorMessages.push("The repository field can't be empty.");
  }
  if (link.length == minLength) {
    errorMessages.push("The link field can't be empty.");
  }
  if (date.length == minLength) {
    errorMessages.push("The date field can't be empty.");
  }
  return errorMessages;
}

function getErrorMessagesForContact(name, email, message) {
  const errorMessages = [];
  if (name.length == minLength) {
    errorMessages.push("The title field can't be empty.");
  }
  if (email.length == minLength) {
    errorMessages.push("The category field can't be empty.");
  }
  if (message.length == minLength) {
    errorMessages.push("The description field can't be empty.");
  }
  return errorMessages;
}

app.get("/", function (request, response) {
  response.render("home.hbs");
});

app.get("/projects", function (request, response) {
  const query = "SELECT * FROM projects ORDER BY id DESC";

  db.all(query, function (error, projects) {
    if (error) {
      console.log(error);
      const model = {
        errorDB: true,
      };
      response.render("projects.hbs", model);
    } else {
      const model = {
        projects,
        errorDB: false,
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

  const errorMessages = getErrorMessagesForProjects(
    title,
    category,
    description,
    imageURL1,
    repository,
    link,
    date
  );

  if (errorMessages.length == 0) {
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
  } else {
    const model = {
      errorMessages,
      title,
      category,
      description,
      imageURL1,
      repository,
      link,
      date,
    };
    response.render("projectCreate.hbs", model);
  }
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

  const errorMessages = getErrorMessagesForProjects(
    title,
    category,
    description,
    imageURL1,
    repository,
    link,
    date
  );

  if (errorMessages.length == 0) {
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
  } else {
    const model = {
      project: {
        title,
        category,
        description,
        imageURL1,
        repository,
        link,
        date,
      },
      id,
      errorMessages,
    };
    response.render("projectEdit.hbs", model);
  }
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

app.post("/contact", function (request, response) {
  const name = request.body.name;
  const email = request.body.email;
  const message = request.body.message;

  const errorMessages = getErrorMessagesForContact(name, email, message);

  if (errorMessages.length == 0) {
    const query = "INSERT INTO contact (name, email, message) VALUES (?, ?, ?)";
    const values = [name, email, message];

    db.run(query, values, function (error) {
      if (error) {
        console.log(error);
      } else {
        response.redirect("/thankyou");
      }
    });
  } else {
    const model = {
      errorMessages,
      name,
      email,
      message,
    };
    response.render("contact.hbs", model);
  }
});

app.get("/messages", function (request, response) {
  const query = "SELECT * FROM contact ORDER BY id DESC";

  db.all(query, function (error, contact) {
    if (error) {
      console.log(error);
      const model = {
        errorDB: true,
      };
      response.render("messages.hbs", model);
    } else {
      const model = {
        contact,
        errorDB: false,
      };

      response.render("messages.hbs", model);
    }
  });
});

app.get("/thankyou", function (request, response) {
  response.render("thankyou.hbs");
});

app.get("/about", function (request, response) {
  response.render("about.hbs");
});

app.get("/login", function (request, response) {
  response.render("login.hbs");
});

app.listen(8080);
