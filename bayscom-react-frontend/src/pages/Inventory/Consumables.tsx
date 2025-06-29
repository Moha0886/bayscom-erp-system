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
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Search,
  Download,
  Warning,
  Inventory2,
  Category,
  LocalShipping,
} from '@mui/icons-material';

interface Consumable {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  unitCost: number;
  totalValue: number;
  supplier: string;
  location: string;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'reorder';
}

const mockConsumables: Consumable[] = [
  {
    id: 'CON001',
    name: 'A4 Copy Paper',
    category: 'Office Supplies',
    description: 'White A4 copy paper, 80gsm',
    unit: 'Ream',
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    reorderLevel: 25,
    unitCost: 2500,
    totalValue: 112500,
    supplier: 'Office Solutions Ltd',
    location: 'Store Room A',
    lastRestocked: '2024-12-15',
    status: 'in-stock',
  },
  {
    id: 'CON002',
    name: 'Drill Bits Set',
    category: 'Tools & Equipment',
    description: 'High-speed steel drill bits, various sizes',
    unit: 'Set',
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    reorderLevel: 15,
    unitCost: 15000,
    totalValue: 120000,
    supplier: 'Industrial Tools Co',
    location: 'Warehouse B',
    lastRestocked: '2024-11-28',
    status: 'low-stock',
  },
  {
    id: 'CON003',
    name: 'Safety Helmets',
    category: 'Safety Equipment',
    description: 'Hard hat safety helmets, ANSI certified',
    unit: 'Piece',
    currentStock: 0,
    minStock: 25,
    maxStock: 100,
    reorderLevel: 30,
    unitCost: 8500,
    totalValue: 0,
    supplier: 'Safety First Ltd',
    location: 'Safety Store',
    lastRestocked: '2024-10-20',
    status: 'out-of-stock',
  },
  {
    id: 'CON004',
    name: 'Hydraulic Oil',
    category: 'Maintenance',
    description: 'ISO 46 hydraulic oil for machinery',
    unit: 'Liter',
    currentStock: 185,
    minStock: 200,
    maxStock: 500,
    reorderLevel: 200,
    unitCost: 1200,
    totalValue: 222000,
    supplier: 'Petrotech Industries',
    location: 'Chemical Store',
    lastRestocked: '2024-12-10',
    status: 'reorder',
  },
  {
    id: 'CON005',
    name: 'Printer Cartridges',
    category: 'Office Supplies',
    description: 'HP LaserJet toner cartridges, black',
    unit: 'Piece',
    currentStock: 12,
    minStock: 8,
    maxStock: 30,
    reorderLevel: 10,
    unitCost: 25000,
    totalValue: 300000,
    supplier: 'Tech Supplies Nigeria',
    location: 'IT Store',
    lastRestocked: '2024-12-18',
    status: 'in-stock',
  },
];

const statusColors = {
  'in-stock': 'success' as const,
  'low-stock': 'warning' as const,
  'out-of-stock': 'error' as const,
  'reorder': 'info' as const,
};

const categories = ['All Categories', 'Office Supplies', 'Tools & Equipment', 'Safety Equipment', 'Maintenance'];
const locations = ['All Locations', 'Store Room A', 'Warehouse B', 'Safety Store', 'Chemical Store', 'IT Store'];

