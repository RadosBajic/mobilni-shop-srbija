
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileUp, 
  FileDown,
  Edit,
  Trash2,
  X,
  Check
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
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from '@/components/ui/pagination';

// Mock product data
const mockProducts = [
  {
    id: 'p1',
    name: 'iPhone 14 Pro silikonska maska - crna',
    sku: 'IP14P-CASE-BLK',
    category: 'Maske za telefone',
    price: 2499,
    stock: 45,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S23 Ultra staklena zaštita ekrana',
    sku: 'SGS23U-SCRN',
    category: 'Zaštita ekrana',
    price: 1499,
    stock: 32,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1600541519467-937869997e34?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'p3',
    name: 'Bežične Bluetooth slušalice sa mikrofonom',
    sku: 'BT-EARBUD-BLK',
    category: 'Slušalice',
    price: 4999,
    stock: 18,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'p4',
    name: 'Brzi punjač USB-C 65W',
    sku: 'CHR-USB-C-65',
    category: 'Punjači',
    price: 3499,
    stock: 27,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1628815113969-0487917e8b76?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'p5',
    name: 'Premium Lightning kabl - 2m',
    sku: 'CBL-LIGHT-2M',
    category: 'Kablovi',
    price: 1299,
    stock: 0,
    status: 'outOfStock',
    image: 'https://images.unsplash.com/photo-1606292943133-cc1b0ff0e295?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'p6',
    name: 'Xiaomi Redmi Note 12 transparentna maska',
    sku: 'XRM12-CASE-CLR',
    category: 'Maske za telefone',
    price: 1199,
    stock: 12,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1609388449750-b504ef6d27f4?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'p7',
    name: 'Zaštitno staklo za Apple Watch',
    sku: 'AW-SCRN-42MM',
    category: 'Zaštita ekrana',
    price: 1299,
    stock: 0,
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=100&auto=format&fit=crop',
  },
];

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic would be implemented here in a real app
    console.log('Searching for:', searchTerm);
  };
  
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </form>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4" />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4 opacity-0" />
                    Out of Stock
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4 opacity-0" />
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Reset Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Products table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </TableHead>
                  <TableHead className="w-14"></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="h-10 w-10 rounded-md bg-secondary overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">{product.price.toLocaleString()} RSD</TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={
                        product.status === 'active' ? 'default' :
                        product.status === 'outOfStock' ? 'destructive' : 'secondary'
                      }>
                        {product.status === 'active' ? 'Active' :
                         product.status === 'outOfStock' ? 'Out of Stock' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <span className="sr-only">Open menu</span>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                              <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default Products;
