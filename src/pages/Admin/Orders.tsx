
import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter,
  FileDown,
  Eye,
  Printer,
  ChevronDown
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

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-28741',
    customer: 'Marko Petrović',
    date: '06.04.2025',
    items: 3,
    total: 12890,
    payment: 'card',
    status: 'completed',
    shipping: 'Belgrade, Serbia',
    products: [
      { id: 'p1', name: 'iPhone 14 Pro Case - Black', quantity: 1, price: 2499 },
      { id: 'p2', name: 'USB-C Fast Charger 65W', quantity: 1, price: 3499 },
      { id: 'p3', name: 'Lightning Cable - 2m', quantity: 1, price: 1299 },
    ]
  },
  {
    id: 'ORD-28740',
    customer: 'Ana Jovanović',
    date: '05.04.2025',
    items: 2,
    total: 8450,
    payment: 'cash',
    status: 'processing',
    shipping: 'Novi Sad, Serbia',
    products: [
      { id: 'p4', name: 'Samsung Galaxy S23 Screen Protector', quantity: 1, price: 1499 },
      { id: 'p5', name: 'Bluetooth Earbuds', quantity: 1, price: 4999 },
    ]
  },
  {
    id: 'ORD-28739',
    customer: 'Stefan Nikolić',
    date: '05.04.2025',
    items: 1,
    total: 5670,
    payment: 'card',
    status: 'pending',
    shipping: 'Niš, Serbia',
    products: [
      { id: 'p6', name: 'Xiaomi Redmi Note 12 Case + Screen Protector', quantity: 1, price: 2499 },
    ]
  },
  {
    id: 'ORD-28738',
    customer: 'Jelena Đorđević',
    date: '04.04.2025',
    items: 4,
    total: 13290,
    payment: 'card',
    status: 'completed',
    shipping: 'Kragujevac, Serbia',
    products: [
      { id: 'p7', name: 'iPhone 14 Pro Case - Black', quantity: 1, price: 2499 },
      { id: 'p8', name: 'iPhone 14 Pro Screen Protector', quantity: 1, price: 1499 },
      { id: 'p9', name: 'USB-C Fast Charger 65W', quantity: 1, price: 3499 },
      { id: 'p10', name: 'Wireless Charger', quantity: 1, price: 2999 },
    ]
  },
  {
    id: 'ORD-28737',
    customer: 'Milan Todorović',
    date: '04.04.2025',
    items: 2,
    total: 7890,
    payment: 'cash',
    status: 'processing',
    shipping: 'Subotica, Serbia',
    products: [
      { id: 'p11', name: 'Samsung Galaxy S23 Case', quantity: 1, price: 1899 },
      { id: 'p12', name: 'Bluetooth Earbuds', quantity: 1, price: 4999 },
    ]
  },
  {
    id: 'ORD-28736',
    customer: 'Ivana Milić',
    date: '03.04.2025',
    items: 1,
    total: 4999,
    payment: 'card',
    status: 'cancelled',
    shipping: 'Belgrade, Serbia',
    products: [
      { id: 'p13', name: 'Bluetooth Earbuds', quantity: 1, price: 4999 },
    ]
  },
];

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Filter orders based on search term and status
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' || 
      order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Additional search logic would be implemented here in a real app
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'pending':
        return 'outline'; // Changed from 'warning' to 'outline'
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

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
              <form onSubmit={handleSearch} className="flex-1">
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Orders table */}
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
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <HoverCard>
                        <HoverCardTrigger className="underline text-primary cursor-pointer">
                          {order.items} items
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-semibold mb-2">Order Items</h4>
                            {order.products.map((product) => (
                              <div key={product.id} className="grid grid-cols-8 text-sm gap-2">
                                <div className="col-span-5 truncate">{product.name}</div>
                                <div className="col-span-1 text-right">{product.quantity}x</div>
                                <div className="col-span-2 text-right">{product.price.toLocaleString()} RSD</div>
                              </div>
                            ))}
                            <div className="border-t pt-2 mt-2 font-medium text-right">
                              Total: {order.total.toLocaleString()} RSD
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="text-right">{order.total.toLocaleString()} RSD</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {order.payment}
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                            <DropdownMenuItem>Send Email</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
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
          
          {/* Pagination */}
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
