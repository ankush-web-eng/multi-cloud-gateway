'use client';

import { ContactForm } from "@/components/cards/contact-form";

export default function Contact() {
    return (
        <section id="contact" className="py-16 md:py-24 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Get in Touch
                            </h2>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                Have questions about our multi-cloud gateway? Our team is here to help you get started.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="rounded-full bg-primary/10 p-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4 text-primary"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <span>+91 *******695</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="rounded-full bg-primary/10 p-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4 text-primary"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </div>
                                <span>ankushsingh.dev@gmail.com</span>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto lg:mx-0 w-full max-w-[600px] rounded-lg border bg-background p-6 shadow-lg">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </section>
    )
}