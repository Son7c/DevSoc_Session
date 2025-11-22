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

// Connect to MongoDB
let isConnected = false;

const connectToDatabase = async () => {
	if (isConnected) {
		return;
	}
	try {
		await connectDB(envKeys.MONGO_URI);
		isConnected = true;
	} catch (err) {
		console.error("MongoDB connect error: ", err);
		throw err;
	}
};

// For Vercel serverless
export default async (req, res) => {
	await connectToDatabase();
	return app(req, res);
};

// For local development
if (process.env.NODE_ENV !== "production") {
	connectDB(envKeys.MONGO_URI)
		.then(() => {
			app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
		})
		.catch((err) => {
			console.error("MongoDB connect error: ", err);
			process.exit(1);
		});
}
