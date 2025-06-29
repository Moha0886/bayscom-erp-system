import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Stack,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Search,
  Download,
  Warning,
  Inventory,
  TrendingUp,
  TrendingDown,
  Store,
} from '@mui/icons-material';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  unit: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  totalValue: number;
  location: string;
  lastSale: string;
  lastRestock: string;
  supplier: string;
  status: 'available' | 'low-stock' | 'out-of-stock' | 'reorder' | 'discontinued';
  salesVelocity: 'high' | 'medium' | 'low';
}

const mockProducts: Product[] = [
  {
    id: 'PRD001',
    name: 'Crude Oil - Bonny Light',
    sku: 'OIL-BL-001',
    category: 'Petroleum Products',
    description: 'Premium Bonny Light crude oil, 37° API',
    unit: 'Barrel',
    currentStock: 15000,
    reservedStock: 2000,
    availableStock: 13000,
    minStock: 5000,
    maxStock: 25000,
    reorderLevel: 7000,
    costPrice: 45000,
    sellingPrice: 52000,
    totalValue: 780000000,
    location: 'Terminal A',
    lastSale: '2024-12-28',
    lastRestock: '2024-12-20',
    supplier: 'NNPC Limited',
    status: 'available',
    salesVelocity: 'high',
  },
  {
    id: 'PRD002',
    name: 'Natural Gas',
    sku: 'GAS-NG-001',
    category: 'Gas Products',
    description: 'Compressed natural gas for industrial use',
    unit: 'MCF',
    currentStock: 8500,
    reservedStock: 1500,
    availableStock: 7000,
    minStock: 3000,
    maxStock: 15000,
    reorderLevel: 4000,
    costPrice: 2800,
    sellingPrice: 3200,
    totalValue: 27200000,
    location: 'Gas Plant B',
    lastSale: '2024-12-27',
    lastRestock: '2024-12-15',
    supplier: 'Nigerian Gas Company',
    status: 'available',
    salesVelocity: 'medium',
  },
  {
    id: 'PRD003',
    name: 'Premium Motor Spirit (PMS)',
    sku: 'PMS-REG-001',
    category: 'Refined Products',
    description: 'Premium gasoline, octane rating 91',
    unit: 'Liter',
    currentStock: 2500000,
    reservedStock: 500000,
    availableStock: 2000000,
    minStock: 1000000,
    maxStock: 5000000,
    reorderLevel: 1500000,
    costPrice: 185,
    sellingPrice: 215,
    totalValue: 537500000,
    location: 'Storage Tank 1',
    lastSale: '2024-12-29',
    lastRestock: '2024-12-25',
    supplier: 'Dangote Refinery',
    status: 'available',
    salesVelocity: 'high',
  },
  {
    id: 'PRD004',
    name: 'Diesel (AGO)',
    sku: 'AGO-REG-001',
    category: 'Refined Products',
    description: 'Automotive gas oil, low sulfur diesel',
    unit: 'Liter',
    currentStock: 850000,
    reservedStock: 100000,
    availableStock: 750000,
    minStock: 500000,
    maxStock: 2000000,
    reorderLevel: 600000,
    costPrice: 205,
    sellingPrice: 240,
    totalValue: 204000000,
    location: 'Storage Tank 2',
    lastSale: '2024-12-28',
    lastRestock: '2024-12-22',
    supplier: 'Port Harcourt Refinery',
    status: 'available',
    salesVelocity: 'medium',
  },
  {
    id: 'PRD005',
    name: 'Kerosene (DPK)',
    sku: 'DPK-REG-001',
    category: 'Refined Products',
    description: 'Dual purpose kerosene for household use',
    unit: 'Liter',
    currentStock: 125000,
    reservedStock: 25000,
    availableStock: 100000,
    minStock: 200000,
    maxStock: 800000,
    reorderLevel: 250000,
    costPrice: 195,
    sellingPrice: 225,
    totalValue: 28125000,
    location: 'Storage Tank 3',
    lastSale: '2024-12-26',
    lastRestock: '2024-12-10',
    supplier: 'Kaduna Refinery',
    status: 'low-stock',
    salesVelocity: 'low',
  },
  {
    id: 'PRD006',
    name: 'Lubricating Oil - SAE 20W-50',
    sku: 'LUB-20W50-001',
    category: 'Lubricants',
    description: 'Multi-grade engine oil for vehicles',
    unit: 'Liter',
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    minStock: 5000,
    maxStock: 20000,
    reorderLevel: 7500,
    costPrice: 850,
    sellingPrice: 1200,
    totalValue: 0,
    location: 'Warehouse C',
    lastSale: '2024-12-20',
    lastRestock: '2024-11-15',
    supplier: 'Total Lubricants Nigeria',
    status: 'out-of-stock',
    salesVelocity: 'medium',
  },
];

