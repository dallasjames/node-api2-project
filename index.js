const express = require("express")
const cors = require("cors")
const router =  require("./router/post-router")
const port = process.env.PORT || 8080
const host = process.env.HOST || "127.0.0.1"

const server = express()

server.use(express.json())
server.use(cors())

server.use("/api/posts", router)

server.listen(port, () => {
    console.log(`\nRunning on port ${port}\n`)
})