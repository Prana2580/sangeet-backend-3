const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: Array,
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

  albums:{
    type:Object,
  }
});

module.exports = mongoose.model("Musics", musicSchema);
