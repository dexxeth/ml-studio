"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { DatasetStatisticsCard } from "@/components/dataset-preview/data-statistics-card";
import { DatasetPreviewCard } from "@/components/dataset-preview/dataset-preview-card";
import { Card } from "@/components/ui/card";

interface Dataset {
	columns: string[];
	data: any[][];
}

export default function PreviewDataset() {
	const [dataset, setDataset] = useState<Dataset | null>(null);
	const [loading, setLoading] = useState(true);
	const [fileName, setFileName] = useState<string>("");
	const searchParams = useSearchParams();
	const collection = searchParams?.get("collection");
	const filenameParam = searchParams?.get("file_name");
	const router = useRouter();

	useEffect(() => {
		if (!collection) {
			router.push("/upload-dataset");
			return;
		}

		if (filenameParam) {
			setFileName(filenameParam);
		}

		const fetchDataset = async (collectionName: string) => {
			try {
				setLoading(true);
				const response = await fetch(
					`http://127.0.0.1:8000/dataset/${collectionName}`
				);
				if (!response.ok) {
					const errorText = await response.text();
					console.error("Error response:", errorText);
					return;
				}
				const result = await response.json();
				console.log("Fetched data:", result);
				console.log("File name:", filenameParam);
				console.log("Collection name:", collectionName);

				if (!Array.isArray(result?.dataset)) {
					console.error("Invalid dataset structure:", result);
					return;
				}

				const columns = Object.keys(result.dataset[0]);
				const data = result.dataset.map((row: Record<string, any>) =>
					columns.map((col) => {
						const value = row[col];
						return typeof value === "number" ||
							!isNaN(Number(value))
							? Number(value)
							: String(value ?? "-");
					})
				);

				setDataset({ columns, data });
				setFileName(filenameParam || "Dataset Preview");
			} catch (error) {
				console.error("Error fetching dataset:", error);
			} finally {
				setLoading(false);
			}
		};

		if (collection) {
			fetchDataset(collection as string);
		}
	}, [collection, filenameParam]);

	if (loading || !dataset) {
		return (
			<div className="min-h-screen bg-background">
				<Navbar />
				<div className="container mx-auto py-10 px-4">
					<div className="flex justify-center items-center h-64">
						<div className="text-center">
							<h2 className="text-xl font-medium">
								Loading dataset...
							</h2>
							<p className="text-muted-foreground">
								Please wait while we prepare your data
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
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								{fileName}
							</h1>
							<p className="text-muted-foreground">
								{dataset.data.length} rows,{" "}
								{dataset.columns.length} columns
							</p>
						</div>

						<Button asChild>
							<Link
								href={`/features-selection?collection=${collection}&file_name=${fileName}`}>
								Continue to Feature Selection{" "}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					<div>
						<DatasetPreviewCard
							dataset={dataset}
							fileName={fileName}
							collection={collection!}
						/>
					</div>

					<div>
						<DatasetStatisticsCard
							columns={dataset.columns}
							data={dataset.data}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
