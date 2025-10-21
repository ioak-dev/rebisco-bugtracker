const mongoose = require("mongoose");

const defectSchema = new mongoose.Schema(
  {
    raisedByTeam: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    activities: {
      type: String,
      default: "",
    },
    responsible: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
      default: "Low",
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Blocked", "Closed", "Reopened"],
      required: true,
      default: "Open",
    },
    nextCheck: {
      type: Date,
    },
    remark: {
      type: String,
      default: "",
    },
    comments: [
      {
        id: { type: String },
        author: {
          accountId: { type: String },
          emailAddress: { type: String },
          displayName: { type: String },
          active: { type: Boolean, default: true },
        },
        content: [
          {
            type: { type: String },
            text: { type: String },
          },
        ],
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Defect", defectSchema);
