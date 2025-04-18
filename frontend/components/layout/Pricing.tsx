'use client';

import { PricingCard } from "../cards/pricing-card";

export default function Pricing() {
    return (
        <section id="pricing" className="py-16 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Flexible Pricing Plans
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Choose the plan that fits your business needs and scale as you grow.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
                    <PricingCard
                        title="Starter"
                        price="$99"
                        description="Perfect for small businesses and startups"
                        features={[
                            "Up to 5 microservices",
                            "1,000 API calls per day",
                            "Basic authentication",
                            "Email support",
                            "Community access"
                        ]}
                        buttonText="Get Started"
                        popular={false}
                    />
                    <PricingCard
                        title="Professional"
                        price="$299"
                        description="Ideal for growing businesses with moderate traffic"
                        features={[
                            "Up to 15 microservices",
                            "10,000 API calls per day",
                            "Advanced authentication",
                            "Payment processing",
                            "Priority email support",
                            "Developer documentation"
                        ]}
                        buttonText="Get Started"
                        popular={true}
                    />
                    <PricingCard
                        title="Enterprise"
                        price="Custom"
                        description="For large organizations with high-volume requirements"
                        features={[
                            "Unlimited microservices",
                            "Unlimited API calls",
                            "Custom authentication",
                            "Dedicated Kafka clusters",
                            "24/7 phone & email support",
                            "Custom SLA",
                            "Dedicated account manager"
                        ]}
                        buttonText="Contact Sales"
                        popular={false}
                    />
                </div>
            </div>
        </section>
    )
}