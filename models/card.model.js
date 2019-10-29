const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Card = new Schema({
    id:{
        type:Number
    },
    name: {
        type: String
    },
    status: {
        type: String
    },
    content: {
        type: String
    },
    category: {
        type: String
    },
    author:{
        type:String
    }
});
module.exports = mongoose.model('Card', Card);