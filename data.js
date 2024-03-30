const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("myDB.db");

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

// get projects

exports.getAllProjects = function (callback) {
  const query = "SELECT * FROM projects ORDER BY id DESC";

  db.all(query, function (error, projects) {
    callback(error, projects);
  });
};

// get one project

exports.getOneProject = function (id, callback) {
  const query = "SELECT * FROM projects WHERE id = ?";
  const values = [id];

  db.get(query, values, function (error, project) {
    callback(error, project);
  });
};

// create project

exports.createProject = function (
  title,
  category,
  description,
  imageURL1,
  repository,
  link,
  date,
  callback
) {
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
    callback(error);
  });
};

// get edit project

exports.getEditProject = function (id, callback) {
  const queryProject = `SELECT * FROM projects WHERE id = ?`;
  const values = [id];

  db.get(queryProject, values, function (error, project) {
    callback(error, project);
  });
};

// edit project

exports.editProject = function (
  title,
  category,
  description,
  imageURL1,
  repository,
  link,
  date,
  id,
  callback
) {
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
    callback(error);
  });
};

// get delete project

exports.getDeleteProject = function (callback) {
  const query = "SELECT * FROM projects WHERE id = ?";
  const values = [id];

  db.get(query, values, function (error, project) {
    callback(error, project);
  });
};

// delete project

exports.deleteProject = function (id, callback) {
  const values = [id];
  const query = `DELETE FROM projects WHERE id = ?;`;

  db.run(query, values, function (error) {
    callback(error);
  });
};

// get messages

exports.getAllMessages = function (callback) {
  const query = "SELECT * FROM contact ORDER BY id DESC";

  db.all(query, function (error, contact) {
    callback(error, contact);
  });
};

// create messages

exports.createMessage = function (name, email, message, callback) {
  const query = "INSERT INTO contact (name, email, message) VALUES (?, ?, ?)";
  const values = [name, email, message];

  db.run(query, values, function (error) {
    callback(error);
  });
};

// delete message

exports.deleteMessage = function (id, callback) {
  const values = [id];
  const query = `DELETE FROM contact WHERE id = ?;`;

  db.run(query, values, function (error) {
    callback(error);
  });
};
