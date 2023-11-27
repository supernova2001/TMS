import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import CreateUserRouter from "./routes/user.js";
import AuthRouter from "./routes/auth.js";
import searchRouter from "./routes/search.js";
import placeRouter from "./routes/places.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const allowedOrigins = ['http://localhost:3000']; // Remove the trailing slash

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

//connecting to database

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo Connected");
  } catch {
    console.log("Could not connect!");
  }
};

//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/auth", AuthRouter);
app.use("/user", CreateUserRouter);
app.use("/search", searchRouter);
app.use("/search-place", placeRouter);

app.listen(port, () => {
  connect();
  console.log("server listening on port", port);
});
// app.get("/", (req, res) => {
//   res.send("api working");
// });
