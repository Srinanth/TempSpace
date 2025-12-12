import app from "./app.js";
import dotenv from "dotenv";
import { bootstrap } from './bootstrap.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
bootstrap();

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});