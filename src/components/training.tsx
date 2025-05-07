"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BarChart2, Check, Download } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useSearchParams } from "next/navigation";

interface ModelResults {
	accuracy: number;
	r2: number;
	mae: number;
	rmse: number;
}

export default function TrainingPageComponent() {
	const [isTraining, setIsTraining] = useState(false);
	const [progress, setProgress] = useState(0);
	const [modelType, setModelType] = useState("");
	const [trainingComplete, setTrainingComplete] = useState(false);
	const [modelResults, setModelResults] = useState<ModelResults | null>(null);
	const [loading, setLoading] = useState(true);
	const searchParams = useSearchParams();
	const collectionName = searchParams?.get("collection");
	const [autoModelSelection, setAutoModelSelection] = useState(
		Boolean(searchParams?.get("auto_model_selection"))
	);

	// const [result, setResult] = useState<Dataset | null>(null);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!collectionName) {
			alert("Missing dataset collection name");
			return;
		}
		setLoading(false);
		// setResult(null);
		setDownloadUrl(null);
	}, [searchParams, collectionName]);

	const handleStartTraining = async () => {
		setIsTraining(true);
		setTrainingComplete(false);
		setProgress(0);

		const interval = setInterval(() => {
			setProgress((prev) => (prev < 95 ? prev + 5 : prev));
		}, 500);

		try {
			const response = await fetch("http://127.0.0.1:8000/train-model", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					collection_name: collectionName,
					model_type: modelType,
					auto_model_selection: autoModelSelection,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				alert(data.error || "Training failed");
				return;
			}

			setModelResults(data.metrics);
			setTrainingComplete(true);
			setDownloadUrl(
				`http://127.0.0.1:8000/download-model/${data.file_id}`
			);
		} catch (err) {
			console.error("Error during training:", err);
			alert("An error occurred during training.");
		} finally {
			clearInterval(interval);
			setProgress(100);
			setIsTraining(false);
		}
	};

		const handleDownloadModel = async (file_id: string) => {
		  try {
			const response = await fetch(`http://localhost:8000/download-model/${file_id}`);
	  
			if (!response.ok) {
			  throw new Error('Failed to download model');
			}
	  
			const blob = await response.blob();
			const contentDisposition = response.headers.get('Content-Disposition');
			const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
			const filename = filenameMatch ? filenameMatch[1] : 'model.pkl';
	  
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			a.click();
			window.URL.revokeObjectURL(url);
		  } catch (err) {
			console.error(err);
			alert('Failed to download model. Check backend and file ID.');
		  }
		};
	
	
	if (loading || !collectionName) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
				<div className="container mx-auto py-10 px-4">
					<div className="flex justify-center items-center h-64">
						<div className="text-center">
							<h2 className="text-xl font-medium">
								Loading model training...
							</h2>
							<p className="text-muted-foreground">
								Please wait while we prepare your training
								environment
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<div className="container mx-auto py-10 px-4">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold tracking-tight mb-6">
						Model Training
					</h1>
					<div className="grid gap-6 md:grid-cols-3 mb-6">
						<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">
									Model Type
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Select
									value={modelType}
									onValueChange={setModelType}
									disabled={isTraining || autoModelSelection}>
									<SelectTrigger>
										<SelectValue placeholder="Select model type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="random_forest">
											Random Forest
										</SelectItem>
										<SelectItem value="linear_regression">
											Linear Regression
										</SelectItem>
										<SelectItem value="svm">
											Support Vector Machine
										</SelectItem>
										<SelectItem value="k_means">
											K Means
										</SelectItem>
									</SelectContent>
								</Select>
							</CardContent>
						</Card>
						<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">
									Auto Model Selection
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between space-y-0">
									<Label htmlFor="auto-model-selection">
										Enable Auto Selection
									</Label>
									<Switch
										id="auto-model-selection"
										checked={autoModelSelection}
										onCheckedChange={(val) =>
											setAutoModelSelection(val)
										}
										disabled={isTraining}
									/>
								</div>
							</CardContent>
						</Card>
					</div>
					<Card className="mb-6 border-border/40 bg-card/50 backdrop-blur-sm">
						<CardHeader>
							<CardTitle>Training Progress</CardTitle>
							<CardDescription>
								{" "}
								{isTraining
									? "Training in progress..."
									: trainingComplete
									? "Training complete! View results below."
									: "Configure your model settings and start training"}{" "}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isTraining || trainingComplete ? (
								<div className="space-y-4">
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>Progress</span>
											<span>{progress}%</span>
										</div>
										<Progress value={progress} className="h-2" />
									</div>
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<Check className={`h-4 w-4 ${ progress >= 25 ? "text-primary" : "text-muted-foreground" }`} />
											<span className={ progress >= 25 ? "" : "text-muted-foreground" }>
												{" "} Data preprocessing{" "}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Check className={`h-4 w-4 ${ progress >= 50 ? "text-primary" : "text-muted-foreground" }`} />
											<span className={ progress >= 50 ? "" : "text-muted-foreground" }>
												{" "} Model initialization{" "}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Check className={`h-4 w-4 ${ progress >= 75 ? "text-primary" : "text-muted-foreground" }`} />
											<span className={ progress >= 75 ? "" : "text-muted-foreground" }>
												{" "} Training model{" "}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Check className={`h-4 w-4 ${ progress >= 100 ? "text-primary" : "text-muted-foreground" }`} />
											<span className={ progress >= 100 ? "" : "text-muted-foreground" } >
												{" "} Evaluating performance{" "}
											</span>
										</div>
									</div>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-6 space-y-4">
									<div className="text-center">
										<p className="text-muted-foreground mb-4">
											Ready to train your model click Start Training
										</p>
										<Button onClick={handleStartTraining}> {" "} Start Training{" "}</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
					{trainingComplete && modelResults && (
						<Tabs defaultValue="metrics" className="w-full">
							<TabsContent value="metrics">
								<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<BarChart2 className="h-5 w-5" />{" "}
											Model Performance Metrics
										</CardTitle>
										<CardDescription>
											{" "}
											Evaluation metrics for the trained{" "}
											{modelType.replace( "_", " " )} model{" "}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											{[
												{ name: "Accuracy", value: modelResults.accuracy, displayValue: `${modelResults.accuracy.toFixed(2)} %`, showProgress: true, progressValue: modelResults.accuracy,
												},
												{ name: "R2 Score", value: modelResults.r2, displayValue: `${(modelResults.r2 * 100).toFixed(2)} %`, showProgress: true, progressValue: modelResults.r2 * 100,
												},
												{ name: "MAE Score", value: modelResults.mae, displayValue:modelResults.mae.toFixed(2), showProgress: false,
												},
												{ name: "RMSE Score", value: modelResults.rmse, displayValue:modelResults.rmse.toFixed(2), showProgress: false,
												},
											].map((metric, i) => (
												<Card
													key={i}
													className="overflow-hidden border-border/40 bg-card/50">
													<CardHeader className="p-4 pb-2">
														<CardTitle className="text-sm font-medium">
															{metric.name}
														</CardTitle>
													</CardHeader>
													<CardContent className="p-4 pt-0">
														<div className="text-2xl font-bold">
															{metric.displayValue}
														</div>
														{metric.showProgress && (
															<Progress value={ metric.progressValue } className="h-2 mt-2"/>)}
													</CardContent>
												</Card>
											))}
										</div>
									</CardContent>
									<CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
										<Button
											variant="outline"
											onClick={downloadUrl ? () => {
												const file_id = downloadUrl.split("/").pop()
												if (file_id) handleDownloadModel(file_id)
												} : undefined}>
											{" "}
											<Download className="mr-2 h-4 w-4" />{" "}
											Download Model{" "}
										</Button>
									</CardFooter>
								</Card>
							</TabsContent>
						</Tabs>
					)}
				</div>
			</div>
		</div>
	);
}