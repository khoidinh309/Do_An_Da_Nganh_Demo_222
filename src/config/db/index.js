const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/smart_home_project');
        console.log('connect sucessfully');
    } catch (error) {
        console.log('error connecting');
    }
}

module.exports = { connect };
