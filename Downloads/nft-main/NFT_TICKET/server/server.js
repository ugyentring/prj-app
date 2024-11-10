const app = require("./app");
const mongoose = require("mongoose");

const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" })

const DB = process.env.DATABASE.replace(
    "PASSWORD",
    process.env.DATABASEPASSWORD,
)

mongoose.connect(DB).then((con) => {
    console.log("DB Connection Successful");
}).catch(error => console.log(error));

const port = 4001;

app.listen(port, () => {
    console.log(`App running on Port ${port}`);
})