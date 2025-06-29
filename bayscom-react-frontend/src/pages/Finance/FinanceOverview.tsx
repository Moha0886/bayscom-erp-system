import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  TextField,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Receipt,
  Payment,
  CreditCard,
} from '@mui/icons-material';

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  reference: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    date: '2024-06-25',
    description: 'Equipment Purchase - Industrial Pump',
    type: 'expense',
    category: 'Equipment',
    amount: 15000,
    status: 'completed',
    reference: 'PO-2024-001'
  },
  {
    id: 'TXN-002',
    date: '2024-06-24',
    description: 'Service Revenue - Oil Field Consulting',
    type: 'income',
    category: 'Services',
    amount: 45000,
    status: 'completed',
    reference: 'INV-2024-012'
  },
  {
    id: 'TXN-003',
    date: '2024-06-23',
    description: 'Staff Payroll - June 2024',
    type: 'expense',
    category: 'Payroll',
    amount: 125000,
    status: 'pending',
    reference: 'PAY-2024-06'
  },
  {
    id: 'TXN-004',
    date: '2024-06-22',
    description: 'Equipment Rental Income',
    type: 'income',
    category: 'Equipment',
    amount: 8500,
    status: 'completed',
    reference: 'RENT-2024-003'
  },
];

const statusColors = {
  pending: 'warning' as const,
  completed: 'success' as const,
  cancelled: 'error' as const,
};

export default function FinanceOverview() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTransactions = transactions.filter(txn => {
    const typeMatch = filterType === 'all' || txn.type === filterType;
    const statusMatch = filterStatus === 'all' || txn.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const totalIncome = transactions
    .filter(txn => txn.type === 'income' && txn.status === 'completed')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalExpenses = transactions
    .filter(txn => txn.type === 'expense' && txn.status === 'completed')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Finance Overview
      </Typography>

      {/* Financial Summary Cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  ${totalIncome.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUp color="success" />
                  <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                    12.5% from last month
                  </Typography>
                </Box>
              </Box>
              <Receipt sx={{ fontSize: 40, color: 'success.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  ${totalExpenses.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUp color="error" />
                  <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                    8.3% from last month
                  </Typography>
                </Box>
              </Box>
              <CreditCard sx={{ fontSize: 40, color: 'error.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Net Profit
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: netProfit >= 0 ? 'success.main' : 'error.main' 
                  }}
                >
                  ${netProfit.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {netProfit >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                  <Typography 
                    variant="body2" 
                    color={netProfit >= 0 ? 'success.main' : 'error.main'} 
                    sx={{ ml: 0.5 }}
                  >
                    {profitMargin.toFixed(1)}% margin
                  </Typography>
                </Box>
              </Box>
              <AccountBalance sx={{ fontSize: 40, color: netProfit >= 0 ? 'success.main' : 'error.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Filters and Actions */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Transaction Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
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
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined">
            Export Report
          </Button>
          <Button variant="contained">
            Add Transaction
          </Button>
        </Stack>
      </Stack>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{transaction.id}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type.toUpperCase()}
                    color={transaction.type === 'income' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: transaction.type === 'income' ? 'success.main' : 'error.main',
                      fontWeight: 'medium'
                    }}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.status.toUpperCase()}
                    color={statusColors[transaction.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{transaction.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
