const express = require("express")
const cors = require("cors")
const {connect} = require("mongoose")

require("dotenv").config()

const app = express()
app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))
app.use(cors({credentials: true, origin: ["http://localhost300"]}))

app.listen(process.env.PORT , () => console.log(`Server started on port ${process.env.PORT}`))

