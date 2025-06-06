"use client";

import Features from "@/components/app-features";
import { ArrowRight, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePageComponent() {
	const router = useRouter();
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
					<Button
						onClick={() => router.push("/upload-dataset")}
						size="lg"
						className="gap-2 px-8 py-6 text-lg cursor-pointer bg-violet-500 text-white hover:text-black">
						Get Started
						<ArrowRight className="h-5 w-5 font-bold" />
					</Button>
				</div>

				<h2 className="m-4 mt-16 text-xl font-extrabold sm:text-2xl md:text-3xl">
					Features
				</h2>
				<div>
					<Features />
				</div>
			</div>
		</div>
	);
}
