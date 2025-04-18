"use client"

import { useEffect, useRef } from "react"

export default function ArchitectureDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Colors
    const colors = {
      background: "#ffffff",
      border: "#e2e8f0",
      primary: "#7c3aed",
      secondary: "#a78bfa",
      text: "#1e293b",
      line: "#cbd5e1",
      node: {
        gateway: "#7c3aed",
        auth: "#3b82f6",
        payment: "#10b981",
        notification: "#f59e0b",
        kafka: "#ef4444",
        database: "#6366f1",
        frontend: "#ec4899"
      }
    }

    // Clear canvas
    ctx.fillStyle = colors.background
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Draw architecture diagram
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) * 0.7

    // Draw central gateway node
    drawNode(ctx, centerX, centerY, "API Gateway", colors.node.gateway)

    // Draw service nodes around the gateway
    const services = [
      { name: "Auth Service", color: colors.node.auth },
      { name: "Payment Service", color: colors.node.payment },
      { name: "Notification", color: colors.node.notification },
      { name: "Kafka", color: colors.node.kafka },
      { name: "Databases", color: colors.node.database },
      { name: "Frontend", color: colors.node.frontend }
    ]

    services.forEach((service, i) => {
      const angle = (i * Math.PI * 2) / services.length
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Draw connection line
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = colors.line
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw service node
      drawNode(ctx, x, y, service.name, service.color)
    })

  }, [])

  function drawNode(
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    label: string, 
    color: string
  ) {
    const nodeRadius = 30
    const colors = {
      border: "#e2e8f0",
    }

    // Draw node circle
    ctx.beginPath()
    ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw node label
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    
    // Handle multi-line text
    const words = label.split(' ')
    if (words.length === 1) {
      ctx.fillText(label, x, y)
    } else {
      ctx.fillText(words[0], x, y - 6)
      ctx.fillText(words.slice(1).join(' '), x, y + 6)
    }
  }

  return (
    <div className="w-full aspect-video relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full rounded-md"
        style={{ maxHeight: "400px" }}
      />
    </div>
  )
}
