import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
}

export function PricingCard({ title, price, description, features, buttonText, popular = false }: PricingCardProps) {
  return (
    <Card className={`flex flex-col ${popular ? "border-primary shadow-lg" : ""}`}>
      {popular && (
        <div className="rounded-t-lg bg-primary py-1 text-center text-xs font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4 flex items-baseline text-foreground">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Custom" && <span className="ml-1 text-sm font-medium">/month</span>}
        </div>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={popular ? "default" : "outline"}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
