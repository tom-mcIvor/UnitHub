import { POST } from '../generate-reminder/route'
import { createJsonRequest } from '../test-utils'

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
    it('should generate reminder for overdue rent', async () => {
      // Arrange
      const mockResponse = {
        message: 'Hello John Doe, your rent payment of $1200 is 5 days overdue. Please submit payment within 5 business days. Thank you!',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = createJsonRequest({
        tenantName: 'John Doe',
        daysOverdue: 5,
        rentAmount: 1200,
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('John Doe')
      expect(data.message).toContain('$1200')
    })

    it('should generate reminder for on-time rent', async () => {
      // Arrange
      const mockResponse = {
        message: 'Hello Sarah Smith, this is a reminder that your rent payment of $950 is due soon. Please submit payment within 5 business days. Thank you!',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = createJsonRequest({
        tenantName: 'Sarah Smith',
        daysOverdue: 0,
        rentAmount: 950,
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.message).toContain('Sarah Smith')
      expect(data.message).toContain('$950')
    })
  })

  describe('validation errors', () => {
    it('should return error when tenant name is missing', async () => {
      // Arrange
      const request = createJsonRequest({
        daysOverdue: 5,
        rentAmount: 1200,
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Required fields missing')
      expect(generateText).not.toHaveBeenCalled()
    })

    it('should return error when days overdue is missing', async () => {
      // Arrange
      const request = createJsonRequest({
        tenantName: 'John Doe',
        rentAmount: 1200,
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Required fields missing')
      expect(generateText).not.toHaveBeenCalled()
    })

    it('should return error when rent amount is missing', async () => {
      // Arrange
      const request = createJsonRequest({
        tenantName: 'John Doe',
        daysOverdue: 5,
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Required fields missing')
      expect(generateText).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('should handle AI API failures gracefully', async () => {
      // Arrange
      ;(generateText as jest.Mock).mockRejectedValue(new Error('AI service unavailable'))

      const request = createJsonRequest({
        tenantName: 'John Doe',
        daysOverdue: 5,
        rentAmount: 1200,
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to generate reminder')
    })
  })
})