export default function Consumables() {
  const [consumables] = useState<Consumable[]>(mockConsumables);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedConsumable, setSelectedConsumable] = useState<Consumable | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'add'>('view');

  // Filter consumables
  const filteredConsumables = consumables.filter(consumable => {
    const matchesSearch = consumable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumable.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || consumable.category === categoryFilter;
    const matchesLocation = locationFilter === 'All Locations' || consumable.location === locationFilter;
    const matchesStatus = statusFilter === 'All Status' || consumable.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  // Calculate summary metrics
  const totalItems = consumables.length;
  const lowStockItems = consumables.filter(c => c.status === 'low-stock' || c.status === 'out-of-stock').length;
  const outOfStockItems = consumables.filter(c => c.status === 'out-of-stock').length;
  const reorderItems = consumables.filter(c => c.status === 'reorder').length;
  const totalValue = consumables.reduce((sum, consumable) => sum + consumable.totalValue, 0);

  const handleViewConsumable = (consumable: Consumable) => {
    setSelectedConsumable(consumable);
    setViewMode('view');
    setDialogOpen(true);
  };

  const handleAddConsumable = () => {
    setSelectedConsumable(null);
    setViewMode('add');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedConsumable(null);
    setViewMode('view');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Consumables Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddConsumable}
          size="large"
        >
          Add Consumable
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
            <Typography color="textSecondary" gutterBottom>Total Items</Typography>
            <Typography variant="h4">{totalItems}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Low Stock</Typography>
            <Typography variant="h4" color="warning.main">{lowStockItems}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Out of Stock</Typography>
            <Typography variant="h4" color="error.main">{outOfStockItems}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Reorder Required</Typography>
            <Typography variant="h4" color="info.main">{reorderItems}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Value</Typography>
            <Typography variant="h5">₦{totalValue.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Alerts */}
      {(outOfStockItems > 0 || reorderItems > 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body1">
            <strong>Attention Required:</strong> {outOfStockItems} item(s) out of stock, {reorderItems} item(s) need reordering.
          </Typography>
        </Alert>
      )}

      {/* Filters */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search consumables..."
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
          sx={{ minWidth: 160 }}
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
          <MenuItem value="in-stock">In Stock</MenuItem>
          <MenuItem value="low-stock">Low Stock</MenuItem>
          <MenuItem value="out-of-stock">Out of Stock</MenuItem>
          <MenuItem value="reorder">Reorder</MenuItem>
        </TextField>
        <Button
          variant="outlined"
          startIcon={<Download />}
          sx={{ minWidth: 120 }}
        >
          Export
        </Button>
      </Stack>

      {/* Consumables Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Min/Max Stock</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>Total Value</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConsumables.map((consumable) => (
              <TableRow key={consumable.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{consumable.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {consumable.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{consumable.category}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {consumable.currentStock} {consumable.unit}
                  </Typography>
                  {consumable.currentStock <= consumable.reorderLevel && (
                    <Warning color="warning" fontSize="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {consumable.minStock} - {consumable.maxStock} {consumable.unit}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Reorder at: {consumable.reorderLevel}
                  </Typography>
                </TableCell>
                <TableCell>₦{consumable.unitCost.toLocaleString()}</TableCell>
                <TableCell>₦{consumable.totalValue.toLocaleString()}</TableCell>
                <TableCell>{consumable.location}</TableCell>
                <TableCell>
                  <Chip
                    label={consumable.status.replace('-', ' ').toUpperCase()}
                    color={statusColors[consumable.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewConsumable(consumable)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedConsumable(consumable);
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

      {/* Consumable Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {viewMode === 'add' 
            ? 'Add New Consumable' 
            : viewMode === 'edit' 
            ? 'Edit Consumable' 
            : 'Consumable Details'
          }
        </DialogTitle>
        <DialogContent>
          {selectedConsumable && viewMode === 'view' && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              {/* Basic Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory2 /> Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Item Name</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedConsumable.name}</Typography>
                    
                    <Typography variant="subtitle2">Description</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedConsumable.description}</Typography>
                    
                    <Typography variant="subtitle2">Category</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedConsumable.category}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Unit of Measure</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedConsumable.unit}</Typography>
                    
                    <Typography variant="subtitle2">Supplier</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedConsumable.supplier}</Typography>
                    
                    <Typography variant="subtitle2">Location</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedConsumable.location}</Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Stock Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category /> Stock Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Current Stock</Typography>
                    <Typography variant="h6" color={
                      selectedConsumable.currentStock <= selectedConsumable.reorderLevel ? 'error' : 'success.main'
                    }>
                      {selectedConsumable.currentStock} {selectedConsumable.unit}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Minimum Stock</Typography>
                    <Typography variant="body1">{selectedConsumable.minStock} {selectedConsumable.unit}</Typography>
                    
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>Maximum Stock</Typography>
                    <Typography variant="body1">{selectedConsumable.maxStock} {selectedConsumable.unit}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Reorder Level</Typography>
                    <Typography variant="body1">{selectedConsumable.reorderLevel} {selectedConsumable.unit}</Typography>
                    
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>Status</Typography>
                    <Chip
                      label={selectedConsumable.status.replace('-', ' ').toUpperCase()}
                      color={statusColors[selectedConsumable.status]}
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Financial Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Financial Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Unit Cost</Typography>
                    <Typography variant="h6" color="primary">
                      ₦{selectedConsumable.unitCost.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Total Value</Typography>
                    <Typography variant="h6" color="success.main">
                      ₦{selectedConsumable.totalValue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Recent Activity */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShipping /> Recent Activity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="subtitle2">Last Restocked</Typography>
                  <Typography variant="body1">
                    {new Date(selectedConsumable.lastRestocked).toLocaleDateString()}
                  </Typography>
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
              Edit Item
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
