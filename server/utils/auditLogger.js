const AuditLog = require("../models/auditLogModel");

const auditLogger = async ({ req, user, action, resource, metadata }) => {
  try {
    const actor = user || req?.user || null;
    const role = actor
      ? actor.isAdmin
        ? "admin"
        : "voter"
      : "anonymous";

    const ip =
      req?.ip ||
      req?.headers?.["x-forwarded-for"] ||
      req?.connection?.remoteAddress ||
      "";

    const userAgent = req?.headers?.["user-agent"] || "";

    await AuditLog.create({
      userId: actor ? actor._id : null,
      role,
      action,
      resource,
      metadata,
      ip,
      userAgent,
    });
  } catch (err) {
    // Logging failures must never break main flow
    console.error("AUDIT LOG ERROR 👉", err.message || err);
  }
};

module.exports = auditLogger;

