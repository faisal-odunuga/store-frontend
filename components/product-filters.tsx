"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { categories, makers } from "@/lib/products"

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  priceRange: [number, number]
  selectedMakers: string[]
  category: string
  availability: "all" | "in-stock" | "low-stock"
}

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1500],
    selectedMakers: [],
    category: "All Categories",
    availability: "all",
  })

  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleMakerToggle = (maker: string) => {
    const newMakers = filters.selectedMakers.includes(maker)
      ? filters.selectedMakers.filter((m) => m !== maker)
      : [...filters.selectedMakers, maker]
    updateFilters({ selectedMakers: newMakers })
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Price Range</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={1500}
            step={10}
            className='w-full'
          />
          <div className='flex items-center justify-between text-sm text-muted-foreground'>
            <span>₦{filters.priceRange[0]}</span>
            <span>₦{filters.priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Category</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={filters.category}
            onValueChange={(value) => updateFilters({ category: value })}
          >
            {categories.map((category) => (
              <div key={category} className='flex items-center space-x-2'>
                <RadioGroupItem value={category} id={category} />
                <Label htmlFor={category} className='text-sm font-normal cursor-pointer'>
                  {category}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Manufacturer</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {makers.map((maker) => (
            <div key={maker} className='flex items-center space-x-2'>
              <Checkbox
                id={maker}
                checked={filters.selectedMakers.includes(maker)}
                onCheckedChange={() => handleMakerToggle(maker)}
              />
              <Label htmlFor={maker} className='text-sm font-normal cursor-pointer'>
                {maker}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={filters.availability}
            onValueChange={(value) =>
              updateFilters({ availability: value as FilterState['availability'] })
            }
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='all' id='all' />
              <Label htmlFor='all' className='text-sm font-normal cursor-pointer'>
                All Products
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='in-stock' id='in-stock' />
              <Label htmlFor='in-stock' className='text-sm font-normal cursor-pointer'>
                In Stock
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='low-stock' id='low-stock' />
              <Label htmlFor='low-stock' className='text-sm font-normal cursor-pointer'>
                Low Stock
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
