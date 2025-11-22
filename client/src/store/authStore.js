import { create } from "zustand";
import API from "../axios";

// Helper to safely get user from localStorage
const getUserFromStorage = () => {
	try {
		const userStr = localStorage.getItem("user");
		if (userStr) {
			const user = JSON.parse(userStr);

			return user;
		}
	} catch (error) {
		console.error("Auth Store - Error loading user from localStorage:", error);
		localStorage.removeItem("user");
	}
	return null;
};

const useAuthStore = create((set) => ({
	user: getUserFromStorage(),
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",

	register: async (userData) => {
		set({ isLoading: true, isError: false, isSuccess: false, message: "" });
		try {
			const response = await API.post("/users", userData);
			if (response.data) {
				localStorage.setItem("user", JSON.stringify(response.data));
				set({ user: response.data, isSuccess: true, isLoading: false });
			}
		} catch (error) {
			console.error("Registration failed:", error);
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			set({ message, isError: true, isLoading: false });
		}
	},

	login: async (userData) => {
		set({ isLoading: true, isError: false, isSuccess: false, message: "" });
		try {
			const response = await API.post("/users/login", userData);
			if (response.data) {
				localStorage.setItem("user", JSON.stringify(response.data));
				set({ user: response.data, isSuccess: true, isLoading: false });
			}
		} catch (error) {
			console.error("Login failed:", error);
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			set({ message, isError: true, isLoading: false });
		}
	},

	logout: () => {
		localStorage.removeItem("user");
		set({ user: null, isSuccess: false, isError: false, message: "" });
	},

	reset: () => {
		set({ isLoading: false, isError: false, isSuccess: false, message: "" });
	},

	// Helper to manually refresh user from localStorage
	refreshUser: () => {
		const user = getUserFromStorage();
		set({ user });
	},
}));

export default useAuthStore;
