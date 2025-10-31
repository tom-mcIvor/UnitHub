import { POST } from '../suggest-vendor/route'
import { createJsonRequest } from '../test-utils'

// Mock the AI generateText function
jest.mock('ai', () => ({
  generateText: jest.fn(),
}))

import { generateText } from 'ai'

describe('POST /api/ai/suggest-vendor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('successful vendor suggestions', () => {
    it('should suggest vendors for plumbing issues', async () => {
      // Arrange
      const mockResponse = {
        suggestions: [
          {
            vendorType: 'Licensed Plumber',
            reason: 'Specialized in leak repairs and pipe replacement',
          },
          {
            vendorType: 'General Contractor',
            reason: 'Can handle plumbing along with any related repairs',
          },
          {
            vendorType: 'Emergency Plumbing Service',
            reason: 'Available for urgent repairs and water damage prevention',
          },
        ],
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = createJsonRequest({
        category: 'Plumbing',
        priority: 'high',
        description: 'Pipe leaking in kitchen',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.suggestions).toHaveLength(3)
      expect(data.suggestions[0]).toHaveProperty('vendorType')
      expect(data.suggestions[0]).toHaveProperty('reason')
      expect(data.suggestions[0].vendorType).toContain('Plumber')
    })

    it('should suggest vendors for electrical work', async () => {
      // Arrange
      const mockResponse = {
        suggestions: [
          {
            vendorType: 'Licensed Electrician',
            reason: 'Required for safe electrical repairs and code compliance',
          },
          {
            vendorType: 'Electrical Contractor',
            reason: 'Can handle complex wiring and panel upgrades',
          },
          {
            vendorType: 'Emergency Electrician',
            reason: 'Available for urgent electrical hazards',
          },
        ],
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = createJsonRequest({
        category: 'Electrical',
        priority: 'urgent',
        description: 'Outlet sparking',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.suggestions).toHaveLength(3)
      expect(data.suggestions[0].vendorType).toContain('Electrician')
    })

    it('should suggest vendors for HVAC maintenance', async () => {
      // Arrange
      const mockResponse = {
        suggestions: [
          {
            vendorType: 'HVAC Technician',
            reason: 'Specialized in heating and cooling system repairs',
          },
          {
            vendorType: 'Climate Control Specialist',
            reason: 'Expert in diagnosing and fixing temperature control issues',
          },
          {
            vendorType: 'Furnace Repair Service',
            reason: 'Focused on heating system maintenance and emergency repairs',
          },
        ],
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = createJsonRequest({
        category: 'HVAC',
        priority: 'high',
        description: 'Heating not working in winter',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.suggestions[0].vendorType).toContain('HVAC')
    })

    it('should suggest vendors for low priority cosmetic work', async () => {
      // Arrange
      const mockResponse = {
        suggestions: [
          {
            vendorType: 'Painting Contractor',
            reason: 'Professional finish for interior walls',
          },
          {
            vendorType: 'Handyman Service',
            reason: 'Cost-effective for minor cosmetic repairs',
          },
          {
            vendorType: 'Interior Designer',
            reason: 'Can provide color consultation and professional painting',
          },
        ],
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = createJsonRequest({
        category: 'Painting',
        priority: 'low',
        description: 'Touch up wall paint',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.suggestions).toBeDefined()
    })
  })

  describe('validation errors', () => {
    it('should return error when category is missing', async () => {
      // Arrange
      const request = createJsonRequest({
        priority: 'high',
        description: 'Some issue',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Category and priority are required')
    })

    it('should return error when priority is missing', async () => {
      // Arrange
      const request = createJsonRequest({
        category: 'Plumbing',
        description: 'Clogged drain',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Category and priority are required')
    })

    it('should return error when both category and priority are missing', async () => {
      // Arrange
      const request = createJsonRequest({})

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Category and priority are required')
    })

    it('should accept request without description (optional field)', async () => {
      // Arrange
      const mockResponse = {
        suggestions: [
          {
            vendorType: 'Licensed Plumber',
            reason: 'Handles plumbing repairs professionally',
          },
        ],
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = createJsonRequest({
        category: 'Plumbing',
        priority: 'high',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should handle AI API failures gracefully', async () => {
      // Arrange
      ;(generateText as jest.Mock).mockRejectedValue(new Error('AI service unavailable'))

      const request = createJsonRequest({
        category: 'Plumbing',
        priority: 'high',
        description: 'Burst pipe',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to suggest vendors')
    })
  })
})
