"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileDown, Play, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

interface ModelInfo {
	id: string;
	name: string;
	type: string;
	accuracy: number;
	created: string;
	status: string;
}

export default function ModelsPage() {
	const [savedModels, setSavedModels] = useState<ModelInfo[]>([]);

	useEffect(() => {
		// Check if we have a newly trained model
		const modelType = localStorage.getItem("modelType");
		const modelResults = localStorage.getItem("modelResults");

		if (modelType && modelResults) {
			try {
				const results = JSON.parse(modelResults);

				// Add the new model to the list
				const newModel: ModelInfo = {
					id: `model-${Date.now()}`,
					name: `${modelType.replace("_", " ")} Model`,
					type: modelType.replace("_", " "),
					accuracy: results.accuracy,
					created: new Date().toISOString().split("T")[0],
					status: "active",
				};

				// Add to existing models
				setSavedModels((prev) => {
					// Check if we already have this model (avoid duplicates on re-renders)
					if (
						prev.some(
							(m) =>
								m.created === newModel.created &&
								m.type === newModel.type
						)
					) {
						return prev;
					}
					return [newModel, ...prev];
				});

				// Clear the localStorage to avoid adding the same model multiple times
				localStorage.removeItem("modelType");
				localStorage.removeItem("modelResults");
			} catch (error) {
				console.error("Error parsing model results:", error);
			}
		}

		// Add some sample models if we don't have any
		setSavedModels((prev) => {
			if (prev.length === 0) {
				return [
					{
						id: "model-001",
						name: "Random Forest Classifier",
						type: "Random Forest",
						accuracy: 0.95,
						created: "2023-11-15",
						status: "active",
					},
					{
						id: "model-002",
						name: "Housing Price Predictor",
						type: "Gradient Boosting",
						accuracy: 0.89,
						created: "2023-11-10",
						status: "active",
					},
				];
			}
			return prev;
		});
	}, []);

	const handleDeleteModel = (id: string) => {
		setSavedModels((prev) => prev.filter((model) => model.id !== id));
	};

	const handleDownloadModel = (model: ModelInfo) => {
		// Create a JSON object with model info
		const modelData = {
			id: model.id,
			name: model.name,
			type: model.type,
			accuracy: model.accuracy,
			created: model.created,
			status: model.status,
			// Add mock model parameters
			parameters: {
				n_estimators: 100,
				max_depth: 10,
				min_samples_split: 2,
				min_samples_leaf: 1,
			},
		};

		// Convert to JSON string
		const jsonString = JSON.stringify(modelData, null, 2);

		// Create a blob and download link
		const blob = new Blob([jsonString], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = `${model.name.toLowerCase().replace(/\s+/g, "-")}.json`;
		document.body.appendChild(a);
		a.click();

		// Clean up
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<div className="container mx-auto py-10 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
						<h1 className="text-3xl font-bold tracking-tight">
							Saved Models
						</h1>
						<Link href="/upload">
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Train New Model
							</Button>
						</Link>
					</div>

					<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
						<CardHeader>
							<CardTitle>Your Trained Models</CardTitle>
							<CardDescription>
								View, download, or delete your previously
								trained models
							</CardDescription>
						</CardHeader>
						<CardContent className="overflow-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Accuracy</TableHead>
										<TableHead>Created</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{savedModels.map((model) => (
										<TableRow key={model.id}>
											<TableCell className="font-medium">
												{model.name}
											</TableCell>
											<TableCell>{model.type}</TableCell>
											<TableCell>
												{(model.accuracy * 100).toFixed(
													1
												)}
												%
											</TableCell>
											<TableCell>
												{model.created}
											</TableCell>
											<TableCell>
												<Badge
													variant={
														model.status ===
														"active"
															? "default"
															: "secondary"
													}>
													{model.status}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button
														variant="outline"
														size="icon">
														<Play className="h-4 w-4" />
														<span className="sr-only">
															Deploy
														</span>
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() =>
															handleDownloadModel(
																model
															)
														}>
														<Download className="h-4 w-4" />
														<span className="sr-only">
															Download
														</span>
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() =>
															handleDeleteModel(
																model.id
															)
														}>
														<Trash2 className="h-4 w-4" />
														<span className="sr-only">
															Delete
														</span>
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}

									{savedModels.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={6}
												className="text-center py-6">
												<div className="flex flex-col items-center gap-2">
													<p className="text-muted-foreground">
														No models found
													</p>
													<Link href="/upload">
														<Button
															variant="outline"
															size="sm">
															Train your first
															model
														</Button>
													</Link>
												</div>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
						<CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
							<div className="text-sm text-muted-foreground">
								Showing {savedModels.length} models
							</div>
							<Button
								variant="outline"
								disabled={savedModels.length === 0}>
								<FileDown className="mr-2 h-4 w-4" />
								Export All Models
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}
