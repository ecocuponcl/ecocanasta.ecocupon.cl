"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { SlidersHorizontal } from "lucide-react"

interface MobileFilterProps {
  onFilterChange: (minDiscount: number) => void
}

export function MobileFilter({ onFilterChange }: MobileFilterProps) {
  const [open, setOpen] = useState(false)
  const [minDiscount, setMinDiscount] = useState(0)

  const handleApplyFilter = () => {
    onFilterChange(minDiscount)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Descuento mínimo</h3>
            <div className="space-y-2">
              <Slider defaultValue={[0]} max={90} step={5} onValueChange={(value) => setMinDiscount(value[0])} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>{minDiscount}%</span>
                <span>90%</span>
              </div>
            </div>
          </div>
          <Button onClick={handleApplyFilter} className="w-full">
            Aplicar filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
