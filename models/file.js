const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    key:{
        type:String ,
        require: true,
    },
    address: {
        type: String,
        require: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        require: false,
        default: null
    },
    size: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        require: true
    }
})

const File = mongoose.model('File', fileSchema);
module.exports = File;