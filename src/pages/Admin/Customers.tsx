
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
  avatarUrl?: string;
}

const demoCustomers: Customer[] = [
  {
    id: 'C001',
    name: 'Marko Petrović',
    email: 'marko.petrovic@example.com',
    phone: '+381 63 123 4567',
    location: 'Belgrade, Serbia',
    orders: 12,
    totalSpent: 45600,
    lastOrder: '05.04.2025',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 'C002',
    name: 'Ana Jovanović',
    email: 'ana.jovanovic@example.com',
    phone: '+381 64 234 5678',
    location: 'Novi Sad, Serbia',
    orders: 8,
    totalSpent: 29400,
    lastOrder: '01.04.2025',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 'C003',
    name: 'Stefan Nikolić',
    email: 'stefan.nikolic@example.com',
    phone: '+381 65 345 6789',
    location: 'Niš, Serbia',
    orders: 5,
    totalSpent: 18200,
    lastOrder: '28.03.2025',
    status: 'inactive',
    avatarUrl: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: 'C004',
    name: 'Jelena Đorđević',
    email: 'jelena.djordjevic@example.com',
    phone: '+381 66 456 7890',
    location: 'Kragujevac, Serbia',
    orders: 10,
    totalSpent: 36800,
    lastOrder: '03.04.2025',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?u=4',
  },
  {
    id: 'C005',
    name: 'Milan Todorović',
    email: 'milan.todorovic@example.com',
    phone: '+381 67 567 8901',
    location: 'Subotica, Serbia',
    orders: 3,
    totalSpent: 9600,
    lastOrder: '25.03.2025',
    status: 'inactive',
    avatarUrl: 'https://i.pravatar.cc/150?u=5',
  },
];

const Customers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(demoCustomers);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredCustomers(demoCustomers);
    } else {
      const filtered = demoCustomers.filter(customer => 
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase()) ||
        customer.id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };
  
  const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    if (status === 'all') {
      setFilteredCustomers(demoCustomers);
    } else {
      const filtered = demoCustomers.filter(customer => customer.status === status);
      setFilteredCustomers(filtered);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Customers
        </h1>
        <Button className="bg-accent hover:bg-accent/90 transition-all">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Customer
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search customers..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                All Customers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('active')}>
                Active Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('inactive')}>
                Inactive Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="px-6 py-4">
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Manage your customers and their information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="transition-colors hover:bg-muted/30">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                          <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1.5" />
                          {customer.email}
                        </span>
                        <span className="text-sm flex items-center">
                          <Phone className="h-3.5 w-3.5 mr-1.5" />
                          {customer.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        {customer.location}
                      </span>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>{customer.totalSpent.toLocaleString()} RSD</TableCell>
                    <TableCell>
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {customer.lastOrder}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={customer.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800/40'
                      }>
                        {customer.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
