"use client";

import { usePathname } from "next/navigation";
import { BrainCircuit, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const routes = [
	{ href: "/upload-dataset", label: "Upload Dataset" },
	{ href: "/preview-dataset", label: "Preview Dataset" },
	{ href: "/features-selection", label: "Feature Selection" },
	{ href: "/training", label: "Model Training" },
];

export function Navbar() {
	const pathname = usePathname();

	return (
		<div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-16 items-center px-4 container mx-auto">
				<nav className="hidden md:flex items-center space-x-6 ml-10">
					<Link href="/">
						<div className="flex items-center gap-2">
							<BrainCircuit className="h-6 w-6" />
							<span className="font-bold text-xl">ML Studio</span>
						</div>
					</Link>

					{routes.map((route) => (
						<span
							key={route.href}
							className={cn(
								"text-sm font-medium transition-colors",
								pathname.startsWith(route.href)
									? "text-foreground font-semibold"
									: "text-muted-foreground"
							)}>
							{route.label}
						</span>
					))}
				</nav>

				<div className="flex items-center ml-auto space-x-4 text-xs md:hidden">
					<Link href="/">
						<div className="flex items-center gap-2">
							<BrainCircuit className="h-5 w-5" />
							<span className="font-bold">ML Studio</span>
						</div>
					</Link>
					<nav className="flex font-medium text-muted-foreground ml-4">
						{routes.map((route) => (
							<span
								key={route.href}
								className={cn(
									"font-medium transition-colors",
									pathname.startsWith(route.href)
										? "text-foreground font-semibold"
										: "text-muted-foreground"
								)}>
								{route.label}
							</span>
						))}
					</nav>
				</div>
			</div>
		</div>
	);
}
