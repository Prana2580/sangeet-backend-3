require("dotenv").config();
const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const Music = require("./models/Music");
const Albums = require("./models/Album");
const getSongInfoFromUrl = require("./config/get-music-info");
const cors = require("cors");

const Artist = require("./models/Artist");
const Album = require("./models/Album");
const Ashay = require("./models/Ashay");
const app = express();
const port = process.env.PORT || 3000;

require("./config/passport");

connectDB();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "https://sangeet-3-backend.onrender.com",
      "https://bloghero.neocities.org",
      "https://sangeet-web.vercel.app",
      "https://ashay05.github.io/music-A-H",
      "https://ashay05.github.io"
    ],
  }),
);
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

// Basic route to test if the server is running

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Admin routes from here

app.get("/admin/artist", (req, res) => {
  res.render("artist");
});

app.get("/admin/album-save", (req, res) => {
  
  res.render("album");
});

app.get("/admin/music-save", (req, res) => {
  res.send("Database is down by owner. Please try again later.");
  // res.render("music");
});

app.get("/admin/ashay", (req, res) => {
  res.render("ashay");
});

// API ROUTES START HERE

app.get("/api/genres", (req, res) => {
  const q = req.query.find;

  if (q) {
    const genres = [
      { id: 1, name: "Pop" },
      { id: 2, name: "Rock" },
      { id: 3, name: "Hip-Hop" },
      { id: 4, name: "Rap" },
      { id: 5, name: "R&B" },
      { id: 6, name: "Soul" },
      { id: 7, name: "Electronic (EDM)" },
      { id: 8, name: "Country" },
      { id: 9, name: "Reggae" },
      { id: 10, name: "Classical" },
      { id: 11, name: "Jazz" },
      { id: 12, name: "Latin" },
      { id: 13, name: "Folk" },
      { id: 14, name: "Metal" },
      { id: 15, name: "Gospel" },
    ];

    const filteredGenres = genres.filter((genre) =>
      genre.name.toLocaleLowerCase().includes(q.toLocaleLowerCase()),
    );
    res.send(filteredGenres);
    return;
  }

  res.send([
    { id: 1, name: "Pop" },
    { id: 2, name: "Rock" },
    { id: 3, name: "Hip-Hop" },
    { id: 4, name: "Rap" },
    { id: 5, name: "R&B" },
    { id: 6, name: "Soul" },
    { id: 7, name: "Electronic (EDM)" },
    { id: 8, name: "Country" },
    { id: 9, name: "Reggae" },
    { id: 10, name: "Classical" },
    { id: 11, name: "Jazz" },
    { id: 12, name: "Latin" },
    { id: 13, name: "Folk" },
    { id: 14, name: "Metal" },
    { id: 15, name: "Gospel" },
  ]);
});

app.post("/api/get-song-info", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  try {
    const songInfo = await getSongInfoFromUrl(url);
    res.status(200).json(songInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

app.post("/api/album-save", async (req, res) => {
  const {
    name,
    releasedyear,
    total_running_time,
    image,
    // These will now automatically grab the IDs from the hidden inputs we created!
    artist_ids,
    song_ids,
    copyright_claims,
  } = req.body;

  try {
    const album = new Albums({
      name,
      released: releasedyear,
      duration: total_running_time,
      image,
      // These will now automatically grab the IDs from the hidden inputs we created!
      artists: artist_ids,
      songs: song_ids,
      copyright_claims,
    });
    await album.save();
    res.status(201).json(album);
  } catch (error) {
    res.json(error);
  }
});

app.post("/api/musics-save", async (req, res) => {
  const {
    name,
    image,
    url,
    artist_ids, // Gets array of IDs
    album_id,
    genre_ids,
    duration,
    releasedDate,
  } = req.body;

  try {
    const music = new Music({
      title: name,
      coverImage: image,
      audioUrl: url,
      artists: artist_ids,
      album: album_id,
      genre: genre_ids,
      duration: duration,
      isExplicit: true,
      releaseDate: releasedDate,
    });
    await music.save();

    // 2. Update Album (IMPORTANT)
    if (album_id) {
      await Album.findByIdAndUpdate(
        album_id,
        {
          $addToSet: { songs: music._id },
        },
        { new: true },
      );
    }

    res.status(201).json(music);
  } catch (error) {
    res.json(error);
  }
});

app.get("/api/musics", async (req, res) => {
  const q = req.query.query;

  if (q) {
    try {
      const music = await Music.findOne({
        name: { $regex: q, $options: "i" },
      });
      if (!music) {
        return res.status(404).json({ error: "Music not found" });
      }
      res.status(200).json([music]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

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

app.get("/api/albums", async (req, res) => {
  const q = req.query.q;

  try {
    const query = q ? { name: { $regex: q, $options: "i" } } : {};
    const albums = await Albums.find(query);

    if (albums.length === 0) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/artist/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const artistById = await Artist.find({ _id: id });
    if (!artistById) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.status(200).json(artistById[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/ashay/musics", async (req, res) => {
  try {
    const ashay = await Ashay.find();
    res.status(202).json(ashay);
  } catch (error) {
    res.json(error);
  }
});

app.post("/api/ashay/store-song", async (req, res) => {
  const { name, artists, audioUrl, coverImage } = req.body;

  try {
    const ashay = new Ashay({
      name,
      coverImage: coverImage,
      audioUrl: audioUrl,
      artists: artists,
    });
    await ashay.save();
    res.status(201).json(music);
  } catch (error) {
    res.json(error);
  }
});

app.listen(port, () => {
  console.log("Server is running on port http://localhost:3001");
});
