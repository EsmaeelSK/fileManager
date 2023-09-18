const mongoose = require('mongoose');

const folderSchema = mongoose.Schema({
    name:{
        type:String ,
        trim: true,
        default: null,
        require: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        require: false,
        default: null
    }
})

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;