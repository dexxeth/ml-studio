"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileJson } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function UploadDatasetComponent() {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;

		const allowedExtensions = [".csv", ".xlsx"];
		const fileExtension = selectedFile.name
			.slice(selectedFile.name.lastIndexOf("."))
			.toLowerCase();

		if (!allowedExtensions.includes(fileExtension)) {
			setError("Please upload a .csv or .xlsx file");
			setFile(null);
			return;
		}

		setFile(selectedFile);
		setError(null);
	};

	const handleFileUpload = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!file) return;

		setUploading(true);
		setError(null);

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("http://127.0.0.1:8000/upload", {
				method: "POST",
				body: formData,
			});
			const result = await response.json();

			if (response.ok) {
				alert(result.message);
				router.push(`/preview-dataset?collection=${result.raw_collection}`);
			} else {
				setError(result.error || "Upload failed");
			}
		} catch (err) {
			setError("Upload error");
			console.error(err);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<div className="container mx-auto py-10 px-4">
				<div className="max-w-2xl mx-auto">
					<h1 className="text-3xl font-bold tracking-tight mb-6">
						Upload Dataset
					</h1>
					<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
						<CardHeader>
							<CardTitle>Upload your dataset</CardTitle>
							<CardDescription>
								Upload a CSV or Excel file containing your data
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleFileUpload}>
								<div className="grid w-full items-center gap-6">
									<div className="flex flex-col space-y-1.5">
										<Label htmlFor="file">
											Dataset File (.csv or .xlsx)
										</Label>
										<div className="flex flex-col items-center gap-3">
											<div className="border border-dashed border-border rounded-lg p-8 w-full text-center cursor-pointer hover:bg-muted/50 transition-colors">
												<Input
													id="file"
													type="file"
													accept=".csv,.xlsx"
													className="hidden"
													onChange={handleFileChange}
												/>
												<Label
													htmlFor="file"
													className="cursor-pointer flex flex-col items-center gap-2">
													{file ? (
														<FileJson className="h-10 w-10 text-primary" />
													) : (
														<Upload className="h-10 w-10 text-muted-foreground" />
													)}
													<span className="text-sm text-muted-foreground">
														{file
															? file.name
															: "Click to upload or drag & drop a CSV/Excel file"}
													</span>
												</Label>
											</div>
											{error && (
												<div className="text-sm text-destructive mt-2">
													{error}
												</div>
											)}
										</div>
									</div>
									<Button
										type="submit"
										className="w-full"
										disabled={!file || uploading}>
										{uploading
											? "Uploading..."
											: "Upload and Continue"}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
