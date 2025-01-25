const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const saltRounds = 10;

const createUser = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = await User.create(req.body);

    const { password, ...userWithoutPassword } = newUser.toObject();
    return res.status(201).json({
      status: "ok",
      user: userWithoutPassword,
    });
  } catch (err) {
    return res.status(400).json({
      message: `user is not created ${err}`,
    });
  }
};

const addGroup = async (req, res) => {
  try {
    const { id } = req.user; // Get user ID from authenticated request
    const { fname, sname, color } = req.body; // Extract group details

    // Validate required fields
    if (!fname || !sname || !color) {
      return res.status(400).json({
        message: "Please provide full name, short name, color",
      });
    }

    // Find user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const newGroup = user.group.create({
      fname,
      sname,
      color,
    });

    user.group.push(newGroup); // Push new group to array
    await user.save(); // Save the updated user document

    return res.status(200).json({
      status: "ok",
      data: newGroup, // This will now include _id
      message: "Group added successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: `Error adding group: ${err.message}`,
    });
  }
};

const addNote = async (req, res) => {
  try {
    const { id } = req.user;
    const { note, date, time, groupId } = req.body;

    // Validate required fields
    if (!note || !date || !time || !groupId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided groupId exists in the user's groups
    const groupExists = user.group.some(
      (group) => group._id.toString() === groupId
    );
    if (!groupExists) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    // Create the new note object and push it to the user's notes
    const newNote = { note, date, time, groupId };
    user.notes.push(newNote);

    // Save the updated user document
    await user.save();

    // Retrieve the newly added note
    const savedNote = user.notes[user.notes.length - 1];

    return res.status(200).json({
      status: "ok",
      message: "Note added successfully",
      data: savedNote, // Send both the _id and the note details
    });
  } catch (err) {
    return res.status(500).json({
      message: `Error adding Note: ${err.message}`,
    });
  }
};

module.exports = { createUser, addGroup, addNote };
