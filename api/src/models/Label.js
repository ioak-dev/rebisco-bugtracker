const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema(
  {
    label: { type: String },
    defects:[ { type: mongoose.Schema.Types.ObjectId, ref: "Defect" }],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Label", labelSchema);
