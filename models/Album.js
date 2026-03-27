const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  artists: {
    type: Array,
    required: true,
  },

  duration: {
    type: String,
  },

  image: {
    type: String,
  },

  songs: {
    type: Array,
    
  },

  released: {
    type: String,
  },

  copyright_claims: {
    type: Object,
  },
});

module.exports = mongoose.model("Albums", albumSchema);
