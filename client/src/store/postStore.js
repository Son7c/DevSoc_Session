import { create } from "zustand";
import API from "../axios";

const usePostStore = create((set) => ({
	posts: [],
	isLoading: false,
	isError: false,
	isSuccess: false,
	message: "",

	getPosts: async () => {
		set({ isLoading: true, isError: false, message: "" });
		try {
			const response = await API.get("/posts");
			set({
				posts: response.data,
				isLoading: false,
				isSuccess: true,
				isError: false,
			});
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			set({ message, isError: true, isLoading: false, isSuccess: false });
		}
	},

	createPost: async (postData) => {
		set({ isLoading: true, isError: false, message: "" });
		try {
			const response = await API.post("/posts", postData);
			set((state) => ({
				posts: [...state.posts, response.data],
				isLoading: false,
				isSuccess: true,
				isError: false,
			}));
			return response.data;
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			set({ message, isError: true, isLoading: false, isSuccess: false });
			throw error;
		}
	},

	deletePost: async (id) => {
		set({ isLoading: true, isError: false, message: "" });
		try {
			await API.delete(`/posts/${id}`);
			set((state) => ({
				posts: state.posts.filter((post) => post._id !== id),
				isLoading: false,
				isSuccess: true,
				isError: false,
			}));
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			set({ message, isError: true, isLoading: false, isSuccess: false });
			throw error;
		}
	},

	updatePost: async (id, postData) => {
		set({ isLoading: true, isError: false, message: "" });
		try {
			const response = await API.put(`/posts/${id}`, postData);
			set((state) => ({
				posts: state.posts.map((post) =>
					post._id === id ? response.data : post,
				),
				isLoading: false,
				isSuccess: true,
				isError: false,
			}));
			return response.data;
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();
			set({ message, isError: true, isLoading: false, isSuccess: false });
			throw error;
		}
	},

	reset: () => {
		set({ isLoading: false, isError: false, isSuccess: false, message: "" });
	},
}));

export default usePostStore;
