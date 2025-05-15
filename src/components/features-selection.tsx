"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FeatureData {
	name: string;
	type?: string;
}

export default function FeatureSelectionComponent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const collectionName = searchParams?.get("collection");
	const filenameParam = searchParams?.get("file_name");
	const [featureData, setFeatureData] = useState<FeatureData[]>([]);
	const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
	const [target, setTarget] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [mode, setMode] = useState<"manual" | "auto">("manual");

	useEffect(() => {
		if (!collectionName) {
			router.push("/upload-dataset");
		} else {
			async function fetchFeatures() {
				try {
					const response = await fetch(
						`http://127.0.0.1:8000/get-features/${collectionName}`
					);
					const data = await response.json();
					if (!response.ok)
						throw new Error("Failed to fetch features");

					const parsedFeatures = data.features
						.filter((f: string) => f !== "uploaded_filename")
						.map((feature: string) => ({
							name: feature,
						}));

					setFeatureData(parsedFeatures);
					setSelectedFeatures(
						parsedFeatures.map((f: FeatureData) => f.name)
					);
					if (parsedFeatures.length > 0) {
						setTarget(parsedFeatures[0].name);
					}
				} catch (error) {
					console.error("Error fetching features:", error);
				} finally {
					setLoading(false);
				}
			}
			if (collectionName) fetchFeatures();
		}
	}, [collectionName]);

	const handleFeatureToggle = (featureName: string) => {
		setSelectedFeatures((prev) => {
			if (prev.includes(featureName)) {
				return prev.filter((f) => f !== featureName);
			}
			if (featureName === target) return prev;
			return [...prev, featureName];
		});
	};

	const handleContinue = async () => {
		if (!collectionName) return;

		const payload =
			mode === "manual"
				? {
						mode: "manual",
						selected_features: selectedFeatures,
						target_column: target,
				  }
				: {
						mode: "auto",
				  };

		try {
			const response = await fetch(
				`http://127.0.0.1:8000/selected-features/${collectionName}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				}
			);
			const data = await response.json();

			if (!response.ok) {
				alert("Error: " + data.error);
				return;
			}
			const processedCollection = data.processed_collection;
			router.push(
				`/training?collection=${processedCollection}&file_name=${filenameParam}`
			);
		} catch (error) {
			console.error("Error during preprocessing:", error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
				<div className="container mx-auto flex items-center justify-center py-20">
					<div className="text-center">
						<h2 className="text-xl font-semibold">
							Loading features...
						</h2>
						<p className="text-muted-foreground">
							Please wait while we analyze your dataset.
						</p>
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
						Feature Selection
					</h1>

					<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
						<CardHeader>
							<CardTitle>Preprocessing Mode</CardTitle>
							<CardDescription>
								Choose how you'd like to process your dataset
							</CardDescription>
						</CardHeader>

						<CardContent>
							<RadioGroup
								defaultValue="manual"
								onValueChange={(val) =>
									setMode(val as "manual" | "auto")
								}
								className="gap-6">
								<div>
									<RadioGroupItem value="manual" id="manual" />
									<Label htmlFor="manual" className="ml-2">
										Manual Feature & Target Selection
									</Label>
								</div>
								<div>
									<RadioGroupItem value="auto" id="auto" />
									<Label htmlFor="auto" className="ml-2">
										Automatic Feature & Target Detection
									</Label>
								</div>
							</RadioGroup>

							{mode === "manual" && (
								<div className="mt-8 space-y-6">
									{/* Feature checkboxes */}
									<div className="space-y-4">
										{featureData.map((feature, index) => (
											<div
												key={`${feature.name}-${index}`}
												className="flex items-center justify-between p-3 border rounded-lg">
												<div className="flex items-center gap-3">
													<Checkbox
														id={`manual-${feature.name}`}
														checked={
															selectedFeatures.includes(
																feature.name
															) &&
															feature.name !==
																target
														}
														onCheckedChange={() =>
															handleFeatureToggle(
																feature.name
															)
														}
														disabled={
															feature.name ===
															target
														}
													/>
													<Label
														htmlFor={`manual-${feature.name}`}
														className="font-medium">
														{feature.name}
													</Label>
												</div>
											</div>
										))}
									</div>

									{/* Selected count */}
									<div className="rounded-md bg-muted p-4 space-y-2">
										<h4 className="font-medium">
											Selected Features:{" "}
											{
												selectedFeatures.filter(
													(f) => f !== target
												).length
											}
											/{featureData.length - 1}
										</h4>
										<p className="text-sm text-muted-foreground">
											{selectedFeatures.length === 0
												? "Please select at least one feature to continue."
												: `You've selected: ${selectedFeatures
														.filter(
															(f) => f !== target
														)
														.join(", ")}`}
										</p>
									</div>

									{/* Target dropdown */}
									<div className="rounded-md bg-muted p-4">
										<Label
											htmlFor="target-select"
											className="font-medium">
											Select Target Column
										</Label>
										<Select
											onValueChange={(val) => {
												setTarget(val);
												setSelectedFeatures((prev) =>
													prev.filter(
														(f) => f !== val
													)
												);
											}}
											value={target || ""}>
											<SelectTrigger id="target-select">
												<SelectValue placeholder="Choose target column" />
											</SelectTrigger>
											<SelectContent>
												{featureData.map(
													(feature, index) => (
														<SelectItem
															key={`${feature.name}-${index}`}
															value={
																feature.name
															}>
															{feature.name}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div>
								</div>
							)}
						</CardContent>

						<CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
							<Button variant="outline" asChild>
								<Link
									href={`/upload-dataset?collection=${collectionName}`}>
									Back to Upload
								</Link>
							</Button>
							<Button
								onClick={handleContinue}
								disabled={
									mode === "manual" &&
									(!target || selectedFeatures.length === 0)
								}>
								Continue to Model Training{" "}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}
