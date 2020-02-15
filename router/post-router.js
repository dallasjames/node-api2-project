const express = require("express")
const db = require("../data/db")
const router = express.Router()

router.get("/", (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({
                error: "The posts information could not be retrieved."
            })
        })
})

router.get("/:id", (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ 
                    message: "Post with ID specified not found." 
                });
            }
        })
        .catch(error => {
            res.status(500).json({ 
                error: "The post information could not be retrieved." 
            });
        });
})

router.get("/:id/comments", (req, res) => {
    db.findPostComments(req.params.id)
        .then(com => {
            if (com) {
                res.status(200).json(com)
            } else {
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist."
                 })
            }
        })
        .catch(err => {
            res.status(500).json({ 
                error: "The comments information could not be retrieved."
             })
        })
})

router.post("/", (req, res) => {
    const post = {
        title: req.body.title,
        contents: req.body.contents
    }
    if (!post.title || !post.contents) {
        return res.status(400).json({ 
            errorMessage: "Please provide title and contents for the post." 
        })
    }
    db.insert(post)
        .then(newPost => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({ 
                error: "There was an error while saving the post to the database" 
            })
        })
})

router.post("/:id/comments", (req, res) => {
    const { text } = req.body;

    if (text) {
      db.findById(req.params.id)
        .then(post => {
          if (post.length > 0) {
            db.insertComment({ text: text, post_id: req.params.id })
              .then(text => {
                res.status(201).json(text);
              })
              .catch(error => {
                res.status(500).json({ 
                    error: "There was an error while saving the comment to the database."
                })
              })
          } else {
            res.status(404).json({ 
                message: "The post with the specified ID does not exist." 
            })
          }
        })
        .catch(error => {
        res.status(500).json({ 
            error: "Post information could not be retrieved." 
        })
        })
    } else {
      res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
})

router.put("/:id", (req, res) => {
    const id = req.params.id;

    const { title, contents } = req.body;

    if (title && contents) {
        db.update(id, { title: title, contents: contents })
            .then(result => {
                if (result) {
                    db.findById(id)
                        .then(post => {
                            res.status(200).json(post)
                        })
                        .catch(error => {
                            res.status(500).json({ 
                                error: "There was an error retrieving post." 
                            })
                        })
                } else {
                    res.status(404).json({ 
                        message: "Post with specified ID not found." 
                })
                }
            })
            .catch(error => {
                res.status(500).json({ 
                    error: "There was an error while saving the post to the database." 
                })
            });
    } else {
        res.status(400).json({ 
            errorMessage: "Please provide title and contents for the post." 
    })
    }
})

router.delete("/:id", (req, res) => {
    const id = req.params.id

    db.findById(id)
        .then(post => {
            if (post.length > 0) {
                db.remove(id)
                    .then(() => {
                        res.status(200).json({ message: "Success" })
                    })
                    .catch(error => {
                        res.status(500).json({ error: "The post could not be removed." })
                    })
            } else {
                res.status(404).json({ message: "Post with ID specified not found." })
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post information could not be retrieved." })
        });
})


module.exports = router