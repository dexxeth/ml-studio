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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BarChart2, Check, Download, LineChart, Save } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";

interface Dataset {
	columns: string[];
	data: any[][];
}

interface ModelResults {
	accuracy: number;
	precision: number;
	recall: number;
	f1_score: number;
	confusion_matrix: number[][];
	feature_importance: {
		feature: string;
		importance: number;
	}[];
}

export default function TrainingPage() {
	const [isTraining, setIsTraining] = useState(false);
	const [progress, setProgress] = useState(0);
	const [modelType, setModelType] = useState("random_forest");
	const [trainingComplete, setTrainingComplete] = useState(false);
	const [testSize, setTestSize] = useState(20);
	const [crossValidation, setCrossValidation] = useState(true);
	const [dataset, setDataset] = useState<Dataset | null>(null);
	const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
	const [modelResults, setModelResults] = useState<ModelResults | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Load dataset and selected features from localStorage
		const storedDataset = localStorage.getItem("dataset");
		const storedFeatures = localStorage.getItem("selectedFeatures");

		if (!storedDataset || !storedFeatures) {
			router.push("/upload");
			return;
		}

		try {
			const parsedDataset = JSON.parse(storedDataset) as Dataset;
			const parsedFeatures = JSON.parse(storedFeatures) as string[];

			setDataset(parsedDataset);
			setSelectedFeatures(parsedFeatures);
		} catch (error) {
			console.error("Error parsing data:", error);
			router.push("/upload");
		}

		setLoading(false);
	}, [router]);

	const handleStartTraining = () => {
		setIsTraining(true);
		setProgress(0);
		setTrainingComplete(false);

		// Simulate training progress
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					setIsTraining(false);
					setTrainingComplete(true);

					// Generate mock results
					generateMockResults();

					return 100;
				}
				return prev + 5;
			});
		}, 300);
	};

	const generateMockResults = () => {
		if (!dataset || !selectedFeatures) return;

		// Generate mock confusion matrix
		const numClasses = 3; // For demo purposes
		const confusionMatrix = Array(numClasses)
			.fill(0)
			.map(() =>
				Array(numClasses)
					.fill(0)
					.map(() => Math.floor(Math.random() * 10) + 5)
			);

		// Make diagonal values higher for better accuracy
		for (let i = 0; i < numClasses; i++) {
			confusionMatrix[i][i] = Math.floor(Math.random() * 10) + 15;
		}

		// Generate feature importance
		const featureImportance = selectedFeatures.map((feature) => ({
			feature,
			importance: Math.random(),
		}));

		// Normalize feature importance to sum to 1
		const totalImportance = featureImportance.reduce(
			(sum, f) => sum + f.importance,
			0
		);
		featureImportance.forEach(
			(f) => (f.importance = f.importance / totalImportance)
		);

		// Sort by importance
		featureImportance.sort((a, b) => b.importance - a.importance);

		// Generate metrics
		const results: ModelResults = {
			accuracy: 0.85 + Math.random() * 0.1,
			precision: 0.83 + Math.random() * 0.1,
			recall: 0.82 + Math.random() * 0.1,
			f1_score: 0.84 + Math.random() * 0.1,
			confusion_matrix: confusionMatrix,
			feature_importance: featureImportance,
		};

		setModelResults(results);

		// Store results in localStorage
		localStorage.setItem("modelResults", JSON.stringify(results));
		localStorage.setItem("modelType", modelType);
	};

	const handleDownloadResults = () => {
		if (!modelResults) return;

		// Create a JSON object with all the results
		const resultsData = {
			model_type: modelType,
			test_size: testSize,
			cross_validation: crossValidation,
			selected_features: selectedFeatures,
			metrics: {
				accuracy: modelResults.accuracy,
				precision: modelResults.precision,
				recall: modelResults.recall,
				f1_score: modelResults.f1_score,
			},
			confusion_matrix: modelResults.confusion_matrix,
			feature_importance: modelResults.feature_importance,
		};

		// Convert to JSON string
		const jsonString = JSON.stringify(resultsData, null, 2);

		// Create a blob and download link
		const blob = new Blob([jsonString], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = `ml-studio-results-${new Date()
			.toISOString()
			.slice(0, 10)}.json`;
		document.body.appendChild(a);
		a.click();

		// Clean up
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	if (loading || !dataset) {
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
									disabled={isTraining}>
									<SelectTrigger>
										<SelectValue placeholder="Select model type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="random_forest">
											Random Forest
										</SelectItem>
										<SelectItem value="logistic_regression">
											Logistic Regression
										</SelectItem>
										<SelectItem value="svm">
											Support Vector Machine
										</SelectItem>
										<SelectItem value="gradient_boosting">
											Gradient Boosting
										</SelectItem>
										<SelectItem value="neural_network">
											Neural Network
										</SelectItem>
									</SelectContent>
								</Select>
							</CardContent>
						</Card>

						<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">
									Test Split
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between">
										<Label>Test Size: {testSize}%</Label>
										<span className="text-sm text-muted-foreground">
											Train: {100 - testSize}%
										</span>
									</div>
									<Slider
										value={[testSize]}
										min={10}
										max={40}
										step={5}
										onValueChange={([value]) =>
											setTestSize(value)
										}
										disabled={isTraining}
									/>
								</div>
							</CardContent>
						</Card>

						<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">
									Validation
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between space-y-0">
									<Label htmlFor="cross-validation">
										Cross Validation
									</Label>
									<Switch
										id="cross-validation"
										checked={crossValidation}
										onCheckedChange={setCrossValidation}
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
								{isTraining
									? "Training in progress..."
									: trainingComplete
									? "Training complete! View results below."
									: "Configure your model settings and start training"}
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
										<Progress
											value={progress}
											className="h-2"
										/>
									</div>

									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<Check
												className={`h-4 w-4 ${
													progress >= 25
														? "text-primary"
														: "text-muted-foreground"
												}`}
											/>
											<span
												className={
													progress >= 25
														? ""
														: "text-muted-foreground"
												}>
												Data preprocessing
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Check
												className={`h-4 w-4 ${
													progress >= 50
														? "text-primary"
														: "text-muted-foreground"
												}`}
											/>
											<span
												className={
													progress >= 50
														? ""
														: "text-muted-foreground"
												}>
												Model initialization
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Check
												className={`h-4 w-4 ${
													progress >= 75
														? "text-primary"
														: "text-muted-foreground"
												}`}
											/>
											<span
												className={
													progress >= 75
														? ""
														: "text-muted-foreground"
												}>
												Training model
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Check
												className={`h-4 w-4 ${
													progress >= 100
														? "text-primary"
														: "text-muted-foreground"
												}`}
											/>
											<span
												className={
													progress >= 100
														? ""
														: "text-muted-foreground"
												}>
												Evaluating performance
											</span>
										</div>
									</div>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-6 space-y-4">
									<div className="text-center">
										<p className="text-muted-foreground mb-4">
											Ready to train your{" "}
											{modelType.replace("_", " ")} model
											with {100 - testSize}% training data
											{crossValidation
												? " and cross-validation"
												: ""}
										</p>
										<Button onClick={handleStartTraining}>
											Start Training
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{trainingComplete && modelResults && (
						<Tabs defaultValue="metrics" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="metrics">
									Metrics
								</TabsTrigger>
								<TabsTrigger value="confusion">
									Confusion Matrix
								</TabsTrigger>
								<TabsTrigger value="importance">
									Feature Importance
								</TabsTrigger>
							</TabsList>

							<TabsContent value="metrics">
								<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<BarChart2 className="h-5 w-5" />
											Model Performance Metrics
										</CardTitle>
										<CardDescription>
											Evaluation metrics for the trained{" "}
											{modelType.replace("_", " ")} model
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											{[
												{
													name: "Accuracy",
													value: modelResults.accuracy,
												},
												{
													name: "Precision",
													value: modelResults.precision,
												},
												{
													name: "Recall",
													value: modelResults.recall,
												},
												{
													name: "F1 Score",
													value: modelResults.f1_score,
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
															{(
																metric.value *
																100
															).toFixed(1)}
															%
														</div>
														<Progress
															value={
																metric.value *
																100
															}
															className="h-2 mt-2"
														/>
													</CardContent>
												</Card>
											))}
										</div>

										<Alert className="mt-6">
											<Check className="h-4 w-4" />
											<AlertTitle>
												Great performance!
											</AlertTitle>
											<AlertDescription>
												Your model has achieved
												excellent results. It's ready
												for deployment.
											</AlertDescription>
										</Alert>
									</CardContent>
									<CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
										<Button
											variant="outline"
											onClick={handleDownloadResults}>
											<Download className="mr-2 h-4 w-4" />
											Download Results
										</Button>
										<Button asChild>
											<Link href="/models">
												<Save className="mr-2 h-4 w-4" />
												Save Model
											</Link>
										</Button>
									</CardFooter>
								</Card>
							</TabsContent>

							<TabsContent value="confusion">
								<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
									<CardHeader>
										<CardTitle>Confusion Matrix</CardTitle>
										<CardDescription>
											Visualizes the performance of the
											classification model
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex justify-center py-4 overflow-auto">
											<div className="grid grid-cols-4 gap-1">
												<div
													key="header-row"
													className="flex items-center justify-center p-2 font-medium">
													Actual ↓ Predicted →
												</div>
												<div
													key="header-col1"
													className="flex items-center justify-center p-2 font-medium">
													Class 1
												</div>
												<div
													key="header-col2"
													className="flex items-center justify-center p-2 font-medium">
													Class 2
												</div>
												<div
													key="header-col3"
													className="flex items-center justify-center p-2 font-medium">
													Class 3
												</div>

												{modelResults.confusion_matrix.map(
													(row, i) => (
														<>
															<div
																key={`row-${i}-label`}
																className="flex items-center justify-center p-2 font-medium">
																Class {i + 1}
															</div>
															{row.map(
																(cell, j) => (
																	<div
																		key={`${i}-${j}`}
																		className={`flex items-center justify-center p-2 rounded-md font-bold ${
																			i ===
																			j
																				? "bg-green-500/20 dark:bg-green-900/20"
																				: "bg-red-500/10 dark:bg-red-900/10"
																		}`}>
																		{cell}
																	</div>
																)
															)}
														</>
													)
												)}
											</div>
										</div>
									</CardContent>
									<CardFooter className="flex justify-end border-t pt-6">
										<Button
											variant="outline"
											onClick={handleDownloadResults}>
											<Download className="mr-2 h-4 w-4" />
											Download Results
										</Button>
									</CardFooter>
								</Card>
							</TabsContent>

							<TabsContent value="importance">
								<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<LineChart className="h-5 w-5" />
											Feature Importance
										</CardTitle>
										<CardDescription>
											Relative importance of each feature
											in the model
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{modelResults.feature_importance.map(
												(feature, i) => (
													<div
														key={i}
														className="space-y-1">
														<div className="flex justify-between items-center">
															<span className="font-medium">
																{
																	feature.feature
																}
															</span>
															<span>
																{(
																	feature.importance *
																	100
																).toFixed(1)}
																%
															</span>
														</div>
														<Progress
															value={
																feature.importance *
																100
															}
															className="h-2"
														/>
													</div>
												)
											)}
										</div>
									</CardContent>
									<CardFooter className="flex justify-end border-t pt-6">
										<Button
											variant="outline"
											onClick={handleDownloadResults}>
											<Download className="mr-2 h-4 w-4" />
											Download Results
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
