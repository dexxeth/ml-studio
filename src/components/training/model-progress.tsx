"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
	progress: number;
	isTraining: boolean;
	trainingComplete: boolean;
	onStartTraining: () => void;
}

export const ProgressTracker = ({ progress, isTraining, trainingComplete, onStartTraining }: Props) => {
	const steps = [
		{ label: "Data preprocessing", threshold: 25 },
		{ label: "Model initialization", threshold: 50 },
		{ label: "Training model", threshold: 75 },
		{ label: "Evaluating performance", threshold: 100 },
	];

	return (
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
							<Progress value={progress} className="h-2" />
						</div>
						<div className="space-y-1">
							{steps.map((step, idx) => {
								const isDone = progress >= step.threshold;
								const isCurrent = progress < step.threshold && (idx === 0 || progress >= step.threshold - 25);
								return (
									<div key={step.label} className="flex items-center gap-2">
										{isDone ? (
											<Check className="h-4 w-4 text-primary" />
										) : isCurrent ? (
											<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
										) : (
											<Check className="h-4 w-4 text-muted-foreground" />
										)}
										<span className={isDone ? "" : "text-muted-foreground"}>{step.label}</span>
									</div>
								);
							})}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-6 space-y-4">
						<p className="text-muted-foreground mb-4">Ready to train your model? Click below.</p>
						<Button onClick={onStartTraining} disabled={isTraining}>
							Start Training
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
