import express from "express";
// import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// app.use(cors({
//   origin: process.env.FRONT_END_URL,
//   credentials: true,
// }));
app.use(express.json());


// app.get("/", (_req, res) => {
//   res.send("");
// });

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});