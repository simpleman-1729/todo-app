const express = require("express");
const router = express.Router();
const controller = require("../controllers/task.controller");

router.post("/", controller.createTask);
router.get("/", controller.getTasks);
router.delete("/:id", controller.deleteTask);

module.exports = router;
