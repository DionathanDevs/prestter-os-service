const mongoose = require('mongoose');

const OsDetailsSchema = new mongoose.Schema({
    mysql_os_id: { 
        type: Number, 
        required: true, 
        unique: true,
        index: true 
    },
    checklist: {
        type: Map, 
        of: String
    },
    pictures: [{
        url: String,
        description: String,
        uploaded_at: { type: Date, default: Date.now }
    }],
    internal_notes: [{
        user: String,
        note: String,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('OsDetails', OsDetailsSchema);