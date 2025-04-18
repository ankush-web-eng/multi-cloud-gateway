'use client';

import { Bell, Code, CreditCard, Database, Lock, Server } from "lucide-react";
import { ServiceCard } from "../cards/service-card";

export default function Features() {
    return (
        <section id="features" className="py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Comprehensive Microservices
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Our gateway provides a unified interface to a robust set of microservices, all accessible through a single API endpoint.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
                    <ServiceCard
                        icon={<Lock />}
                        title="Authentication Service"
                        description="Secure Node.js authentication service with JWT support and role-based access control."
                        tech="Node.js"
                    />
                    <ServiceCard
                        icon={<CreditCard />}
                        title="Payment Service"
                        description="Integrated payment processing with PhonePe gateway for seamless transactions."
                        tech="Node.js"
                    />
                    <ServiceCard
                        icon={<Bell />}
                        title="Notification Service"
                        description="Real-time notifications via email, SMS, and push with customizable templates."
                        tech="Python"
                    />
                    <ServiceCard
                        icon={<Server />}
                        title="Main Gateway Server"
                        description="High-performance request routing and load balancing for all microservices."
                        tech="Golang"
                    />
                    <ServiceCard
                        icon={<Database />}
                        title="Database Services"
                        description="Dual database support with MySQL for relational and MongoDB for document storage."
                        tech="MySQL & MongoDB"
                    />
                    <ServiceCard
                        icon={<Code />}
                        title="Frontend Application"
                        description="Modern, responsive user interface built with Next.js for optimal performance."
                        tech="Next.js"
                    />
                </div>
            </div>
        </section>
    )
}