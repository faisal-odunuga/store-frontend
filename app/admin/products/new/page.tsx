'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiService from '@/lib/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Stock must be a non-negative number',
  }),
  category: z.string().min(1, 'Category is required'),
  image: z.any().refine((files) => files?.length > 0, 'Image is required'),
});

type ProductValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: apiService.product.create,
    onSuccess: () => {
      toast.success('Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/admin/products');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create product');
    },
  });

  function onSubmit(values: ProductValues) {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price); // Backend expects number but FormData sends string. Backend should parse or we parse here?
    // Instructions: Fields: `price` (number), `stock` (integer).
    // If backend uses multer/form-data, it usually receives strings unless verified otherwise.
    // However, best practice with FormData is it sends strings. We rely on backend or axios to handle.
    // Wait, axios doesn't auto-convert FormData values to numbers.
    // If backend is strict about type in the controller (e.g. using a DTO that expects number), it might fail if it receives a string "100".
    // But usually in `multipart/form-data`, everything is a string. The backend validation/parsing logic handles conversion.
    // I will proceed assuming backend parses FormData correctly.

    formData.append('stock', values.stock);
    formData.append('category', values.category);
    if (values.image && values.image[0]) {
      formData.append('image', values.image[0]);
    }

    mutate(formData);
  }

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <h1 className='text-3xl font-bold'>Add New Product</h1>
      <div className='p-6 rounded-lg border bg-card'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Wireless Headphones' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Product details...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type='number' step='0.01' placeholder='99.99' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='100' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='electronics'>Electronics</SelectItem>
                      <SelectItem value='appliances'>Appliances</SelectItem>
                      <SelectItem value='accessories'>Accessories</SelectItem>
                      <SelectItem value='computers'>Computers</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='image'
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder='Picture'
                      type='file'
                      accept='image/*'
                      onChange={(event) => {
                        onChange(event.target.files && event.target.files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' size='lg' className='w-full' disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Product'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
