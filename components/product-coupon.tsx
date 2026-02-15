"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Copy, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/utils"

interface ProductCouponProps {
  product: any
  discount: number
}

export function ProductCoupon({ product, discount }: ProductCouponProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [phone, setPhone] = useState("")
  const [sending, setSending] = useState(false)

  const couponCode = `ECO${discount}OFF${product.id}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode)
    setCopied(true)
    toast({
      title: "Código copiado",
      description: "El código de cupón ha sido copiado al portapapeles",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const sendCouponByWhatsApp = () => {
    if (!phone) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número de WhatsApp",
        variant: "destructive",
      })
      return
    }

    setSending(true)

    // Simulación de envío
    setTimeout(() => {
      setSending(false)
      toast({
        title: "Cupón enviado",
        description: "El cupón ha sido enviado por WhatsApp",
      })
      setPhone("")

      // En una implementación real, aquí se haría la llamada a la API para enviar el mensaje
      // Por ahora, simulamos abrir WhatsApp con un mensaje predefinido
      const savings = product.comparisonPrice ? product.price - product.comparisonPrice.price : 0
      const message = `¡Hola! Aquí tienes tu cupón de descuento de EcoCupon: ${couponCode}. Ahorra $${formatPrice(savings)} (${discount}% OFF) en tu compra de ${product.name}.`
      const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    }, 1500)
  }

  const savings = product.comparisonPrice ? product.price - product.comparisonPrice.price : 0

  return (
    <Card className="mb-4 sm:mb-6 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-green-700 dark:text-green-400">
            ¡Ahorra {discount}% con este cupón!
          </h3>
        </div>

        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-md">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
            Ahorra ${formatPrice(savings)} en tu compra
          </div>
          <div className="flex items-center justify-between">
            <code className="font-mono text-xs sm:text-sm md:text-lg font-bold">{couponCode}</code>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copiar código</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span className="font-medium text-sm sm:text-base">Enviar cupón por WhatsApp</span>
          </div>

          <Input
            type="tel"
            placeholder="Tu número de WhatsApp"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="text-sm h-9 sm:h-10"
          />

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-2 sm:py-3"
            onClick={sendCouponByWhatsApp}
            disabled={!phone || sending}
          >
            {sending ? "Enviando..." : "Enviar cupón por WhatsApp"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
