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
                error: "Sum Ting Wong"
            })
        })
})

server.get("/api/posts/:id", (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "It Not Here" })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "I Screw Up" })
        })
})

server.get("/api/posts/:id/comments", (req, res) => {
    db.findPostComments(req.params.id)
        .then(com => {
            if (com) {
                res.status(200).json(com)
            } else {
                res.status(404).json({ message: "No Comment Here" })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "Not Yet Fixed" })
        })
})



server.listen(8080, () => {
    console.log("\nRunning on port 8080\n")
})