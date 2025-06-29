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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Fab,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Category,
  Inventory,
} from '@mui/icons-material';

interface ItemCategory {
  id: string;
  name: string;
  description: string;
  type: 'asset' | 'consumable' | 'product' | 'service';
  parentCategory?: string;
  isActive: boolean;
  createdDate: string;
  depreciationMethod?: string;
}

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  type: 'asset' | 'consumable' | 'product' | 'service';
  unit: string;
  unitPrice?: number;
  minimumStock?: number;
  maximumStock?: number;
  reorderLevel?: number;
  supplier?: string;
  barcode?: string;
  isActive: boolean;
  createdDate: string;
}

const mockCategories: ItemCategory[] = [
  {
    id: 'CAT-001',
    name: 'Petroleum Products',
    description: 'Oil and gas products for energy operations',
    type: 'product',
    isActive: true,
    createdDate: '2024-01-15',
    depreciationMethod: 'N/A'
  },
  {
    id: 'CAT-002',
    name: 'Office Supplies',
    description: 'General office and administrative supplies',
    type: 'consumable',
    isActive: true,
    createdDate: '2024-01-15'
  },
  {
    id: 'CAT-003',
    name: 'IT Equipment',
    description: 'Computer hardware and technology assets',
    type: 'asset',
    isActive: true,
    createdDate: '2024-01-15',
    depreciationMethod: 'Straight Line'
  },
  {
    id: 'CAT-004',
    name: 'Industrial Equipment',
    description: 'Heavy machinery and industrial tools',
    type: 'asset',
    isActive: true,
    createdDate: '2024-01-15',
    depreciationMethod: 'Declining Balance'
  },
  {
    id: 'CAT-005',
    name: 'Professional Services',
    description: 'Consulting and professional service categories',
    type: 'service',
    isActive: true,
    createdDate: '2024-01-15'
  }
];

const mockItems: Item[] = [
  {
    id: 'ITM-001',
    name: 'AGO (Automotive Gas Oil)',
    description: 'Diesel fuel for vehicles and generators',
    category: 'Petroleum Products',
    type: 'product',
    unit: 'Liters',
    unitPrice: 850,
    minimumStock: 10000,
    maximumStock: 50000,
    reorderLevel: 15000,
    supplier: 'Energy Solutions Ltd',
    barcode: '123456789001',
    isActive: true,
    createdDate: '2024-02-01'
  },
  {
    id: 'ITM-002',
    name: 'Laptop - Dell Latitude 7420',
    description: 'Business laptop for office work',
    category: 'IT Equipment',
    type: 'asset',
    unit: 'Units',
    unitPrice: 1250000,
    minimumStock: 5,
    maximumStock: 20,
    reorderLevel: 8,
    supplier: 'TechSupply Ltd',
    barcode: '123456789002',
    isActive: true,
    createdDate: '2024-02-15'
  },
  {
    id: 'ITM-003',
    name: 'Printer Toner - HP LaserJet',
    description: 'Black toner cartridge for HP printers',
    category: 'Office Supplies',
    type: 'consumable',
    unit: 'Units',
    unitPrice: 25000,
    minimumStock: 10,
    maximumStock: 50,
    reorderLevel: 15,
    supplier: 'Office Depot',
    barcode: '123456789003',
    isActive: true,
    createdDate: '2024-02-20'
  },
  {
    id: 'ITM-004',
    name: 'PMS (Premium Motor Spirit)',
    description: 'Gasoline for company vehicles',
    category: 'Petroleum Products',
    type: 'product',
    unit: 'Liters',
    unitPrice: 750,
    minimumStock: 8000,
    maximumStock: 40000,
    reorderLevel: 12000,
    supplier: 'Energy Solutions Ltd',
    barcode: '123456789004',
    isActive: true,
    createdDate: '2024-02-25'
  }
];

const typeColors = {
  asset: 'primary' as const,
  consumable: 'secondary' as const,
  product: 'success' as const,
  service: 'info' as const,
};

