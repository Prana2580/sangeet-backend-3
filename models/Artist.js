const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },

  id: {
    type: String,
   
  },
  genres: {
    type: Array,
  },
},{_id:false});

module.exports = mongoose.model("Artists", artistSchema);
