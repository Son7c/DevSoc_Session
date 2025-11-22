import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./utils/db.js";
import { envKeys } from "./utils/envKeys.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: envKeys.CLIENT_URL,
		credentials: true,
	}),
);

const PORT = envKeys.PORT;

// Routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/posts", postRoutes);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

// Connect to MongoDB and start server
connectDB(envKeys.MONGO_URI)
	.then(() => {
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((err) => {
		console.error("MongoDB connect error: ", err);
		process.exit(1);
	});
