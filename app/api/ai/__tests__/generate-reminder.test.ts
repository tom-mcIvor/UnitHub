import { POST } from '../generate-reminder/route'

// Mock the AI generateText function
jest.mock('ai', () => ({
  generateText: jest.fn(),
}))

import { generateText } from 'ai'

describe('POST /api/ai/generate-reminder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('successful reminder generation', () => {
    it('should generate payment reminder for overdue rent', async () => {
      // Arrange
      const mockResponse = {
        message: 'Dear John Doe,\n\nThis is a friendly reminder that your rent payment of $1,200.00 is now 5 days overdue. We kindly request that you submit payment within the next 5 business days.\n\nIf you have any questions or concerns, please contact us.\n\nThank you,\nProperty Management',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: 'John Doe',
          daysOverdue: 5,
          rentAmount: '1200',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('John Doe')
      expect(data.message).toContain('5 days overdue')
      expect(data.message).toContain('$1,200')
      expect(generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4-turbo',
          prompt: expect.stringContaining('John Doe'),
        })
      )
    })

    it('should generate reminder for payment due soon (0 days overdue)', async () => {
      // Arrange
      const mockResponse = {
        message: 'Dear Sarah Smith,\n\nThis is a friendly reminder that your rent payment of $1,500.00 is due. Please submit payment within the next 5 business days to avoid late fees.\n\nThank you for your prompt attention to this matter.\n\nProperty Management',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: 'Sarah Smith',
          daysOverdue: 0,
          rentAmount: '1500',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('Sarah Smith')
      expect(data.message).toContain('$1,500')
    })

    it('should generate more urgent reminder for significantly overdue rent', async () => {
      // Arrange
      const mockResponse = {
        message: 'Dear Mike Johnson,\n\nThis is an urgent notice that your rent payment of $2,000.00 is now 30 days overdue. Immediate payment is required within the next 5 business days to avoid further action.\n\nPlease contact us immediately to discuss payment arrangements.\n\nProperty Management',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: 'Mike Johnson',
          daysOverdue: 30,
          rentAmount: '2000',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.message).toContain('Mike Johnson')
      expect(data.message).toContain('30 days')
    })
  })

  describe('validation errors', () => {
    it('should return error when tenantName is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daysOverdue: 5,
          rentAmount: '1200',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Required fields missing')
      expect(generateText).not.toHaveBeenCalled()
    })

    it('should return error when daysOverdue is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: 'John Doe',
          rentAmount: '1200',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Required fields missing')
      expect(generateText).not.toHaveBeenCalled()
    })

    it('should return error when rentAmount is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: 'John Doe',
          daysOverdue: 5,
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Required fields missing')
    })

    it('should accept daysOverdue as 0', async () => {
      // Arrange
      const mockResponse = {
        message: 'Reminder message',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: 'Test Tenant',
          daysOverdue: 0,
          rentAmount: '1000',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return error when all fields are missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Required fields missing')
    })
  })

  describe('error handling', () => {
    it('should handle AI API failures gracefully', async () => {
      // Arrange
      ;(generateText as jest.Mock).mockRejectedValue(new Error('AI timeout'))

      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: 'Test',
          daysOverdue: 5,
          rentAmount: '1000',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to generate reminder')
    })

    it('should handle invalid JSON response from AI', async () => {
      // Arrange
      ;(generateText as jest.Mock).mockResolvedValue({
        text: 'Invalid JSON response',
      })

      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: 'Test',
          daysOverdue: 5,
          rentAmount: '1000',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to generate reminder')
    })

    it('should handle malformed request body', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not valid json',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to generate reminder')
    })
  })

  describe('different rent amounts and scenarios', () => {
    it('should handle large rent amounts', async () => {
      // Arrange
      const mockResponse = {
        message: 'Reminder for $5,000 rent',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: 'Premium Tenant',
          daysOverdue: 1,
          rentAmount: '5000',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: expect.stringContaining('$5000'),
        })
      )
    })

    it('should handle decimal rent amounts', async () => {
      // Arrange
      const mockResponse = {
        message: 'Reminder for $1,234.56 rent',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: 'Test Tenant',
          daysOverdue: 3,
          rentAmount: '1234.56',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should handle tenant names with special characters', async () => {
      // Arrange
      const mockResponse = {
        message: "Reminder for O'Brien",
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName: "Patrick O'Brien",
          daysOverdue: 2,
          rentAmount: '1100',
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
})
