const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    genres: {
      type: Array,
    },
  },
  
);

module.exports = mongoose.model("Artists", artistSchema);
