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
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Warning,
  TrendingDown,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  location: string;
  lastUpdated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstocked';
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: 'INV-001',
    name: 'Industrial Pump',
    sku: 'IP-001',
    category: 'Equipment',
    currentStock: 15,
    minStock: 10,
    maxStock: 50,
    unitPrice: 2500,
    location: 'Warehouse A-1',
    lastUpdated: '2024-06-25',
    status: 'in-stock'
  },
  {
    id: 'INV-002',
    name: 'Safety Helmets',
    sku: 'SH-002',
    category: 'Safety',
    currentStock: 5,
    minStock: 20,
    maxStock: 100,
    unitPrice: 45,
    location: 'Warehouse B-2',
    lastUpdated: '2024-06-24',
    status: 'low-stock'
  },
  {
    id: 'INV-003',
    name: 'Steel Pipes',
    sku: 'SP-003',
    category: 'Materials',
    currentStock: 0,
    minStock: 50,
    maxStock: 200,
    unitPrice: 125,
    location: 'Warehouse C-1',
    lastUpdated: '2024-06-23',
    status: 'out-of-stock'
  },
  {
    id: 'INV-004',
    name: 'Lubricant Oil',
    sku: 'LO-004',
    category: 'Supplies',
    currentStock: 85,
    minStock: 20,
    maxStock: 60,
    unitPrice: 35,
    location: 'Warehouse A-3',
    lastUpdated: '2024-06-22',
    status: 'overstocked'
  },
];

const statusColors = {
  'in-stock': 'success' as const,
  'low-stock': 'warning' as const,
  'out-of-stock': 'error' as const,
  'overstocked': 'info' as const,
};

const getStockLevel = (current: number, min: number, max: number) => {
  if (current === 0) return 'out-of-stock';
  if (current < min) return 'low-stock';
  if (current > max) return 'overstocked';
  return 'in-stock';
};

const getStockPercentage = (current: number, max: number) => {
  return Math.min((current / max) * 100, 100);
};

export default function InventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredItems = items.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const lowStockItems = items.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock');
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Inventory Management
      </Typography>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {lowStockItems.length} item(s) require attention (low stock or out of stock)
        </Alert>
      )}

      {/* Summary Cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {items.length}
              </Typography>
            </Box>
            <InventoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${totalValue.toLocaleString()}
              </Typography>
            </Box>
            <InventoryIcon sx={{ fontSize: 40, color: 'success.main' }} />
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {lowStockItems.length}
              </Typography>
            </Box>
            <Warning sx={{ fontSize: 40, color: 'warning.main' }} />
          </Box>
        </Paper>
      </Stack>

      {/* Filters and Actions */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="Equipment">Equipment</MenuItem>
            <MenuItem value="Safety">Safety</MenuItem>
            <MenuItem value="Materials">Materials</MenuItem>
            <MenuItem value="Supplies">Supplies</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="in-stock">In Stock</MenuItem>
            <MenuItem value="low-stock">Low Stock</MenuItem>
            <MenuItem value="out-of-stock">Out of Stock</MenuItem>
            <MenuItem value="overstocked">Overstocked</MenuItem>
          </TextField>
        </Stack>
        <Button variant="contained" startIcon={<Add />}>
          Add Item
        </Button>
      </Stack>

      {/* Inventory Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Stock Level</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total Value</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {item.currentStock} / {item.maxStock}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getStockPercentage(item.currentStock, item.maxStock)}
                      sx={{ mt: 0.5, height: 4 }}
                      color={item.status === 'in-stock' ? 'success' : item.status === 'low-stock' ? 'warning' : 'error'}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    Min: {item.minStock} | Max: {item.maxStock}
                  </Typography>
                </TableCell>
                <TableCell>${item.unitPrice}</TableCell>
                <TableCell>${(item.currentStock * item.unitPrice).toLocaleString()}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status.replace('-', ' ').toUpperCase()}
                    color={statusColors[item.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Visibility />
                  </IconButton>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
