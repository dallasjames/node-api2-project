const express = require("express")
const db = require("./data/db")

const server = express()

server.use(express.json())

server.get("/api/posts", (req, res) => {
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

server.get("/api/posts/:id", (req, res) => {
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

server.get("/api/posts/:id/comments", (req, res) => {
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

server.post("/api/posts", (req, res) => {
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

server.post("/api/posts/:id/comments", (req, res) => {
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
                });
              });
          } else {
            res.status(404).json({ 
                message: "The post with the specified ID does not exist." 
            });
          }
        })
        .catch(error => {
        res.status(500).json({ 
            error: "Post information could not be retrieved." 
        });
        });
    } else {
      res.status(400).json({ errorMessage: "Please provide text for the comment." });
    }
})

server.delete("/api/posts/:id", (req, res) => {
    const id = req.params.id

    db.findById(id)
        .then(post => {
            if (post.length > 0) {
                db.remove(id)
                    .then(() => {
                        res.status(200).json({ message: "Success" });
                    })
                    .catch(error => {
                        res.status(500).json({ error: "The post could not be removed." });
                    });
            } else {
                res.status(404).json({ message: "Post with ID specified not found." });
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post information could not be retrieved." });
        });
})

server.listen(8080, () => {
    console.log("\nRunning on port 8080\n")
})