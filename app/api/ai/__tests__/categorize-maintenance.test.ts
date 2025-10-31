import { POST } from '../categorize-maintenance/route'

// Mock the AI generateText function
jest.mock('ai', () => ({
  generateText: jest.fn(),
}))

import { generateText } from 'ai'

describe('POST /api/ai/categorize-maintenance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('successful categorization', () => {
    it('should categorize maintenance request successfully', async () => {
      // Arrange
      const mockResponse = {
        category: 'Plumbing',
        priority: 'high',
        estimatedCost: 250,
        summary: 'Leaking pipe needs repair',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/categorize-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Leaking Pipe',
          description: 'There is water leaking from the pipe under the sink',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.category).toBe('Plumbing')
      expect(data.priority).toBe('high')
      expect(data.estimatedCost).toBe(250)
      expect(data.summary).toBe('Leaking pipe needs repair')
      expect(generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'openai/gpt-4-turbo',
          prompt: expect.stringContaining('Leaking Pipe'),
        })
      )
    })

    it('should handle urgent priority requests', async () => {
      // Arrange
      const mockResponse = {
        category: 'HVAC',
        priority: 'urgent',
        estimatedCost: 500,
        summary: 'No heat in winter - requires immediate attention',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/categorize-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'No Heat',
          description: 'Heating system is not working',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.priority).toBe('urgent')
      expect(data.category).toBe('HVAC')
    })
  })

  describe('validation errors', () => {
    it('should return error when title is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/categorize-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: 'Description only',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Title and description are required')
      expect(generateText).not.toHaveBeenCalled()
    })

    it('should return error when description is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/categorize-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Title only',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Title and description are required')
      expect(generateText).not.toHaveBeenCalled()
    })

    it('should return error when both fields are missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/categorize-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Title and description are required')
    })
  })

  describe('error handling', () => {
    it('should handle AI API failures gracefully', async () => {
      // Arrange
      ;(generateText as jest.Mock).mockRejectedValue(new Error('AI API unavailable'))

      const request = new Request('http://localhost:3000/api/ai/categorize-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test',
          description: 'Test description',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to categorize maintenance request')
    })

    it('should handle invalid JSON response from AI', async () => {
      // Arrange
      ;(generateText as jest.Mock).mockResolvedValue({
        text: 'This is not valid JSON',
      })

      const request = new Request('http://localhost:3000/api/ai/categorize-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test',
          description: 'Test description',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to categorize maintenance request')
    })

    it('should handle malformed request body', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/categorize-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to categorize maintenance request')
    })
  })

  describe('different maintenance categories', () => {
    it('should categorize electrical issues', async () => {
      // Arrange
      const mockResponse = {
        category: 'Electrical',
        priority: 'high',
        estimatedCost: 350,
        summary: 'Outlet needs replacement for safety',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/categorize-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Outlet sparking',
          description: 'Electrical outlet is sparking when plugs are inserted',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(data.category).toBe('Electrical')
      expect(data.priority).toBe('high')
    })

    it('should categorize low priority requests', async () => {
      // Arrange
      const mockResponse = {
        category: 'Painting',
        priority: 'low',
        estimatedCost: 100,
        summary: 'Minor cosmetic touch-up needed',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/categorize-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Paint touch-up',
          description: 'Small scratch on wall needs paint touch-up',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(data.category).toBe('Painting')
      expect(data.priority).toBe('low')
    })
  })
})
