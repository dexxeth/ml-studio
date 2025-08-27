"use client";

import AppFeatures from "@/components/app-features";
import { ArrowRight, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import DevelopersShowcaseCard from "@/components/developer-showcase";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function HomePageComponent() {
	const router = useRouter();
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4 py-10">
			<div className="text-center m-auto max-w-5xl">
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
					single line of code.
					<br />
					Upload your data, select features, and
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
				<div className="mb-8">
					<AppFeatures />
				</div>
			</div>
				<div className="max-w-4xl">
					<DevelopersShowcaseCard />
				</div>
			<Separator className="my-8 mb-16"/>


			<footer className="text-gray-400 text-sm py-6 px-4 md:px-8">
				<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-between text-center md:text-left">
					{/* Left: Branding */}
					<div>
						<h4 className="text-white font-semibold text-lg">
							ML Studio
						</h4>
						<p>Train and deploy ML models with ease.</p>
					</div>

					{/* Center: Navigation */}
					<div className="space-y-1">
						<a href="/" className="hover:text-white">
							Home
						</a>
						<br />
						<a href="/about" className="hover:text-white">
							About
						</a>
						<br />
						<a href="/docs" className="hover:text-white">
							Docs
						</a>
						<br />
						<a href="/contact" className="hover:text-white">
							Contact
						</a>
					</div>

					{/* Right: Social or Legal */}
					<div className="space-y-1">
						<Link
							href="https://github.com/dexxeth/ml-studio"
							target="_blank"
							className="hover:text-white">
							GitHub
						</Link>
						<br />
						<Link
							href="https://linkedin.com"
							target="_blank"
							className="hover:text-white">
							LinkedIn
						</Link>
						<br />
						<p>
							&copy; {new Date().getFullYear()} ML Studio. All
							rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
