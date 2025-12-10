import express from "express";
import cors from "cors";
// import spaceRoutes from "./routes/space.routes";
// import deviceMiddleware from "./middleware/device";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
// app.use(deviceMiddleware);

// Routes
// app.use("/spaces", spaceRoutes);


app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
