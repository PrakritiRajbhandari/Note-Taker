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

//ROUTES
app.get("/", (req, res) =>
  res.sendFile(path.resolve(__dirname, ".", "public", "index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.resolve(__dirname, ".", "public", "notes.html"))
);

app
  .route("/api/notes")
  .get((req, res) => res.json(db.getData()))
  .post(async (req, res) => {
    const data = req.body;
    if (data.title && data.title.trim() && data.text && data.text.trim()) {
      const isSucess = await db.addNew(data);

      if (isSucess) {
        return res.status(200).end();
      }
    }
    res.status(400).send("Error:cannot add empty data");
  });

app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  const isSucess = await db.deleteNote(id);

  if (isSucess) {
    return res.status(200).end();
  }

  res.status(400).send("something went wrong with the data deletion.");
});

app.listen(PORT, () => console.log("Listen on ${SERVER_URL}:${PORT}"));
