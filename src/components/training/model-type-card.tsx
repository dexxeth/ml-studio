"use client";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/components/ui/card";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

interface Props {
	modelType: string;
	setModelType: (value: string) => void;
	autoModelSelection: boolean;
	isTraining: boolean;
}

export const ModelTypeCard = ({
	modelType,
	setModelType,
	autoModelSelection,
	isTraining,
}: Props) => {
	return (
		<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-lg">Model Type</CardTitle>
			</CardHeader>
			<CardContent>
				<Select
					value={modelType}
					onValueChange={setModelType}
					disabled={isTraining || autoModelSelection}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select model type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="random_forest">Random Forest</SelectItem>
						<SelectItem value="linear_regression">Linear Regression</SelectItem>
						<SelectItem value="svm">Support Vector Machine</SelectItem>
						<SelectItem value="k_means">K Means</SelectItem>
					</SelectContent>
				</Select>
			</CardContent>
		</Card>
	);
};