const typeLabels = {
  asset: 'Asset',
  consumable: 'Consumable',
  product: 'Product',
  service: 'Service',
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`item-tabpanel-${index}`}
      aria-labelledby={`item-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ItemCategoryManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<ItemCategory[]>(mockCategories);
  const [items, setItems] = useState<Item[]>(mockItems);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Form state for category
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    type: 'product' as 'asset' | 'consumable' | 'product' | 'service',
    parentCategory: '',
    depreciationMethod: '',
    isActive: true
  });
  
  // Form state for item
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    category: '',
    type: 'product' as 'asset' | 'consumable' | 'product' | 'service',
    unit: '',
    unitPrice: '',
    minimumStock: '',
    maximumStock: '',
    reorderLevel: '',
    supplier: '',
    barcode: '',
    isActive: true
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCategoryOpen = (category?: ItemCategory) => {
    if (category) {
      setSelectedCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description,
        type: category.type,
        parentCategory: category.parentCategory || '',
        depreciationMethod: category.depreciationMethod || '',
        isActive: category.isActive
      });
    } else {
      setSelectedCategory(null);
      setCategoryForm({
        name: '',
        description: '',
        type: 'product',
        parentCategory: '',
        depreciationMethod: '',
        isActive: true
      });
    }
    setCategoryOpen(true);
  };

  const handleCategoryClose = () => {
    setCategoryOpen(false);
    setSelectedCategory(null);
  };

  const handleItemOpen = (item?: Item) => {
    if (item) {
      setSelectedItem(item);
      setItemForm({
        name: item.name,
        description: item.description,
        category: item.category,
        type: item.type,
        unit: item.unit,
        unitPrice: item.unitPrice?.toString() || '',
        minimumStock: item.minimumStock?.toString() || '',
        maximumStock: item.maximumStock?.toString() || '',
        reorderLevel: item.reorderLevel?.toString() || '',
        supplier: item.supplier || '',
        barcode: item.barcode || '',
        isActive: item.isActive
      });
    } else {
      setSelectedItem(null);
      setItemForm({
        name: '',
        description: '',
        category: '',
        type: 'product',
        unit: '',
        unitPrice: '',
        minimumStock: '',
        maximumStock: '',
        reorderLevel: '',
        supplier: '',
        barcode: '',
        isActive: true
      });
    }
    setItemOpen(true);
  };

  const handleItemClose = () => {
    setItemOpen(false);
    setSelectedItem(null);
  };

  const handleSaveCategory = () => {
    if (selectedCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === selectedCategory.id 
          ? { 
              ...cat, 
              ...categoryForm,
              depreciationMethod: categoryForm.type === 'asset' ? categoryForm.depreciationMethod : undefined
            }
          : cat
      ));
    } else {
      // Create new category
      const newCategory: ItemCategory = {
        id: `CAT-${String(categories.length + 1).padStart(3, '0')}`,
        ...categoryForm,
        createdDate: new Date().toISOString().split('T')[0],
        depreciationMethod: categoryForm.type === 'asset' ? categoryForm.depreciationMethod : undefined
      };
      setCategories(prev => [...prev, newCategory]);
    }
    handleCategoryClose();
  };

  const handleSaveItem = () => {
    if (selectedItem) {
      // Update existing item
      setItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              ...itemForm,
              unitPrice: itemForm.unitPrice ? parseFloat(itemForm.unitPrice) : undefined,
              minimumStock: itemForm.minimumStock ? parseInt(itemForm.minimumStock) : undefined,
              maximumStock: itemForm.maximumStock ? parseInt(itemForm.maximumStock) : undefined,
              reorderLevel: itemForm.reorderLevel ? parseInt(itemForm.reorderLevel) : undefined,
            }
          : item
      ));
    } else {
      // Create new item
      const newItem: Item = {
        id: `ITM-${String(items.length + 1).padStart(3, '0')}`,
        ...itemForm,
        unitPrice: itemForm.unitPrice ? parseFloat(itemForm.unitPrice) : undefined,
        minimumStock: itemForm.minimumStock ? parseInt(itemForm.minimumStock) : undefined,
        maximumStock: itemForm.maximumStock ? parseInt(itemForm.maximumStock) : undefined,
        reorderLevel: itemForm.reorderLevel ? parseInt(itemForm.reorderLevel) : undefined,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setItems(prev => [...prev, newItem]);
    }
    handleItemClose();
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const filteredItems = items.filter(item => {
    const categoryMatch = !filterCategory || item.category === filterCategory;
    const typeMatch = !filterType || item.type === filterType;
    return categoryMatch && typeMatch;
  });

  const activeCategories = categories.filter(cat => cat.isActive);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Item & Category Management
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Categories
            </Typography>
            <Typography variant="h4">
              {categories.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Items
            </Typography>
            <Typography variant="h4">
              {items.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Assets
            </Typography>
            <Typography variant="h4">
              {items.filter(item => item.type === 'asset').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Products
            </Typography>
            <Typography variant="h4">
              {items.filter(item => item.type === 'product').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Categories" icon={<Category />} />
          <Tab label="Items" icon={<Inventory />} />
        </Tabs>
      </Box>

      {/* Categories Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Item Categories
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleCategoryOpen()}
            sx={{ borderRadius: 2 }}
          >
            Add Category
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Depreciation</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {category.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {category.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={typeLabels[category.type]}
                      color={typeColors[category.type]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {category.depreciationMethod || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.isActive ? 'Active' : 'Inactive'}
                      color={category.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{category.createdDate}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleCategoryOpen(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteCategory(category.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Items Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Items
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleItemOpen()}
            sx={{ borderRadius: 2 }}
          >
            Add Item
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <FilterList />
            <TextField
              select
              label="Filter by Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {activeCategories.map((category) => (
                <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Filter by Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              size="small"
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="asset">Asset</MenuItem>
              <MenuItem value="consumable">Consumable</MenuItem>
              <MenuItem value="product">Product</MenuItem>
              <MenuItem value="service">Service</MenuItem>
            </TextField>
          </Stack>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Min Stock</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {item.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={typeLabels[item.type]}
                      color={typeColors[item.type]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    {item.unitPrice ? `₦${item.unitPrice.toLocaleString()}` : 'N/A'}
                  </TableCell>
                  <TableCell>{item.minimumStock || 'N/A'}</TableCell>
                  <TableCell>{item.supplier || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.isActive ? 'Active' : 'Inactive'}
                      color={item.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleItemOpen(item)}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleItemOpen(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteItem(item.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Category Create/Edit Dialog */}
      <Dialog open={categoryOpen} onClose={handleCategoryClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              variant="outlined"
              required
            />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 250px' }}
                select
                label="Category Type"
                value={categoryForm.type}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, type: e.target.value as any }))}
                variant="outlined"
                required
              >
                <MenuItem value="asset">Asset</MenuItem>
                <MenuItem value="consumable">Consumable</MenuItem>
                <MenuItem value="product">Product</MenuItem>
                <MenuItem value="service">Service</MenuItem>
              </TextField>
              <TextField
                sx={{ flex: '1 1 250px' }}
                select
                label="Depreciation Method"
                value={categoryForm.depreciationMethod}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, depreciationMethod: e.target.value }))}
                variant="outlined"
                helperText="For assets only"
                disabled={categoryForm.type !== 'asset'}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Straight Line">Straight Line</MenuItem>
                <MenuItem value="Declining Balance">Declining Balance</MenuItem>
                <MenuItem value="Units of Production">Units of Production</MenuItem>
              </TextField>
            </Box>
            <TextField
              select
              label="Parent Category"
              value={categoryForm.parentCategory}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, parentCategory: e.target.value }))}
              variant="outlined"
              fullWidth
              helperText="Optional - for subcategories"
            >
              <MenuItem value="">None (Main Category)</MenuItem>
              {categories.filter(cat => cat.id !== selectedCategory?.id).map((category) => (
                <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCategoryClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCategory}>
            {selectedCategory ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Item Create/Edit Dialog */}
      <Dialog open={itemOpen} onClose={handleItemClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Item' : 'Create New Item'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 300px' }}
                label="Item Name"
                value={itemForm.name}
                onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                variant="outlined"
                required
              />
              <TextField
                sx={{ flex: '1 1 200px' }}
                label="Barcode/SKU"
                value={itemForm.barcode}
                onChange={(e) => setItemForm(prev => ({ ...prev, barcode: e.target.value }))}
                variant="outlined"
              />
            </Box>
            <TextField
              fullWidth
              label="Description"
              value={itemForm.description}
              onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={2}
              variant="outlined"
              required
            />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 250px' }}
                select
                label="Category"
                value={itemForm.category}
                onChange={(e) => setItemForm(prev => ({ ...prev, category: e.target.value }))}
                variant="outlined"
                required
              >
                {activeCategories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                sx={{ flex: '1 1 200px' }}
                select
                label="Item Type"
                value={itemForm.type}
                onChange={(e) => setItemForm(prev => ({ ...prev, type: e.target.value as any }))}
                variant="outlined"
                required
              >
                <MenuItem value="asset">Asset</MenuItem>
                <MenuItem value="consumable">Consumable</MenuItem>
                <MenuItem value="product">Product</MenuItem>
                <MenuItem value="service">Service</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 150px' }}
                label="Unit of Measure"
                value={itemForm.unit}
                onChange={(e) => setItemForm(prev => ({ ...prev, unit: e.target.value }))}
                variant="outlined"
                required
                helperText="e.g., Units, Liters, Kg"
              />
              <TextField
                sx={{ flex: '1 1 200px' }}
                label="Unit Price (₦)"
                value={itemForm.unitPrice}
                onChange={(e) => setItemForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                type="number"
                variant="outlined"
              />
              <TextField
                sx={{ flex: '1 1 200px' }}
                label="Supplier"
                value={itemForm.supplier}
                onChange={(e) => setItemForm(prev => ({ ...prev, supplier: e.target.value }))}
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 150px' }}
                label="Minimum Stock"
                value={itemForm.minimumStock}
                onChange={(e) => setItemForm(prev => ({ ...prev, minimumStock: e.target.value }))}
                type="number"
                variant="outlined"
              />
              <TextField
                sx={{ flex: '1 1 150px' }}
                label="Maximum Stock"
                value={itemForm.maximumStock}
                onChange={(e) => setItemForm(prev => ({ ...prev, maximumStock: e.target.value }))}
                type="number"
                variant="outlined"
              />
              <TextField
                sx={{ flex: '1 1 150px' }}
                label="Reorder Level"
                value={itemForm.reorderLevel}
                onChange={(e) => setItemForm(prev => ({ ...prev, reorderLevel: e.target.value }))}
                type="number"
                variant="outlined"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleItemClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveItem}>
            {selectedItem ? 'Update Item' : 'Create Item'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Buttons */}
      <Fab
        color="primary"
        aria-label="add-category"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => handleCategoryOpen()}
      >
        <Category />
      </Fab>
      <Fab
        color="secondary"
        aria-label="add-item"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleItemOpen()}
      >
        <Add />
      </Fab>
    </Box>
  );
}
