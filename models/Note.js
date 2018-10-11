// mongoose required
const mongoose = require("mongoose");
// schema method defined
const Schema = mongoose.Schema;
//Schema for Note
const NoteSchema = new Schema({
    title: String,
    body: String,

})

// create model using schema and mongooe.model cmd
var Note = mongoose.model("Note", NoteSchema);
//module exported - required by index.js which is then read by server.js when models folder is required
module.exports= Note;