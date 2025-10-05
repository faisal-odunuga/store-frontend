export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  image: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
}

// Demo orders data
export const orders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+1234567890",
    shippingAddress: "123 Main St, New York, NY 10001",
    items: [
      {
        productId: "1",
        productName: "Samsung Double Door Refrigerator",
        quantity: 1,
        price: 899,
        image: "/samsung-refrigerator.png",
      },
    ],
    total: 899,
    status: "delivered",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    customerPhone: "+1234567891",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
    items: [
      {
        productId: "2",
        productName: "Dyson Tower Fan",
        quantity: 2,
        price: 349,
        image: "/dyson-tower-fan.jpg",
      },
      {
        productId: "5",
        productName: "LG Split AC 1.5 Ton",
        quantity: 1,
        price: 549,
        image: "/lg-air-conditioner.jpg",
      },
    ],
    total: 1247,
    status: "shipped",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerEmail: "mike.j@example.com",
    customerPhone: "+1234567892",
    shippingAddress: "789 Pine Rd, Chicago, IL 60601",
    items: [
      {
        productId: "3",
        productName: "Honda Portable Generator 5000W",
        quantity: 1,
        price: 1299,
        image: "/honda-generator.jpg",
      },
    ],
    total: 1299,
    status: "processing",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "ORD-004",
    customerName: "Sarah Williams",
    customerEmail: "sarah.w@example.com",
    customerPhone: "+1234567893",
    shippingAddress: "321 Elm St, Houston, TX 77001",
    items: [
      {
        productId: "4",
        productName: "Vitamix Professional Blender",
        quantity: 1,
        price: 449,
        image: "/vitamix-blender.jpg",
      },
      {
        productId: "8",
        productName: "Panasonic Microwave Oven 32L",
        quantity: 1,
        price: 199,
        image: "/panasonic-microwave.jpg",
      },
    ],
    total: 648,
    status: "pending",
    createdAt: new Date("2024-01-21"),
    updatedAt: new Date("2024-01-21"),
  },
  {
    id: "ORD-005",
    customerName: "David Brown",
    customerEmail: "david.b@example.com",
    customerPhone: "+1234567894",
    shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
    items: [
      {
        productId: "6",
        productName: "Bosch Front Load Washing Machine",
        quantity: 1,
        price: 749,
        image: "/bosch-washing-machine.jpg",
      },
    ],
    total: 749,
    status: "delivered",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-16"),
  },
]
