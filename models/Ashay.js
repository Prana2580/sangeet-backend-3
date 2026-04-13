const mongoose = require("mongoose");

/**
 * Music Schema
 * @typedef {Object} Music
 * @property {string} title - The title of the music track (required)
 * @property {mongoose.Schema.Types.ObjectId[]} artists - Array of references to Artist documents
 * @property {mongoose.Schema.Types.ObjectId} album - Reference to the Album document
 * @property {number} duration - Duration of the track in seconds
 * @property {string} previewUrl - Preview URL for the track (Spotify-like preview)
 * @property {string} audioUrl - URL to the stored audio file (Appwrite/S3)
 * @property {string} coverImage - URL to the cover image of the track
 * @property {string[]} genre - Array of genre tags for the track
 * @property {Date} releaseDate - Release date of the track
 * @property {number} playCount - Number of times the track has been played (default: 0)
 * @property {boolean} isExplicit - Whether the track contains explicit content
 * @property {string} spotifyId - Spotify ID for syncing with Spotify API
 * @property {Date} createdAt - Timestamp when the document was created
 * @property {Date} updatedAt - Timestamp when the document was last updated
 */
const ashaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    artists: { type: String },
    //   album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },

    //   duration: Number, // in seconds
    //   previewUrl: String, // Spotify-like preview
    audioUrl: String, // your stored file (Appwrite/S3)

    coverImage: String,

    //   genre: [String],

    //   releaseDate: Date,

    //   playCount: { type: Number, default: 0 },

    //   isExplicit: Boolean,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Ashay", ashaySchema);
