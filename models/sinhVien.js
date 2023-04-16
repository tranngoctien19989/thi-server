const mongoose = require('mongoose')

const SinhVienSchema = new mongoose.Schema({
     namesv: { type: String },
     avatar: { type: String },
     namsx: { type: Number },
     gia: { type: Number },
     title: { type: String }
}, { timestamps: true })


const SinhVienModel = mongoose.model('thithu', SinhVienSchema)


module.exports = SinhVienModel;