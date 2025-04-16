import React, { useState } from 'react';
import { 
  Calendar, 
  Search,
  Eye,
  Printer,
  ChevronDown,
  FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationEllipsis 
} from '@/components/ui/pagination';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/hooks/use-toast';
import { OrderService, Order } from '@/services/OrderService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', selectedStatus],
    queryFn: () => 
      selectedStatus === 'all' 
        ? OrderService.getOrders()
        : OrderService.getOrdersByStatus(selectedStatus as Order['status'])
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) => 
      OrderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order status updated",
        description: "The order status has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error updating order",
        description: "There was a problem updating the order status.",
        variant: "destructive",
      });
    }
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['paymentStatus'] }) => 
      OrderService.updatePaymentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Payment status updated",
        description: "The payment status has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error updating payment",
        description: "There was a problem updating the payment status.",
        variant: "destructive",
      });
    }
  });

  const handleStatusUpdate = (id: string, status: Order['status']) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handlePaymentStatusUpdate = (id: string, status: Order['paymentStatus']) => {
    updatePaymentStatusMutation.mutate({ id, status });
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'shipped':
        return 'primary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Card className="hover-lift transition-all">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={(e) => e.preventDefault()} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search orders by ID or customer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </form>
              
              <div className="w-full sm:w-48">
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="group">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <HoverCard>
                        <HoverCardTrigger className="underline text-primary cursor-pointer">
                          {order.items.length} items
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-semibold mb-2">Order Items</h4>
                            {order.items.map((item, index) => (
                              <div key={index} className="grid grid-cols-8 text-sm gap-2">
                                <div className="col-span-5 truncate">{item.title}</div>
                                <div className="col-span-1 text-right">{item.quantity}x</div>
                                <div className="col-span-2 text-right">{item.price.toLocaleString()} RSD</div>
                              </div>
                            ))}
                            <div className="border-t pt-2 mt-2 font-medium text-right">
                              Total: {order.totalAmount.toLocaleString()} RSD
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="text-right">{order.totalAmount.toLocaleString()} RSD</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {order.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'pending')}>
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'processing')}>
                              Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')}>
                              Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'delivered')}>
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePaymentStatusUpdate(order.id, 'paid')}>
                              Mark as Paid
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            >
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" aria-label="Previous page">
                    Previous
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" aria-label="Next page">
                    Next
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
