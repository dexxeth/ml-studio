"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ModelResults {
	accuracy: number;
	r2: number;
	mae: number;
	rmse: number;
}

export const ModelResultsCard = ({ metrics }: { metrics: ModelResults }) => {
	return (
		<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
			<CardHeader>
				<CardTitle className="text-lg">Model Performance</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<p className="font-medium text-muted-foreground">
							Accuracy
						</p>
						<p className="text-lg font-bold">
							{metrics.accuracy?.toFixed(4)}
						</p>
					</div>
					<div>
						<p className="font-medium text-muted-foreground">
							R² Score
						</p>
						<p className="text-lg font-bold">
							{metrics.r2?.toFixed(4)}
						</p>
					</div>
					<div>
						<p className="font-medium text-muted-foreground">
							Mean Absolute Error
						</p>
						<p className="text-lg font-bold">
							{metrics.mae?.toFixed(4)}
						</p>
					</div>
					<div>
						<p className="font-medium text-muted-foreground">
							Root Mean Squared Error
						</p>
						<p className="text-lg font-bold">
							{metrics.rmse?.toFixed(4)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
