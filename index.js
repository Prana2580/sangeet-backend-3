require("dotenv").config();
const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const Music = require("./models/Music");
const Artist = require("./models/Artist");
const app = express();
const port = process.env.PORT || 3000;

require("./config/passport");

connectDB();

app.use(express.json());
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use("/auth", require("./routes/auth"));

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/google");
}

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.send(`Welcome ${req.user.displayName}!`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/musics", async (req, res) => {
  try {
    const musics = await Music.find();
    res.status(202).json(musics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/artists", async (req, res) => {
  const q = req.query.q;
  

  try {
    const query = q ? { name: { $regex: q, $options: "i" } } : {};
    const artists = await Artist.find(query);

    if (artists.length === 0) {
      return res.status(404).json({ error: "Artist not found" });
    }

    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/artist/:id",async(req,res)=>{
  const id = req.params.id

  try {
      const artistById = await Artist.findById(id);
      if (!artistById) {
        return res.status(404).json({ error: "Artist not found" });
      }
      res.status(200).json(artistById);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})

app.get("/admin/artist", (req, res) => {
  res.render("artist");
});

app.get("/admin/music-save",(req,res)=>{
  res.render("music")
})

app.get("/api/genres", (req, res) => {
  res.send([
    "Pop",
    "Rock",
    "Hip-Hop",
    "Rap",
    "R&B",
    "Soul",
    "Electronic (EDM)",
    "Country",
    "Reggae",
    "Classical",
    "Jazz",
    "Latin",
    "Folk",
    "Metal",
    "Gospel",
  ]);
});

app.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    try {
      const musics = await Music.find();
      res.status(202).json(musics);
      return;
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  try {
    const music = await Music.findOne({
      name: { $regex: query, $options: "i" },
    });
    if (!music) {
      return res.status(404).json({ error: "Music not found" });
    }
    res.status(200).json(music);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/add-new-artist", async (req, res) => {
  const { name, id, image, genres } = req.body;

  try {
    const artist = new Artist({ name, id, image, genres });
    await artist.save();
    res.status(201).json(artist);
  } catch (error) {
    res.json(error);
  }
});

app.listen(port, () => {
  console.log("Server is running on port 3001");
});
