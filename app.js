const express = require("express");
const expressHandlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const multer = require("multer");
const bcrypt = require("bcrypt");
const db = require("./data.js");

const minLength = 0;
const correctUsername = "abc";
const correctPassword =
  "$2b$13$ChLSn5DLOGqctfzWio8id.MRwe.D4u7ruqCUSoogSxK5f0nxwuuMW";

const app = express();

const storage = multer.diskStorage({
  destination(request, file, cb) {
    cb(null, "public/uploads");
  },
  filename(request, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

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

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(
  expressSession({
    saveUninitialized: false,
    resave: false,
    secret: "uiewbvknd",
  })
);

app.use(function (request, response, next) {
  const isLoggedIn = request.session.isLoggedIn;
  response.locals.isLoggedIn = isLoggedIn;

  next();
});

// error handling

function getErrorMessagesForProjects(
  title,
  category,
  description,
  repository,
  link,
  date
) {
  const errorMessages = [];
  if (title.length == minLength) {
    errorMessages.push("The title field can't be empty.");
  }
  if (!category) {
    errorMessages.push("The category field can't be empty.");
  }
  if (
    category != "graphicDesign" &&
    category != "webDevelopment" &&
    category != "3dGraphics"
  ) {
    errorMessages.push("This is not a valid category");
  }
  if (description.length == minLength) {
    errorMessages.push("The description field can't be empty.");
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

function getErrorMessagesForLogIn(enteredUsername, correctUsername, isCorrect) {
  const errorMessages = [];

  if (enteredUsername !== correctUsername) {
    errorMessages.push("Wrong username or password");
  }
  if (isCorrect == false) {
    errorMessages.push("Wrong username or password");
  }
  return errorMessages;
}

// home page

app.get("/", function (request, response) {
  response.render("home.hbs");
});

// projects page

app.get("/projects", function (request, response) {
  db.getAllProjects(function (error, projects) {
    const errorMessages = [];

    if (error) {
      errorMessages.push("Internal server error");
    }

    const model = {
      errorMessages,
      projects,
    };

    response.render("projects.hbs", model);
  });
});

app.get("/projects/category", function (request, response) {
  const category = request.query.category;

  console.log(category);

  if (category) {
    db.getProjectsCategory(category, function (error, projects) {
      const errorMessages = [];
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          projects,
        };
        response.render("projects.hbs", model);
      } else {
        const model = {
          projects,
        };
        response.render("projects.hbs", model);
      }
    });
  } else {
    response.redirect("/projects");
  }
});

// single project page

app.get("/projects/:id", function (request, response) {
  const id = request.params.id;
  const errorMessages = [];

  db.getOneProject(id, function (error, project) {
    if (error) {
      errorMessages.push("Internal server error");
    }
    db.getAllPhotos(id, function (error, photos) {
      if (error) {
        errorMessages.push("Internal server error");
      }
      const model = {
        errorMessages,
        project,
        photos,
      };
      response.render("project.hbs", model);
    });
  });
});

app.post(
  "/projects/:id",
  upload.single("projectImage"),
  function (request, response) {
    const errorMessages = [];

    const projectID = request.params.id;

    if (!request.file) {
      errorMessages.push("Please upload a photo");
    }

    if (!request.session.isLoggedIn) {
      errorMessages.push("You have to log in");
    }

    if (errorMessages.length == 0) {
      const projectImage = request.file.filename;

      console.log("again" + projectImage);

      db.addPhoto(projectID, projectImage, function (error) {
        if (error) {
          errorMessages.push("Internal server error");
          const model = {
            errorMessages,
            projectID,
          };
          response.redirect("project.hbs", model);
        }
        response.redirect("/projects/" + projectID);
      });
    } else {
      const model = {
        errorMessages,
        projectID,
      };
      response.render("project.hbs", model);
    }
  }
);

// create project

app.get("/projectCreate", function (request, response) {
  if (request.session.isLoggedIn) {
    response.render("projectCreate.hbs");
  } else {
    response.redirect("/login");
  }
});

app.post(
  "/projectCreate",
  upload.single("image"),
  function (request, response) {
    const title = request.body.title;
    const category = request.body.category;
    const description = request.body.description;
    const repository = request.body.repository;
    const link = request.body.link;
    const date = request.body.date;

    const errorMessages = getErrorMessagesForProjects(
      title,
      category,
      description,
      repository,
      link,
      date
    );

    if (!request.file) {
      errorMessages.push("Please upload a photo");
    }

    if (!request.session.isLoggedIn) {
      errorMessages.push("You have to log in");
    }

    if (errorMessages.length == 0) {
      const image = request.file.filename;

      db.createProject(
        title,
        category,
        description,
        image,
        repository,
        link,
        date,
        function (error) {
          if (error) {
            errorMessages.push("Internal server error");
            const model = {
              errorMessages,
              title,
              category,
              description,
              repository,
              link,
              date,
            };
            response.redirect("projectCreate.hbs", model);
          }
          response.redirect("/projects");
        }
      );
    } else {
      const model = {
        errorMessages,
        title,
        category,
        description,
        repository,
        link,
        date,
      };
      response.render("projectCreate.hbs", model);
    }
  }
);

// edit project

app.get("/projectEdit/:id", function (request, response) {
  const id = request.params.id;

  db.getEditProject(id, function (error, project) {
    const errorMessages = [];

    if (error) {
      errorMessages.push("Internal server error");
    }
    const model = {
      errorMessages,
      project,
      id,
    };
    if (request.session.isLoggedIn) {
      response.render("projectEdit.hbs", model);
    } else {
      response.redirect("/login");
    }
  });
});

app.post(
  "/projectEdit/:id",
  upload.single("image"),
  function (request, response) {
    const id = request.params.id;
    const title = request.body.title;
    const category = request.body.category;
    const description = request.body.description;
    const repository = request.body.repository;
    const link = request.body.link;
    const date = request.body.date;

    const errorMessages = getErrorMessagesForProjects(
      title,
      category,
      description,
      repository,
      link,
      date
    );

    if (!request.file) {
      errorMessages.push("Please upload a photo");
    }

    if (!request.session.isLoggedIn) {
      errorMessages.push("You have to log in");
    }

    if (errorMessages.length == 0) {
      const image = request.file.filename;

      db.editProject(
        title,
        category,
        description,
        image,
        repository,
        link,
        date,
        id,
        function (error) {
          if (error) {
            errorMessages.push("Internal server error");
            const model = {
              errorMessages,
              title,
              category,
              description,
              repository,
              link,
              date,
              id,
            };
            response.render("editPost.hbs", model);
          }
          response.redirect("/projects");
        }
      );
    } else {
      const model = {
        project: {
          title,
          category,
          description,
          repository,
          link,
          date,
        },
        id,
        errorMessages,
      };
      response.render("projectEdit.hbs", model);
    }
  }
);

// delete project

app.get("/sure/:id", function (request, response) {
  const id = request.params.id;
  const errorMessages = [];

  db.getDeleteProject(id, function (error, project) {
    if (error) {
      errorMessages.push("Internal server error");
    }
    const model = {
      errorMessages,
      project,
    };

    response.render("sure.hbs", model);
  });
});

app.post("/projectDelete/:id", function (request, response) {
  const id = request.params.id;

  if (!request.session.isLoggedIn) {
    errorMessages.push("You have to log in");
  }

  db.deleteProject(id, function (error) {
    if (error) {
      errorMessages.push("Internal server error");
      const model = {
        errorMessages,
        id,
      };
      response.render("sure.hbs", model);
    }
    response.redirect("/projects");
  });
});

// contact page

app.get("/contact", function (request, response) {
  response.render("contact.hbs");
});

app.post("/contact", function (request, response) {
  const name = request.body.name;
  const email = request.body.email;
  const message = request.body.message;

  const errorMessages = getErrorMessagesForContact(name, email, message);

  if (errorMessages.length == 0) {
    db.createMessage(name, email, message, function (error) {
      if (error) {
        errorMessages.push("Internal server error");
        const model = {
          errorMessages,
          name,
          email,
          message,
        };
        response.render("contact.hbs", model);
      }
      response.redirect("/thankyou");
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

// messages page

app.get("/messages", function (request, response) {
  db.getAllMessages(function (error, contact) {
    const errorMessages = [];
    if (error) {
      errorMessages.push("Internal server error");
    }
    const model = {
      errorMessages,
      contact,
    };
    if (request.session.isLoggedIn) {
      response.render("messages.hbs", model);
    } else {
      response.redirect("/login");
    }
  });
});

app.post("/deleteMessage/:id", function (request, response) {
  const id = request.params.id;

  if (!request.session.isLoggedIn) {
    errorMessages.push("You have to log in");
  }

  db.deleteMessage(id, function (error) {
    if (error) {
      errorMessages.push("Internal server error");
      const model = {
        errorMessages,
        id,
      };
      response.render("messages.hbs", model);
    }
    response.redirect("/messages");
  });
});

// thank you page

app.get("/thankyou", function (request, response) {
  response.render("thankyou.hbs");
});

// about page

app.get("/about", function (request, response) {
  response.render("about.hbs");
});

// login page

app.get("/login", function (request, response) {
  response.render("login.hbs");
});

app.post("/login", function (request, response) {
  const enteredUsername = request.body.username;
  const enteredPassword = request.body.password;
  const isCorrect = bcrypt.compareSync(enteredPassword, correctPassword);

  const errorMessages = getErrorMessagesForLogIn(
    enteredUsername,
    correctUsername,
    isCorrect
  );
  if (errorMessages.length == 0) {
    request.session.isLoggedIn = true;
    response.redirect("/");
  } else {
    const model = {
      errorMessages,
    };
    response.render("login.hbs", model);
  }
});

// logout page

app.post("/logout", function (request, response) {
  request.session.isLoggedIn = false;
  response.redirect("/");
});

app.listen(8080);
