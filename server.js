const express = require("express");
const path = require("path");

const { dbFilePath } = require("./config");

const json_handler = require("./src/json_handler");
const db = new json_handler(dbFilePath);
(async () => {
  await db.init();
})();

const app = express();

const { SERVER_URL, PORT } = require("./config");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  "/assets",
  express.static(path.resolve(__dirname, ".", "public", "assets"))
);

// route

app.get("/", (req, res) =>
  res.sendFile(path.resolve(__dirname, ".", "public", "index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.resolve(__dirname, ".", "public", "notes.html"))
);

//if route is api/notes,
app
  .route("/api/notes")
  //if get method, return data as json
  .get((req, res) => res.json(db.getData()))
  //if post method, add new note
  .post(async (req, res) => {
    //get the data
    const data = req.body;
    //check if data is not empty
    if (data.title && data.title.trim() && data.text && data.text.trim()) {
      //add to the database
      const isSuccess = await db.addNew(data);
      //if add is success, return 200
      if (isSuccess) {
        return res.status(200).end();
      }
    }
    //if not, send an error message back
    res.status(400).send("Error: cannot add empty data");
  });

app.delete("/api/notes/:id", async (req, res) => {
  // get id from route
  const id = req.params.id;
  //delete the note by given id
  const isSuccess = await db.deleteNote(id);
  //if success, return status 200
  if (isSuccess) {
    return res.status(200).end();
  }
  //if not, send an error message back
  res.status(400).send("Something went wrong with the data deletion.");
});

// ----- Listen -----
app.listen(PORT, () => console.log(`Listen on ${SERVER_URL}:${PORT}`));
