const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/userController");
const validateToken = require("../middleware/authmiddleware");
const { addGroup, addNote } = require("../controllers/userController");

router.route("/").post(createUser);
router.route("/addGroup").patch(validateToken, addGroup);
router.route("/addNote").patch(validateToken, addNote);

module.exports = router;
