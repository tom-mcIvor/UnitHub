import { z } from "zod"

export const tenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  unitNumber: z.string().min(1, "Unit number is required"),
  leaseStartDate: z.string().min(1, "Lease start date is required"),
  leaseEndDate: z.string().min(1, "Lease end date is required"),
  rentAmount: z.number().positive("Rent amount must be positive"),
  depositAmount: z.number().nonnegative("Deposit must be non-negative"),
  petPolicy: z.string().optional(),
  notes: z.string().optional(),
})

export const rentPaymentSchema = z.object({
  tenantId: z.string().min(1, "Tenant is required"),
  amount: z.number().positive("Amount must be positive"),
  dueDate: z.string().min(1, "Due date is required"),
  paidDate: z.string().optional(),
  status: z.enum(["paid", "pending", "overdue"]),
  notes: z.string().optional(),
})

export const maintenanceRequestSchema = z.object({
  tenantId: z.string().min(1, "Tenant is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  estimatedCost: z.number().nonnegative().optional(),
  assignedVendor: z.string().optional(),
})

export const communicationLogSchema = z.object({
  tenantId: z.string().min(1, "Tenant is required"),
  type: z.enum(["email", "phone", "in-person", "message"]),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
})

export const documentMetadataSchema = z.object({
  tenantId: z.union([z.string().min(1, "Tenant is required"), z.literal(""), z.undefined()]).optional(),
  title: z.string().min(1, "Title is required"),
  type: z.enum(["lease", "inspection", "photo", "other"]),
  fileUrl: z.string().min(1, "File URL is required"),
})

export type TenantFormData = z.infer<typeof tenantSchema>
export type RentPaymentFormData = z.infer<typeof rentPaymentSchema>
export type MaintenanceRequestFormData = z.infer<typeof maintenanceRequestSchema>
export type CommunicationLogFormData = z.infer<typeof communicationLogSchema>
export type DocumentFormData = z.infer<typeof documentMetadataSchema>
