const express = require("express")
const cors = require("cors")
const router =  require("./router/post-router")

const server = express()

server.use(express.json())
server.use(cors())

server.use("/api/posts", router)

server.listen(8080, () => {
    console.log("\nRunning on port 8080\n")
})