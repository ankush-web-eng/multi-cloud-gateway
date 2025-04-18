'use client';

import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArchitectureDiagram from "@/components/architecture-diagram";

export default function Hero() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                Unified Multi-Cloud Gateway
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                A powerful microservice architecture for seamless cloud integration with a single API endpoint for all your services.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Button size="lg" className="gap-1">
                                Get Started <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline">
                                View Documentation
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Containerized</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Kubernetes Ready</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Scalable</span>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto lg:mx-0 w-full max-w-[600px] rounded-lg border bg-background p-4 shadow-lg">
                        <ArchitectureDiagram />
                    </div>
                </div>
            </div>
        </section>
    )
}