"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadModelButtonProps {
	file_id: string;
	modelType: string;
	filenameParam: string | null;
}

export const DownloadModelButton: React.FC<DownloadModelButtonProps> = ({
	file_id,
	modelType,
	filenameParam,
}) => {
	const handleDownloadModel = async (file_id: string) => {
		try {
			const response = await fetch(
				`http://localhost:8000/download-model/${file_id}`
			);

			if (!response.ok) {
				const errorType = await response.text();
				throw new Error(
					`Download failed: ${response.status} - ${errorType}`
				);
			}

			const blob = await response.blob();
			const contentDisposition = response.headers.get(
				"Content-Disposition"
			);
			const filenameMatch =
				contentDisposition?.match(/filename="?([^"]+)"?/);
			const cleanedFilename = filenameParam?.replace(
				/\.(csv|xls|xlsx)$/i,
				""
			);
			const fallbackFilename = `${cleanedFilename}_${modelType}.pkl`;
			const filename = filenameMatch
				? filenameMatch[1]
				: fallbackFilename;

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (error: any) {
			console.error("Model download error:", error);
			alert(`Download error: ${error.message}`);
		}
	};
	return (
		<div>
			<Button
				variant="outline"
				onClick={() => handleDownloadModel(file_id)}>
				<Download className=" h-4 w-4" /> Download Trained Model{" "}
			</Button>
		</div>
	);
};
