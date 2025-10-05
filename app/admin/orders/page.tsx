"use client"

import { useState } from "react"
import { orders, type Order, type OrderStatus } from "@/lib/orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react"

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
  processing: { label: "Processing", icon: Package, color: "bg-blue-500" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-500" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500" },
}

export default function OrdersPage() {
  const [orderList, setOrderList] = useState<Order[]>(orders)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredOrders = filterStatus === "all" ? orderList : orderList.filter((order) => order.status === filterStatus)

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrderList((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order)),
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Recent Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track customer orders</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon
            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        Order {order.id}
                        <Badge variant="secondary" className={`${statusConfig[order.status].color} text-white`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="font-medium text-foreground">{order.customerName}</p>
                        <p>{order.customerEmail}</p>
                        <p>{order.customerPhone}</p>
                        <p className="text-xs">Ordered: {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{order.items.length} item(s)</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Shipping Address:</p>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Order Items:</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                          <p className="text-sm font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