const statusColors = {
  'available': 'success' as const,
  'low-stock': 'warning' as const,
  'out-of-stock': 'error' as const,
  'reorder': 'info' as const,
  'discontinued': 'default' as const,
};

const velocityColors = {
  'high': 'success' as const,
  'medium': 'warning' as const,
  'low': 'error' as const,
};

const categories = ['All Categories', 'Petroleum Products', 'Gas Products', 'Refined Products', 'Lubricants'];
const locations = ['All Locations', 'Terminal A', 'Gas Plant B', 'Storage Tank 1', 'Storage Tank 2', 'Storage Tank 3', 'Warehouse C'];

export default function Products() {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'add'>('view');

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter;
    const matchesLocation = locationFilter === 'All Locations' || product.location === locationFilter;
    const matchesStatus = statusFilter === 'All Status' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  // Calculate summary metrics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock').length;
  const outOfStockProducts = products.filter(p => p.status === 'out-of-stock').length;
  const totalValue = products.reduce((sum, product) => sum + product.totalValue, 0);
  const totalReserved = products.reduce((sum, product) => sum + (product.reservedStock * product.costPrice), 0);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewMode('view');
    setDialogOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setViewMode('add');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
    setViewMode('view');
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    if (current === 0) return 0;
    return (current / max) * 100;
  };

  const getVelocityIcon = (velocity: string) => {
    switch (velocity) {
      case 'high': return <TrendingUp color="success" />;
      case 'medium': return <TrendingUp color="warning" />;
      case 'low': return <TrendingDown color="error" />;
      default: return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct}
          size="large"
        >
          Add Product
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box 
        display="grid" 
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(5, 1fr)' }} 
        gap={3} 
        sx={{ mb: 3 }}
      >
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Products</Typography>
            <Typography variant="h4">{totalProducts}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Low Stock Alert</Typography>
            <Typography variant="h4" color="warning.main">{lowStockProducts}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Out of Stock</Typography>
            <Typography variant="h4" color="error.main">{outOfStockProducts}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Value</Typography>
            <Typography variant="h5">₦{(totalValue / 1000000).toFixed(1)}M</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Reserved Value</Typography>
            <Typography variant="h5">₦{(totalReserved / 1000000).toFixed(1)}M</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Alerts */}
      {(outOfStockProducts > 0 || lowStockProducts > 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1">
            <strong>Stock Alert:</strong> {outOfStockProducts} product(s) out of stock, {lowStockProducts} product(s) low on stock.
          </Typography>
        </Alert>
      )}

      {/* Filters */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ minWidth: 300 }}
        />
        <TextField
          select
          label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {locations.map((location) => (
            <MenuItem key={location} value={location}>
              {location}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="All Status">All Status</MenuItem>
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="low-stock">Low Stock</MenuItem>
          <MenuItem value="out-of-stock">Out of Stock</MenuItem>
          <MenuItem value="reorder">Reorder</MenuItem>
          <MenuItem value="discontinued">Discontinued</MenuItem>
        </TextField>
        <Button
          variant="outlined"
          startIcon={<Download />}
          sx={{ minWidth: 120 }}
        >
          Export
        </Button>
      </Stack>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Stock Level</TableCell>
              <TableCell>Available/Reserved</TableCell>
              <TableCell>Pricing</TableCell>
              <TableCell>Total Value</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Velocity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      SKU: {product.sku}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {product.currentStock.toLocaleString()} {product.unit}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getStockLevel(product.currentStock, product.minStock, product.maxStock)}
                      color={product.currentStock <= product.reorderLevel ? 'error' : 'success'}
                      sx={{ height: 6 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Min: {product.minStock.toLocaleString()} | Max: {product.maxStock.toLocaleString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="success.main">
                    Available: {product.availableStock.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="warning.main">
                    Reserved: {product.reservedStock.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    Cost: ₦{product.costPrice.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Sale: ₦{product.sellingPrice.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    ₦{(product.totalValue / 1000000).toFixed(1)}M
                  </Typography>
                </TableCell>
                <TableCell>{product.location}</TableCell>
                <TableCell>
                  <Chip
                    label={product.status.replace('-', ' ').toUpperCase()}
                    color={statusColors[product.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getVelocityIcon(product.salesVelocity)}
                    <Chip
                      label={product.salesVelocity.toUpperCase()}
                      color={velocityColors[product.salesVelocity]}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewProduct(product)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedProduct(product);
                        setViewMode('edit');
                        setDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {viewMode === 'add' 
            ? 'Add New Product' 
            : viewMode === 'edit' 
            ? 'Edit Product' 
            : 'Product Details'
          }
        </DialogTitle>
        <DialogContent>
          {selectedProduct && viewMode === 'view' && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Basic Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory /> Product Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Product Name</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.name}</Typography>
                    
                    <Typography variant="subtitle2">SKU</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.sku}</Typography>
                    
                    <Typography variant="subtitle2">Category</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.category}</Typography>
                    
                    <Typography variant="subtitle2">Description</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.description}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Unit of Measure</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.unit}</Typography>
                    
                    <Typography variant="subtitle2">Supplier</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.supplier}</Typography>
                    
                    <Typography variant="subtitle2">Location</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedProduct.location}</Typography>
                    
                    <Typography variant="subtitle2">Sales Velocity</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getVelocityIcon(selectedProduct.salesVelocity)}
                      <Chip
                        label={selectedProduct.salesVelocity.toUpperCase()}
                        color={velocityColors[selectedProduct.salesVelocity]}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Stock Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Store /> Stock Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Current Stock</Typography>
                    <Typography variant="h6" color={
                      selectedProduct.currentStock <= selectedProduct.reorderLevel ? 'error' : 'success.main'
                    }>
                      {selectedProduct.currentStock.toLocaleString()} {selectedProduct.unit}
                    </Typography>
                    
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>Available Stock</Typography>
                    <Typography variant="h6" color="success.main">
                      {selectedProduct.availableStock.toLocaleString()} {selectedProduct.unit}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Reserved Stock</Typography>
                    <Typography variant="h6" color="warning.main">
                      {selectedProduct.reservedStock.toLocaleString()} {selectedProduct.unit}
                    </Typography>
                    
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>Stock Levels</Typography>
                    <Typography variant="body2">
                      Min: {selectedProduct.minStock.toLocaleString()} {selectedProduct.unit}
                    </Typography>
                    <Typography variant="body2">
                      Max: {selectedProduct.maxStock.toLocaleString()} {selectedProduct.unit}
                    </Typography>
                    <Typography variant="body2">
                      Reorder: {selectedProduct.reorderLevel.toLocaleString()} {selectedProduct.unit}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Status</Typography>
                    <Chip
                      label={selectedProduct.status.replace('-', ' ').toUpperCase()}
                      color={statusColors[selectedProduct.status]}
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="subtitle2" sx={{ display: 'block' }}>Stock Level Progress</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getStockLevel(selectedProduct.currentStock, selectedProduct.minStock, selectedProduct.maxStock)}
                      color={selectedProduct.currentStock <= selectedProduct.reorderLevel ? 'error' : 'success'}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Financial Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Financial Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Cost Price</Typography>
                    <Typography variant="h6" color="primary">
                      ₦{selectedProduct.costPrice.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Selling Price</Typography>
                    <Typography variant="h6" color="success.main">
                      ₦{selectedProduct.sellingPrice.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Total Value</Typography>
                    <Typography variant="h6" color="info.main">
                      ₦{selectedProduct.totalValue.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Profit Margin</Typography>
                    <Typography variant="h6" color="success.main">
                      {(((selectedProduct.sellingPrice - selectedProduct.costPrice) / selectedProduct.costPrice) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Recent Activity */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Last Sale</Typography>
                    <Typography variant="body1">
                      {new Date(selectedProduct.lastSale).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Last Restock</Typography>
                    <Typography variant="body1">
                      {new Date(selectedProduct.lastRestock).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {viewMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {viewMode === 'view' && (
            <Button variant="contained" onClick={() => setViewMode('edit')}>
              Edit Product
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
