const { Schema, model, Types } = require("mongoose");

const auditLogSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "Voter",
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "voter", "anonymous"],
      default: "anonymous",
    },
    action: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("AuditLog", auditLogSchema);

