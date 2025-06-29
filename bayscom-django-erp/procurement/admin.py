from django.contrib import admin
from .models import (
    Department, ItemCategory, Item, Supplier, PurchaseRequisition,
    RequestForQuotation, SupplierQuotation, BidAnalysis, PurchaseOrder, PurchaseOrderItem
)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'manager', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'code']

@admin.register(ItemCategory)
class ItemCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'category', 'unit_of_measure', 'standard_price', 'is_active']
    list_filter = ['category', 'unit_of_measure', 'is_active']
    search_fields = ['code', 'name']

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_person', 'email', 'phone', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'contact_person', 'email']

@admin.register(PurchaseRequisition)
class PurchaseRequisitionAdmin(admin.ModelAdmin):
    list_display = ['requisition_number', 'title', 'department', 'status', 'requested_by', 'request_date']
    list_filter = ['status', 'department', 'request_date']
    search_fields = ['requisition_number', 'title']

@admin.register(RequestForQuotation)
class RequestForQuotationAdmin(admin.ModelAdmin):
    list_display = ['rfq_number', 'title', 'status', 'created_by', 'submission_deadline']
    list_filter = ['status', 'submission_deadline']
    search_fields = ['rfq_number', 'title']

@admin.register(SupplierQuotation)
class SupplierQuotationAdmin(admin.ModelAdmin):
    list_display = ['quotation_number', 'supplier', 'rfq', 'status', 'total_amount', 'submission_date']
    list_filter = ['status', 'submission_date']
    search_fields = ['quotation_number', 'supplier__name']

@admin.register(BidAnalysis)
class BidAnalysisAdmin(admin.ModelAdmin):
    list_display = ['rfq', 'analyzed_by', 'selected_supplier', 'analysis_date']
    list_filter = ['analysis_date']
    search_fields = ['rfq__rfq_number']

class PurchaseOrderItemInline(admin.TabularInline):
    model = PurchaseOrderItem
    extra = 1

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ['po_number', 'supplier', 'status', 'order_date', 'total_amount', 'created_by']
    list_filter = ['status', 'order_date']
    search_fields = ['po_number', 'supplier__name']
    inlines = [PurchaseOrderItemInline]
