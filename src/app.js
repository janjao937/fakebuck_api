require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimitMiddleware = require("./middleware/rate-limit");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleWare = require("./middleware/error");
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(rateLimitMiddleware);

app.use(express.json());

app.use(notFoundMiddleware);
app.use(errorMiddleWare);

const PORT = process.env.PORT || "5000";

app.listen(PORT,()=>console.log(`Server running on PORT: ${PORT}`));


