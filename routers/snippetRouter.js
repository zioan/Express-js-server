const router = require("express").Router();
const Snippet = require("../models/snippetModel");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    // const snippets = await Snippet.find({title: "test"});
    const snippets = await Snippet.find({ user: req.user });
    res.json(snippets);
  } catch (err) {
    res.status(500).send(); //internal server error that send nothing
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, code } = req.body;

    //validation
    if (!title || !code) {
      return res.status(400).json({
        errorMessage: "You need to enter a title and some code",
      }); //bad request
    }

    const newSnippet = new Snippet({
      title,
      description,
      code,
      user: req.user,
    });

    const savedSnippet = await newSnippet.save();

    res.json(savedSnippet);
  } catch (err) {
    res.status(500).send();
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, code } = req.body;
    const snippetId = req.params.id;

    //validation
    if (!title || !code) {
      return res.status(400).json({
        errorMessage: "You need to enter a title and some code",
      }); //bad request
    }

    if (!snippetId) {
      return res.status(400).json({
        errorMessage: "Snippet ID not given. Please contact the developer.",
      });
    }

    const originalSnippet = await Snippet.findById(snippetId);
    if (!originalSnippet) {
      return res.status(400).json({
        errorMessage: `No snippet with the ID ${snippetId} was found. Please contact the developer.`,
      });
    }

    if (originalSnippet.user.toString() !== req.user) {
      return res.status(401).json({ errorMessage: "Unauthorized." });
    }

    originalSnippet.title = title;
    originalSnippet.description = description;
    originalSnippet.code = code;

    const savedSnippet = await originalSnippet.save();

    res.json(savedSnippet);
  } catch (err) {
    res.status(500).send();
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const snippetId = req.params.id;

    //validation
    if (!snippetId) {
      return res.status(400).json({
        errorMessage: "Snippet ID not given. Please contact the developer.",
      });
    }

    const existingSnippet = await Snippet.findById(snippetId);
    if (!existingSnippet) {
      return res.status(400).json({
        errorMessage: `No snippet with the ID ${snippetId} was found. Please contact the developer.`,
      });
    }

    if (existingSnippet.user.toString() !== req.user) {
      return res.status(401).json({ errorMessage: "Unauthorized." });
    }

    // await Snippet.findByIdAndDelete(snippetId)
    await existingSnippet.delete();

    res.json(existingSnippet); //this will tell the frontend which item was deleted
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
