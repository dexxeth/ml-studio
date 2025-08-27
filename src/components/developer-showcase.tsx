"use client"

import Image from "next/image"
import { Github, Linkedin } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function DeveloperShowcase() {
  const developers = [
    {
      name: "Ansh Gahoi",
      role: "Frontend and Backend Developer",
      contributions: "Full-stack development, API integration, and database architecture",
      image: "/ansh.jpg?height=400&width=400",
      github: "https://github.com/dexxeth",
      linkedin: "https://www.linkedin.com/in/ansh-gahoi/",
    },
    {
      name: "Ayush Mittal",
      role: "ML Engineer and Frontend Developer",
      contributions: "Machine learning models, data visualization, and UI implementation",
      image: "/ayush.jpg?height=400&width=400",
      github: "https://github.com/ayushmittal62",
      linkedin: "https://www.linkedin.com/in/ayush-mittal629/",
    },
    {
      name: "Yomit Khurana",
      role: "ML Engineer and Backend Developer",
      contributions: "Algorithm development, model training, and data preprocessing",
      image: "/yomit.jpg?height=400&width=400",
      github: "https://github.com/yomit15",
      linkedin: "https://www.linkedin.com/in/yomit-khurana-10a253252/",
    },
  ]

  return (
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-gray-800 px-3 py-1 text-sm text-violet-500 mb-2">Our Team</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Meet the Developers
          </h2>
          <p className="max-w-[700px] text-gray-400 md:text-xl">
            The brilliant minds behind ML Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((developer, index) => (
            <Card key={index} className="p-0 overflow-hidden h-full w-full transition duration-300 shadow-lg hover:shadow-2xl hover:shadow-violet-500">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={developer.image}
                  alt={developer.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/5 to-transparent opacity-100" />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/0 to-transparent opacity-40" /> */}
              </div>

              <CardHeader className="relative">
                <h3 className="text-2xl font-bold text-white mb-1">{developer.name}</h3>
                <p className="text-violet-500 font-medium">{developer.role}</p>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="h-px w-full bg-gradient-to-r from-purple-400 to-pink-600 mb-4" />
                <p className="text-gray-300">{developer.contributions}</p>
              </CardContent>

              <CardFooter className="flex space-x-4 justify-center items-center p-4">
                <a href={developer.linkedin} className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a href={developer.github} className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
  )
}
