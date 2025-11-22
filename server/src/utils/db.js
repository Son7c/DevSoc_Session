import mongoose from "mongoose";

export const connectDB = async (mongoUri) => {
	try {
		await mongoose.connect(mongoUri);
	} catch (error) {
		console.error(`MongoDB Connection Error: ${error.message}`);
		throw error;
	}
};
