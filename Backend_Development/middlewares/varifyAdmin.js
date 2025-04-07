const express = require("express");
const asyncHandler = require("express-async-handler");

const verifyAdmin = asyncHandler(async(req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
});

module.exports = verifyAdmin;