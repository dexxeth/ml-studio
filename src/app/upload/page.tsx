"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileJson } from "lucide-react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if file is JSON
    if (!selectedFile.name.endsWith(".json")) {
      setError("Please upload a JSON file")
      setFile(null)
      return
    }

    setFile(selectedFile)
    setError(null)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      // Read the file content
      const fileContent = await file.text()

      // Try to parse JSON to validate it
      JSON.parse(fileContent)

      // Store the file content in localStorage for demo purposes
      // In a real app, you would send this to your server
      localStorage.setItem("dataset", fileContent)
      localStorage.setItem("datasetName", file.name)

      // Navigate to dataset page
      setTimeout(() => {
        setUploading(false)
        router.push("/dataset")
      }, 1000)
    } catch (err) {
      setError("Invalid JSON file. Please check the file format.")
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Upload Dataset</h1>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upload your dataset</CardTitle>
              <CardDescription>Upload a JSON file containing your data</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload}>
                <div className="grid w-full items-center gap-6">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="file">Dataset File (JSON)</Label>
                    <div className="flex flex-col items-center gap-3">
                      <div className="border border-dashed border-border rounded-lg p-8 w-full text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <Input id="file" type="file" accept=".json" className="hidden" onChange={handleFileChange} />
                        <Label htmlFor="file" className="cursor-pointer flex flex-col items-center gap-2">
                          {file ? (
                            <FileJson className="h-10 w-10 text-primary" />
                          ) : (
                            <Upload className="h-10 w-10 text-muted-foreground" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {file ? file.name : "Click to upload or drag and drop a JSON file"}
                          </span>
                        </Label>
                      </div>

                      {error && <div className="text-sm text-destructive mt-2">{error}</div>}

                      <div className="text-sm text-muted-foreground mt-2">
                        <p>Your JSON file should have the following structure:</p>
                        <pre className="bg-muted p-2 rounded-md mt-2 overflow-x-auto text-xs">
                          {`{
  "columns": ["feature1", "feature2", "target"],
  "data": [
    [value1, value2, target1],
    [value3, value4, target2],
    ...
  ]
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={!file || uploading}>
                    {uploading ? "Uploading..." : "Upload and Continue"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

