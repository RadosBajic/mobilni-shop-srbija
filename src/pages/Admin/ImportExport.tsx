
import React, { useState } from 'react';
import {
  FileUp,
  FileDown,
  FileText,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  X,
  Download,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Sample import history data
const importHistory = [
  { 
    id: 'imp-1', 
    date: '06.04.2025', 
    type: 'products', 
    filename: 'products-april-2025.csv', 
    status: 'completed',
    records: 156,
    added: 45,
    updated: 102,
    failed: 9
  },
  { 
    id: 'imp-2', 
    date: '01.04.2025', 
    type: 'categories', 
    filename: 'categories-update.csv', 
    status: 'completed',
    records: 12,
    added: 2,
    updated: 10,
    failed: 0
  },
  { 
    id: 'imp-3', 
    date: '28.03.2025', 
    type: 'products', 
    filename: 'product-prices-update.csv', 
    status: 'failed',
    records: 235,
    added: 0,
    updated: 0,
    failed: 235
  },
];

// Sample templates
const templates = [
  { id: 'tmp-1', name: 'Products Template', filename: 'products-template.csv', description: 'Template for importing products' },
  { id: 'tmp-2', name: 'Categories Template', filename: 'categories-template.csv', description: 'Template for importing categories' },
  { id: 'tmp-3', name: 'Price Update Template', filename: 'price-update-template.csv', description: 'Template for updating product prices' },
  { id: 'tmp-4', name: 'Stock Update Template', filename: 'stock-update-template.csv', description: 'Template for updating stock levels' },
];

const ImportExport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [importType, setImportType] = useState('products');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const simulateImport = () => {
    if (!selectedFile) return;
    
    setImportStatus('processing');
    setImportProgress(0);
    
    // Simulate a file upload and processing
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImportStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const resetImport = () => {
    setSelectedFile(null);
    setImportProgress(0);
    setImportStatus('idle');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Import / Export</h1>
      
      <Tabs defaultValue="import" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>
        
        {/* Import Tab */}
        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>
                Upload CSV or Excel files to bulk import data into your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">
                    What would you like to import?
                  </label>
                  <Select value={importType} onValueChange={setImportType}>
                    <SelectTrigger className="w-full md:w-72">
                      <SelectValue placeholder="Select import type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="categories">Categories</SelectItem>
                      <SelectItem value="prices">Price Update</SelectItem>
                      <SelectItem value="stock">Stock Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {importStatus === 'idle' ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <FileUp className="h-10 w-10 text-muted-foreground/60 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload File</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload CSV or XLSX file to import {importType}
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <label className="cursor-pointer">
                            Choose File
                            <input
                              type="file"
                              className="hidden"
                              accept=".csv,.xlsx"
                              onChange={handleFileChange}
                            />
                          </label>
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <HelpCircle className="h-4 w-4" />
                              <span className="sr-only">Help</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80">
                              Files must be in CSV or XLSX format. Make sure your columns match our template. 
                              For large files, the import may take some time to process.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      
                      {selectedFile && (
                        <div className="flex items-center p-2 bg-secondary rounded w-full mt-2">
                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="text-sm">{selectedFile.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-auto"
                            onClick={() => setSelectedFile(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">{selectedFile?.name}</span>
                      </div>
                      
                      {importStatus === 'processing' ? (
                        <span className="text-sm text-muted-foreground">Processing...</span>
                      ) : importStatus === 'success' ? (
                        <span className="flex items-center text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center text-sm text-destructive">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Failed
                        </span>
                      )}
                    </div>
                    
                    <Progress value={importProgress} className="mb-4" />
                    
                    {importStatus === 'success' && (
                      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Import successful</AlertTitle>
                        <AlertDescription>
                          All your data has been successfully imported.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {importStatus === 'error' && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Import failed</AlertTitle>
                        <AlertDescription>
                          There was an error processing your file. Please check the format and try again.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Import Templates</h3>
                <div className="grid gap-3">
                  {templates.map(template => (
                    <div 
                      key={template.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">{template.description}</div>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              {importStatus === 'idle' ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setActiveTab('export')}>
                    Switch to Export
                  </Button>
                  <Button 
                    onClick={simulateImport} 
                    disabled={!selectedFile}
                  >
                    Start Import
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetImport}>
                    Reset
                  </Button>
                  {importStatus === 'success' && (
                    <Button variant="default">
                      View Report
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>
                Review previous data imports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Failed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importHistory.map(import_ => (
                      <TableRow key={import_.id}>
                        <TableCell>{import_.date}</TableCell>
                        <TableCell className="capitalize">{import_.type}</TableCell>
                        <TableCell>{import_.filename}</TableCell>
                        <TableCell>{import_.records}</TableCell>
                        <TableCell>{import_.added}</TableCell>
                        <TableCell>{import_.updated}</TableCell>
                        <TableCell>{import_.failed}</TableCell>
                        <TableCell>
                          <Badge variant={import_.status === 'completed' ? 'default' : 'destructive'}>
                            {import_.status === 'completed' ? 'Completed' : 'Failed'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Export Tab */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export your store data to CSV or Excel files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export all product data including categories, prices, and inventory.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">CSV</Button>
                      <Button size="sm" variant="outline" className="flex-1">XLSX</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export all categories including descriptions and status.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">CSV</Button>
                      <Button size="sm" variant="outline" className="flex-1">XLSX</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export all order data including customer information and statuses.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">CSV</Button>
                      <Button size="sm" variant="outline" className="flex-1">XLSX</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export all customer data including contact information.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">CSV</Button>
                      <Button size="sm" variant="outline" className="flex-1">XLSX</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Inventory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export current inventory levels for all products.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">CSV</Button>
                      <Button size="sm" variant="outline" className="flex-1">XLSX</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer">
                  <div className="rounded-full bg-secondary p-3 mb-3">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">Custom Export</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    Create a custom export with specific fields
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportExport;
