import { POST } from '../extract-lease/route'
import { createJsonRequest } from '../test-utils'

// Mock the AI generateText function
jest.mock('ai', () => ({
  generateText: jest.fn(),
}))

import { generateText } from 'ai'

describe('POST /api/ai/extract-lease', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('successful extraction', () => {
    it('should extract lease data successfully', async () => {
      // Arrange
      const mockResponse = {
        tenantName: 'John Smith',
        leaseStartDate: '2025-01-01',
        leaseEndDate: '2026-01-01',
        rentAmount: 1200,
        depositAmount: 1200,
        petPolicy: 'No pets allowed',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = createJsonRequest({
        leaseText: 'Sample lease text',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.tenantName).toBe('John Smith')
      expect(data.data.rentAmount).toBe(1200)
      expect(data.confidence.tenantName).toBe(0.95)
    })
  })

  describe('validation errors', () => {
    it('should return error when lease text is missing', async () => {
      // Arrange
      const request = createJsonRequest({})

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Lease text is required')
      expect(generateText).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('should handle AI API failures gracefully', async () => {
      // Arrange
      ;(generateText as jest.Mock).mockRejectedValue(new Error('AI service unavailable'))

      const request = createJsonRequest({
        leaseText: 'Sample lease text',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to extract lease data')
    })

    it('should handle invalid JSON response from AI', async () => {
      // Arrange
      ;(generateText as jest.Mock).mockResolvedValue({
        text: 'invalid json',
      })

      const request = createJsonRequest({
        leaseText: 'Sample lease text',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to extract lease data')
    })
  })
})
