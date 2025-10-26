// Tenant types
export interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  unitNumber: string
  leaseStartDate: string
  leaseEndDate: string
  rentAmount: number
  depositAmount: number
  petPolicy: string
  notes: string
  createdAt: string
  updatedAt: string
}

// Rent payment types
export interface RentPayment {
  id: string
  tenantId: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "paid" | "pending" | "overdue"
  notes: string
  createdAt: string
  updatedAt: string
}

// Maintenance request types
export interface MaintenanceRequest {
  id: string
  tenantId: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "completed" | "cancelled"
  estimatedCost?: number
  actualCost?: number
  assignedVendor?: string
  photos: string[]
  createdAt: string
  updatedAt: string
}

// Document types
export interface Document {
  id: string
  tenantId?: string
  title: string
  type: "lease" | "inspection" | "photo" | "other"
  fileUrl: string
  uploadedAt: string
  extractedData?: Record<string, unknown>
}

// Communication log types
export interface CommunicationLog {
  id: string
  tenantId: string
  type: "email" | "phone" | "in-person" | "message"
  subject: string
  content: string
  createdAt: string
}

// Dashboard stats
export interface DashboardStats {
  totalTenants: number
  totalUnits: number
  monthlyIncome: number
  pendingPayments: number
  overduePayments: number
  openMaintenanceRequests: number
}
