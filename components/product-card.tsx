import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className='overflow-hidden hover:shadow-lg transition-shadow'>
      <div className='relative aspect-square bg-muted'>
        <Image
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          className='object-cover'
        />
        {product.stock === 0 && (
          <Badge className='absolute top-2 right-2 bg-destructive text-destructive-foreground'>
            Out of Stock
          </Badge>
        )}
        {product.stock > 0 && product.stock < 30 && (
          <Badge className='absolute top-2 right-2 bg-secondary text-secondary-foreground'>
            Low Stock
          </Badge>
        )}
      </div>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between gap-2 mb-2'>
          <h3 className='font-semibold text-base leading-tight line-clamp-2'>{product.name}</h3>
          <span className='text-lg font-bold text-primary whitespace-nowrap'>₦{product.price}</span>
        </div>
        <p className='text-sm text-muted-foreground mb-2'>{product.maker}</p>
        <p className='text-sm text-foreground/80 line-clamp-2 mb-3'>{product.description}</p>
        <div className='flex flex-wrap gap-1'>
          {product.specs.slice(0, 2).map((spec, index) => (
            <Badge key={index} variant='outline' className='text-xs'>
              {spec}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className='p-4 pt-0'>
        <Button className='w-full' asChild size='sm'>
          <Link href={`/product/${product.id}`}>
            <Eye className='mr-2 h-4 w-4' />
            View Product
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
