"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { AutoModelCard } from "@/components/training/auto-model-card";
import { ModelTypeCard } from "@/components/training/model-type-card";
import { ProgressTracker } from "@/components/training/model-progress";
import { ModelResultsCard } from "@/components/training/model-results-card";
import { DownloadModelButton } from "@/components/download-model-button";
import { Card } from "../ui/card";

interface ModelResults {
	accuracy: number;
	r2: number;
	mae: number;
	rmse: number;
	f1_score: number;
	precision: number;
	recall: number;
}

export default function TrainingPageComponent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const collectionName = searchParams?.get("collection");
	const filenameParam = searchParams?.get("file_name");
	const [modelType, setModelType] = useState("");
	const [autoModelSelection, setAutoModelSelection] = useState(
		Boolean(searchParams?.get("auto_model_selection"))
	);

	const [progress, setProgress] = useState(0);
	const [loading, setLoading] = useState(true);
	const [isTraining, setIsTraining] = useState(false);
	const [trainingComplete, setTrainingComplete] = useState(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const [modelResults, setModelResults] = useState<ModelResults | null>(null);

	useEffect(() => {
		if (!collectionName) {
			router.push("/upload-dataset");
			return;
		}
		setLoading(false);
		setDownloadUrl(null);
	}, [collectionName]);

	const handleStartTraining = async () => {
		setIsTraining(true);
		setTrainingComplete(false);
		setProgress(0);

		const interval = setInterval(() => {
			setProgress((prev) => (prev < 65 ? prev + 35 : prev));
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

	if (loading || !collectionName) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
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
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<div className="container my-4 mx-auto px-4 max-w-4xl">
				<h1 className="text-3xl font-bold tracking-tight mb-6">
					Model Training
				</h1>

				{/* Selection Cards */}
				<Card className="px-6">
					<div className="grid gap-6 md:grid-cols-3 mb-6">
						<ModelTypeCard
							modelType={modelType}
							setModelType={setModelType}
							autoModelSelection={autoModelSelection}
							isTraining={isTraining}
						/>
						<AutoModelCard
							autoModelSelection={autoModelSelection}
							setAutoModelSelection={setAutoModelSelection}
							isTraining={isTraining}
						/>
					</div>

					{/* Training Progress */}
					<ProgressTracker
						progress={progress}
						isTraining={isTraining}
						trainingComplete={trainingComplete}
						onStartTraining={handleStartTraining}
					/>

					{/* Results */}
					{trainingComplete && modelResults && (
						<div className="space-y-4">
							<ModelResultsCard metrics={modelResults} />
							{downloadUrl && (
								<DownloadModelButton
									file_id={downloadUrl.split("/").pop() || ""}
									modelType={modelType}
									filenameParam={filenameParam}
								/>
							)}
						</div>
					)}
				</Card>
			</div>
		</div>
	);
}
