import Features from "@/components/features";
import GetStartedButton from "@/components/get-started-button";
import { BrainCircuit } from "lucide-react";

export default function HomePage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4 py-10">
			<div className="max-w-3xl text-center">
				<div className="mb-8 flex justify-center">
					<div className="rounded-full bg-primary/10 p-4">
						<BrainCircuit className="h-12 w-12 text-primary" />
					</div>
				</div>
				<h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
					ML Studio
				</h1>
				<p className="mb-8 text-xl text-muted-foreground md:text-2xl">
					Train powerful machine learning models without writing a
					single line of code. Upload your data, select features, and
					get accurate predictions in minutes.
				</p>
				<div>
					<GetStartedButton />
				</div>

				<h2 className="m-4 mt-16 text-xl font-extrabold sm:text-2xl md:text-3xl">
					Features
				</h2>
				<div>
					<Features/>
				</div>
			</div>
		</div>
	);
}