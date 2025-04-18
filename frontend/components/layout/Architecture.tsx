'use client';

import { Bell, CreditCard, Database, Layers, Lock, Server } from "lucide-react";

export default function Architecture() {
    return (
        <section id="architecture" className="py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Microservice Architecture
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Our containerized Kubernetes architecture ensures scalability, resilience, and easy deployment.
                        </p>
                    </div>
                </div>
                <div className="mx-auto max-w-4xl mt-12">
                    <div className="rounded-lg border bg-background p-6 shadow-lg">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Key Components</h3>
                                <ul className="grid gap-4 md:grid-cols-2">
                                    <li className="flex items-start gap-2">
                                        <div className="rounded-full bg-primary/10 p-1">
                                            <Server className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">API Gateway (Golang)</p>
                                            <p className="text-sm text-muted-foreground">Single entry point for all client requests</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="rounded-full bg-primary/10 p-1">
                                            <Layers className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Kafka Message Queue</p>
                                            <p className="text-sm text-muted-foreground">Asynchronous communication between services</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="rounded-full bg-primary/10 p-1">
                                            <Lock className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Authentication (Node.js)</p>
                                            <p className="text-sm text-muted-foreground">User authentication and authorization</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="rounded-full bg-primary/10 p-1">
                                            <CreditCard className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Payment Service (Node.js)</p>
                                            <p className="text-sm text-muted-foreground">PhonePe integration for payments</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="rounded-full bg-primary/10 p-1">
                                            <Bell className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Notification Service (Python)</p>
                                            <p className="text-sm text-muted-foreground">Multi-channel notification delivery</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="rounded-full bg-primary/10 p-1">
                                            <Database className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">Databases</p>
                                            <p className="text-sm text-muted-foreground">MySQL for relational, MongoDB for document data</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Deployment</h3>
                                <p className="text-muted-foreground">
                                    All services are containerized using Docker and orchestrated with Kubernetes for seamless scaling and high availability.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="rounded-full bg-muted px-3 py-1 text-sm">Docker</div>
                                    <div className="rounded-full bg-muted px-3 py-1 text-sm">Kubernetes</div>
                                    <div className="rounded-full bg-muted px-3 py-1 text-sm">Helm Charts</div>
                                    <div className="rounded-full bg-muted px-3 py-1 text-sm">CI/CD</div>
                                    <div className="rounded-full bg-muted px-3 py-1 text-sm">Auto-scaling</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}