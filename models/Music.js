const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
  },
  image: {
    type: String,
  },

  musicUrl: {
    type: String,
  },

  played_time: {
    type: Number,
  },
});

module.exports = mongoose.model("Musics", musicSchema);
