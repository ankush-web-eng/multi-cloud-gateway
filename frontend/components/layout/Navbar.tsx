'use client';
import { Cloud} from 'lucide-react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    return (
        <header className="px-3 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Cloud className="h-6 w-6 text-primary" />
                    <span>CloudGate</span>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-sm font-medium hover:text-primary">
                        Features
                    </Link>
                    <Link href="#architecture" className="text-sm font-medium hover:text-primary">
                        Architecture
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium hover:text-primary">
                        Pricing
                    </Link>
                    <Link href="#contact" className="text-sm font-medium hover:text-primary">
                        Contact
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="hidden md:flex">
                        Log in
                    </Button>
                    <Button size="sm">Get Started</Button>
                </div>
            </div>
        </header>
    )
}