"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
var mongoose_1 = require("mongoose");
var FileSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    localPath: { type: String, required: true, unique: true },
    storagePath: { type: String, required: true, unique: true },
    size: { type: Number, required: false },
});
exports.File = (0, mongoose_1.model)('File', FileSchema);
