"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Copy, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/utils"

interface ProductCouponProps {
  product: {
    id: string
    name: string
    price: number
    knastaPrice?: { price: number } | null
  }
  discount: number
}

export function ProductCoupon({ product, discount }: ProductCouponProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [phone, setPhone] = useState("")

  const couponCode = `ECO${discount}OFF${product.id.toUpperCase().slice(0, 6)}`
  const savings = product.knastaPrice ? product.price - product.knastaPrice.price : 0

  function copyToClipboard() {
    navigator.clipboard.writeText(couponCode)
    setCopied(true)
    toast({ title: "Codigo copiado", description: "El codigo ha sido copiado al portapapeles." })
    setTimeout(() => setCopied(false), 2000)
  }

  function sendWhatsApp() {
    const cleanPhone = phone.replace(/\D/g, "")
    if (!cleanPhone) {
      toast({ title: "Error", description: "Ingresa un numero de WhatsApp.", variant: "destructive" })
      return
    }

    const message = `Hola! Te comparto este cupon de EcoCupon: ${couponCode}\n\nProducto: ${product.name}\nAhorro: $${formatPrice(savings)} (${discount}% OFF)\n\nVer oferta en EcoCupon`
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <Card className="mb-4 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <h3 className="mb-3 text-sm font-semibold text-primary sm:text-base">
          Ahorra {discount}% con este cupon
        </h3>

        {/* Code */}
        <div className="mb-3 flex items-center justify-between rounded-md bg-background p-3">
          <code className="text-sm font-bold sm:text-base">{couponCode}</code>
          <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copiar</span>
          </Button>
        </div>

        {/* WhatsApp */}
        <div className="flex gap-2">
          <Input
            type="tel"
            placeholder="+56 9 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-9 text-sm"
          />
          <Button onClick={sendWhatsApp} size="sm" className="shrink-0 gap-1.5">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Enviar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
