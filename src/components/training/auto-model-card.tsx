"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
	autoModelSelection: boolean;
	setAutoModelSelection: (value: boolean) => void;
	isTraining: boolean;
}

export const AutoModelCard = ({
	autoModelSelection,
	setAutoModelSelection,
	isTraining,
}: Props) => {
	return (
		<Card className="border-border/40 bg-card/50 backdrop-blur-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-lg">Auto Model Selection</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<Label htmlFor="auto-model-selection">Enable Auto Selection</Label>
					<Switch
						id="auto-model-selection"
						checked={autoModelSelection}
						onCheckedChange={setAutoModelSelection}
						disabled={isTraining}
					/>
				</div>
			</CardContent>
		</Card>
	);
};
