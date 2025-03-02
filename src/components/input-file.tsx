"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export function InputFile() {
	const [dragActive, setDragActive] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			// Handle the file upload here
			console.log("File dropped:", e.dataTransfer.files[0]);
		}
	};

	const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]; // Get the file

		if (!file) {
			console.error("No file selected!");
			return;
		}

		const filePath = `files/${file.name}`;

		const { data, error } = await supabase.storage
			.from("datasets") // Change to your bucket name
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (error) {
			console.error("Upload error:", error.message);
		} else {
			console.log("File uploaded successfully:", data);
		}

		router.push("/data-preview");
	};

	const onButtonClick = () => {
		inputRef.current?.click();
	};

	const handleBrowseClick = () => {
		if (inputRef.current) {
			inputRef.current.accept =
				".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
			inputRef.current.click();
		}
	};

	return (
		<div className="w-full min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
			<div className="max-w-4xl mx-auto p-6 md:p-8 relative">
				{/* Decorative pattern overlay */}
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTEgMEg2MHYxLjFBNjAgNjAgMCAwIDAgLjEgNjBoMS44YTYwIDYwIDAgMCAwIDU4LjEtNTguMVYwaC0uMXpNNjAgNTkuOVYwSDU5LjlBNjAgNjAgMCAwIDAgMCAuMXYxLjhhNjAgNjAgMCAwIDAgNTguMSA1OC4xaDEuOXoiIGZpbGx9IiMyMDIwMjAiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')] opacity-5" />

				<div className="relative">
					{/* Header Section */}
					<div className="flex flex-col items-center justify-center text-center mb-12">
						<h1 className="text-4xl font-bold mb-3 text-white bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
							Upload your Dataset
						</h1>
						<p className="text-gray-400 max-w-md text-lg">
							Upload CVS or Excel file only
						</p>
					</div>

					{/* Upload Card */}
					<Card className="w-full backdrop-blur-xl bg-gray-900/50 border-gray-800/50 shadow-2xl mb-12">
						<CardContent>
							<form
								className="flex items-center justify-center w-full"
								onDragEnter={handleDrag}
								onSubmit={(e) => e.preventDefault()}>
								<Input
									ref={inputRef}
									type="file"
									accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
									onChange={handleChange}
									className="hidden"
								/>

								<div
									className={`flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200 ${
										dragActive
											? "border-green-500 bg-green-500/10 scale-[0.99]"
											: "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
									}`}
									onClick={onButtonClick}
									onDragEnter={handleDrag}
									onDragLeave={handleDrag}
									onDragOver={handleDrag}
									onDrop={handleDrop}>
									<Upload className="w-12 h-12 text-gray-400 mb-4" />
									<p className="text-lg text-gray-300 font-medium">
										Drop & Drop your Data
									</p>
									<p className="text-sm text-gray-500 mt-1 mb-6">
										or click to browse
									</p>

									<Button
										className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white transition-all duration-200 shadow-lg hover:shadow-green-500/25"
										onClick={(e) => {
											e.stopPropagation();
											handleBrowseClick();
										}}>
										Browse you Data
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					{/* About Section */}
					<div className="space-y-8">
						<div className="text-center max-w-2xl mx-auto">
							<h2 className="text-2xl font-bold mb-4 text-white">
								ML Studio
							</h2>
							<p className="text-gray-400">About Section</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
