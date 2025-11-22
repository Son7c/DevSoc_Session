const Alert = ({ message, type = "error" }) => {
	if (!message) return null;

	const isError = type === "error";
	const bgColor = isError ? "bg-red-50" : "bg-green-50";
	const borderColor = isError ? "border-red-100" : "border-green-100";
	const iconColor = isError ? "text-red-500" : "text-green-500";
	const textColor = isError ? "text-red-600" : "text-green-600";

	return (
		<div
			className={`mb-6 ${bgColor} border ${borderColor} rounded-xl p-4 flex items-start gap-3`}
		>
			<div className={`${iconColor} mt-0.5`}>
				{isError ? (
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				) : (
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				)}
			</div>
			<p className={`${textColor} text-sm font-medium pt-0.5`}>{message}</p>
		</div>
	);
};

export default Alert;
