const router = require("express").Router();
const Snippet = require("../models/snippetModel");

router.get("/", async (req, res) => {
  try {
    // const snippets = await Snippet.find({title: "test"});
    const snippets = await Snippet.find();
    res.json(snippets);
  } catch (err) {
    res.status(500).send(); //internal server error that send nothing
  }
});

router.post("/", async (req, res) => {
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
    });

    const savedSnippet = await newSnippet.save();

    res.json(savedSnippet);
  } catch (err) {
    res.status(500).send();
  }
});

router.put("/:id", async (req, res) => {
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

    originalSnippet.title = title;
    originalSnippet.description = description;
    originalSnippet.code = code;

    const savedSnippet = await originalSnippet.save();

    res.json(savedSnippet);
  } catch (err) {
    res.status(500).send();
  }
});

router.delete("/:id", async (req, res) => {
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

    // await Snippet.findByIdAndDelete(snippetId)
    await existingSnippet.delete();

    res.json(existingSnippet); //this will tell the frontend which item was deleted
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
