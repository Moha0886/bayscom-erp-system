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
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Phone,
  Email,
  LocationOn,
  Business,
} from '@mui/icons-material';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  totalOrders: number;
  totalValue: number;
}

const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Energy Solutions Ltd',
    contactPerson: 'John Smith',
    email: 'john@energysolutions.com',
    phone: '+1-555-0123',
    address: '123 Industrial Ave, Houston, TX',
    category: 'Equipment',
    status: 'active',
    rating: 4.8,
    totalOrders: 15,
    totalValue: 450000
  },
  {
    id: 'SUP-002',
    name: 'Industrial Equipment Co',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@indequip.com',
    phone: '+1-555-0124',
    address: '456 Factory St, Dallas, TX',
    category: 'Machinery',
    status: 'active',
    rating: 4.5,
    totalOrders: 22,
    totalValue: 675000
  },
  {
    id: 'SUP-003',
    name: 'Oil Field Services',
    contactPerson: 'Mike Wilson',
    email: 'mike@oilfield.com',
    phone: '+1-555-0125',
    address: '789 Energy Blvd, Austin, TX',
    category: 'Services',
    status: 'active',
    rating: 4.2,
    totalOrders: 8,
    totalValue: 230000
  },
  {
    id: 'SUP-004',
    name: 'Safety Equipment Inc',
    contactPerson: 'Lisa Brown',
    email: 'lisa@safetyequip.com',
    phone: '+1-555-0126',
    address: '321 Safety Dr, San Antonio, TX',
    category: 'Safety',
    status: 'pending',
    rating: 0,
    totalOrders: 0,
    totalValue: 0
  },
];

const statusColors = {
  active: 'success' as const,
  inactive: 'error' as const,
  pending: 'warning' as const,
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const handleCreateSupplier = () => {
    setSelectedSupplier(null);
    setOpenDialog(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSupplier(null);
  };

  const SupplierCard = ({ supplier }: { supplier: Supplier }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <Business />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {supplier.name}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {supplier.contactPerson}
            </Typography>
          </Box>
          <Chip
            label={supplier.status.toUpperCase()}
            color={statusColors[supplier.status]}
            size="small"
          />
        </Box>
        
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">{supplier.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">{supplier.phone}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">{supplier.address}</Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Total Orders: {supplier.totalOrders}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Value: ${supplier.totalValue.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={() => handleEditSupplier(supplier)}>
              <Visibility />
            </IconButton>
            <IconButton size="small" onClick={() => handleEditSupplier(supplier)}>
              <Edit />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Suppliers
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('cards')}
          >
            Card View
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateSupplier}
          >
            Add Supplier
          </Button>
        </Stack>
      </Box>

      {viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Orders</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} hover>
                  <TableCell sx={{ fontWeight: 'medium' }}>{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>
                    <Chip
                      label={supplier.status.toUpperCase()}
                      color={statusColors[supplier.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{supplier.totalOrders}</TableCell>
                  <TableCell>${supplier.totalValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEditSupplier(supplier)}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEditSupplier(supplier)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Company Name"
              fullWidth
              defaultValue={selectedSupplier?.name || ''}
            />
            <TextField
              label="Contact Person"
              fullWidth
              defaultValue={selectedSupplier?.contactPerson || ''}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                defaultValue={selectedSupplier?.email || ''}
              />
              <TextField
                label="Phone"
                fullWidth
                defaultValue={selectedSupplier?.phone || ''}
              />
            </Stack>
            <TextField
              label="Address"
              multiline
              rows={2}
              fullWidth
              defaultValue={selectedSupplier?.address || ''}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Category"
                fullWidth
                defaultValue={selectedSupplier?.category || 'Equipment'}
              >
                <MenuItem value="Equipment">Equipment</MenuItem>
                <MenuItem value="Machinery">Machinery</MenuItem>
                <MenuItem value="Services">Services</MenuItem>
                <MenuItem value="Safety">Safety</MenuItem>
                <MenuItem value="Materials">Materials</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                fullWidth
                defaultValue={selectedSupplier?.status || 'pending'}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            {selectedSupplier ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}