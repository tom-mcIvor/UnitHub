import { POST } from '../suggest-vendor/route'

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

      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Plumbing',
          priority: 'high',
          description: 'Pipe leaking in kitchen',
        }),
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

      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Electrical',
          priority: 'urgent',
          description: 'Outlet sparking',
        }),
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

      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'HVAC',
          priority: 'high',
          description: 'Heating not working in winter',
        }),
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

      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Painting',
          priority: 'low',
          description: 'Touch up wall paint',
        }),
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
      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority: 'high',
          description: 'Some issue',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Category and priority are required')
      expect(generateText).not.toHaveBeenCalled()
    })

    it('should return error when priority is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Plumbing',
          description: 'Some issue',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Category and priority are required')
      expect(generateText).not.toHaveBeenCalled()
    })

    it('should return error when both category and priority are missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: 'Some issue',
        }),
      })

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
            vendorType: 'General Contractor',
            reason: 'Can handle various types of work',
          },
        ],
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Other',
          priority: 'medium',
        }),
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

      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Plumbing',
          priority: 'high',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to suggest vendors')
    })

    it('should handle invalid JSON response from AI', async () => {
      // Arrange
      ;(generateText as jest.Mock).mockResolvedValue({
        text: 'Not valid JSON',
      })

      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Plumbing',
          priority: 'high',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to suggest vendors')
    })

    it('should handle malformed request body', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to suggest vendors')
    })
  })

  describe('different categories and priorities', () => {
    it('should handle appliance repairs', async () => {
      // Arrange
      const mockResponse = {
        suggestions: [
          {
            vendorType: 'Appliance Repair Specialist',
            reason: 'Expert in refrigerator repairs',
          },
          {
            vendorType: 'HVAC & Appliance Technician',
            reason: 'Can diagnose and repair cooling systems',
          },
          {
            vendorType: 'General Appliance Service',
            reason: 'Handles all major appliance brands',
          },
        ],
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Appliances',
          priority: 'medium',
          description: 'Refrigerator not cooling',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.suggestions[0].vendorType).toContain('Appliance')
    })

    it('should handle security system issues', async () => {
      // Arrange
      const mockResponse = {
        suggestions: [
          {
            vendorType: 'Security System Installer',
            reason: 'Specialized in alarm system maintenance',
          },
          {
            vendorType: 'Locksmith & Security',
            reason: 'Can handle both locks and security systems',
          },
          {
            vendorType: 'Smart Home Technician',
            reason: 'Expert in modern security technology',
          },
        ],
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Security',
          priority: 'high',
          description: 'Alarm system malfunctioning',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.suggestions).toBeDefined()
    })

    it('should include prompt details in AI call', async () => {
      // Arrange
      const mockResponse = {
        suggestions: [],
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/suggest-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'Plumbing',
          priority: 'urgent',
          description: 'Burst pipe flooding',
        }),
      })

      // Act
      await POST(request)

      // Assert
      expect(generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4-turbo',
          prompt: expect.stringContaining('Plumbing'),
        })
      )
      expect(generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: expect.stringContaining('urgent'),
        })
      )
      expect(generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: expect.stringContaining('Burst pipe flooding'),
        })
      )
    })
  })
})
