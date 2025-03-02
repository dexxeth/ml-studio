"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Check, ChevronRight, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Navbar } from "@/components/navbar"

interface Dataset {
  columns: string[]
  data: any[][]
}

interface FeatureData {
  name: string
  importance: number
  correlation: number
  type: string
}

export default function FeaturesPage() {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [featureData, setFeatureData] = useState<FeatureData[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load dataset from localStorage
    const storedDataset = localStorage.getItem("dataset")

    if (!storedDataset) {
      router.push("/upload")
      return
    }

    try {
      const parsedDataset = JSON.parse(storedDataset) as Dataset
      setDataset(parsedDataset)

      // Generate feature data based on the dataset
      const features = parsedDataset.columns.map((column, colIndex) => {
        // Check if column is numerical by examining the first few values
        const sampleValues = parsedDataset.data.slice(0, 10).map((row) => row[colIndex])
        const isNumerical = sampleValues.every((val) => !isNaN(Number(val)))

        // Generate random importance and correlation for demo purposes
        // In a real app, you would calculate these values
        const importance = Math.random() * 0.5 + 0.5 // Between 0.5 and 1.0
        const correlation = Math.random() * 0.5 + 0.3 // Between 0.3 and 0.8

        return {
          name: column,
          importance,
          correlation,
          type: isNumerical ? "numeric" : "categorical",
        }
      })

      setFeatureData(features)
      setSelectedFeatures(parsedDataset.columns)
    } catch (error) {
      console.error("Error parsing dataset:", error)
      router.push("/upload")
    }

    setLoading(false)
  }, [router])

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
  }

  const handleContinue = () => {
    // Store selected features in localStorage
    localStorage.setItem("selectedFeatures", JSON.stringify(selectedFeatures))
    router.push("/training")
  }

  if (loading || !dataset) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-10 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-medium">Loading features...</h2>
              <p className="text-muted-foreground">Please wait while we analyze your data</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Feature Selection</h1>

          <Tabs defaultValue="automatic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="automatic">Automatic Selection</TabsTrigger>
              <TabsTrigger value="manual">Manual Selection</TabsTrigger>
            </TabsList>

            <TabsContent value="automatic">
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Automatic Feature Selection</CardTitle>
                  <CardDescription>
                    Our system analyzes your dataset and recommends the most important features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Feature Importance</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Info className="h-4 w-4" />
                                <span className="sr-only">Feature importance info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Feature importance indicates how useful each feature is for prediction. Higher values
                                mean more important features.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {featureData
                        .sort((a, b) => b.importance - a.importance)
                        .map((feature, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`auto-${feature.name}`}
                                  checked={selectedFeatures.includes(feature.name)}
                                  onCheckedChange={() => handleFeatureToggle(feature.name)}
                                />
                                <Label htmlFor={`auto-${feature.name}`} className="font-medium">
                                  {feature.name}
                                </Label>
                                <span className="text-xs text-muted-foreground">({feature.type})</span>
                              </div>
                              <span className="text-sm font-medium">{(feature.importance * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={feature.importance * 100} className="h-2" />
                          </div>
                        ))}
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Recommendation</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Based on our analysis, we recommend using all features with importance above 70%. This will
                            provide the best balance between model complexity and performance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/dataset">Back to Dataset</Link>
                  </Button>
                  <Button onClick={handleContinue}>
                    Continue to Model Training <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="manual">
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Manual Feature Selection</CardTitle>
                  <CardDescription>Select which features you want to include in your model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {featureData.map((feature, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={`manual-${feature.name}`}
                              checked={selectedFeatures.includes(feature.name)}
                              onCheckedChange={() => handleFeatureToggle(feature.name)}
                            />
                            <div>
                              <Label htmlFor={`manual-${feature.name}`} className="font-medium">
                                {feature.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">Type: {feature.type}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            Details <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <h4 className="font-medium">
                        Selected Features: {selectedFeatures.length}/{featureData.length}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedFeatures.length === 0
                          ? "Please select at least one feature to continue."
                          : `You've selected: ${selectedFeatures.join(", ")}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-6 gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/dataset">Back to Dataset</Link>
                  </Button>
                  <Button onClick={handleContinue} disabled={selectedFeatures.length === 0}>
                    Continue to Model Training <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

