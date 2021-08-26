#!/usr/bin/env node

const path = require("path")
const distDir = path.join(__dirname, "..", "..", "dist")

const model = require(path.join(distDir, "model.cjs.js"))

console.info("model keys:", Object.keys(model).sort())
