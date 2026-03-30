const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },

  artistIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },

  duration: Number, // in seconds
  previewUrl: String, // Spotify-like preview
  audioUrl: String, // your stored file (Appwrite/S3)

  coverImage: String,

  genre: [String],

  releaseDate: Date,

  playCount: { type: Number, default: 0 },

  isExplicit: Boolean,

  spotifyId: String, // for syncing with Spotify API

}, { timestamps: true });

module.exports = mongoose.model("Musics", musicSchema);
