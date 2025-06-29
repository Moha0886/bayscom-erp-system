# BAYSCOM ERP Staff Requisition System

## 🎯 Overview

The Staff Requisition System enables employees to request consumable items from the inventory, with a structured approval workflow involving department supervisors and admin department approval.

## 📋 Workflow Process

### 1. **Staff Request Submission**
- Staff members access **Inventory → Staff Requisitions**
- Fill out requisition form with:
  - Personal details (Name, Staff ID, Department)
  - Purpose and urgency level
  - Requested items with quantities and justifications
- Submit request for supervisor review

### 2. **Supervisor Review**
- Department supervisors access **Inventory → Approve Requisitions**
- Review pending requests from their department
- Can:
  - **Approve** with comments → Forwards to Admin
  - **Reject** with reason → Returns to staff
- View complete request details and workflow status

### 3. **Admin Department Approval**
- Admin users access **Inventory → Approve Requisitions**
- Review supervisor-approved requests
- Final approval authority for:
  - Budget allocation
  - Resource availability
  - Policy compliance

### 4. **Completion & Fulfillment**
- Approved requests move to completion status
- Integration with inventory management
- Automatic stock level updates

## 🚀 Key Features

### **For Staff (Requesters)**
- **Multi-item Requests**: Add multiple consumables in one requisition
- **Smart Item Selection**: Autocomplete with cost and stock information
- **Justification Required**: Each item requires business justification
- **Urgency Levels**: Low, Medium, High, Urgent priorities
- **Real-time Tracking**: View request status and workflow progress

### **For Supervisors & Admins**
- **Dashboard Overview**: Pending count, high priority alerts, total values
- **Workflow Visualization**: Step-by-step approval progress
- **Batch Processing**: Efficient approval of multiple requests
- **Comment System**: Add approval/rejection notes
- **Role-based Access**: Supervisors see department requests, Admins see all

### **System Features**
- **Nigerian Business Context**: Naira currency, local departments
- **Mobile Responsive**: Works on desktop, tablet, and mobile
- **Export Functionality**: Download reports and requisition PDFs
- **Audit Trail**: Complete history of all actions and comments

## 📊 Sample Data Included

### **Available Consumables**
- Office Supplies (A4 Paper, Printer Cartridges)
- Safety Equipment (Helmets, First Aid Kits)
- Tools & Equipment (Drill Bits, Hydraulic Oil)
- IT Supplies (Office Chairs, Cleaning Supplies)

### **Mock Departments**
- Engineering, Operations, Finance
- Human Resources, Procurement, Logistics
- IT, Quality Assurance, Health & Safety

## 🎨 User Interface

### **Modern Design**
- Material-UI components with Nigerian business styling
- Intuitive navigation with expandable menus
- Summary cards showing key metrics
- Professional tables with sorting and filtering

### **Status Tracking**
- **Pending**: Just submitted, awaiting supervisor review
- **Supervisor Review**: Under department supervisor evaluation
- **Supervisor Approved**: Forwarded to admin department
- **Admin Review**: Under final administrative review
- **Admin Approved**: Approved and ready for fulfillment
- **Completed**: Fulfilled and closed

## 🔧 Navigation Structure

```
Inventory
├── Assets
├── Consumables
├── Products
├── Staff Requisitions      ← New: Submit requests
└── Approve Requisitions    ← New: Review & approve
```

## 💡 Business Benefits

1. **Streamlined Process**: Eliminates paper-based requisitions
2. **Approval Transparency**: Clear workflow with audit trail
3. **Cost Control**: Budget visibility and approval gates
4. **Inventory Management**: Integration with stock levels
5. **Compliance**: Structured approval ensuring policy adherence
6. **Reporting**: Analytics on spending patterns and trends

## 🚀 Getting Started

1. **Staff**: Navigate to Inventory → Staff Requisitions → New Requisition
2. **Supervisors**: Check Inventory → Approve Requisitions for pending reviews
3. **Admins**: Monitor all requests through the approval dashboard

The system is now live and ready for use in your BAYSCOM ERP environment!

---

*This system integrates seamlessly with the existing BAYSCOM ERP inventory management, providing a complete end-to-end solution for consumable requisitions in Nigerian business operations.*
