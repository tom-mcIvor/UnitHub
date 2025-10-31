import { POST } from '../extract-lease/route'

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
        tenantName: 'John Doe',
        leaseStartDate: '2024-01-01',
        leaseEndDate: '2024-12-31',
        rentAmount: 1200,
        depositAmount: 1200,
        petPolicy: 'No pets allowed',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/extract-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaseText: 'This lease agreement is between landlord and John Doe for unit 101. Lease starts on January 1, 2024 and ends on December 31, 2024. Monthly rent is $1,200 and security deposit is $1,200. No pets allowed.',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.tenantName).toBe('John Doe')
      expect(data.data.leaseStartDate).toBe('2024-01-01')
      expect(data.data.leaseEndDate).toBe('2024-12-31')
      expect(data.data.rentAmount).toBe(1200)
      expect(data.data.depositAmount).toBe(1200)
      expect(data.data.petPolicy).toBe('No pets allowed')
      expect(data.confidence).toBeDefined()
      expect(data.confidence.tenantName).toBe(0.95)
    })

    it('should handle partial data extraction', async () => {
      // Arrange
      const mockResponse = {
        tenantName: 'Jane Smith',
        leaseStartDate: '2024-06-01',
        leaseEndDate: '2025-05-31',
        rentAmount: 1500,
        depositAmount: null,
        petPolicy: null,
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/extract-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaseText: 'Lease for Jane Smith starting June 1, 2024 ending May 31, 2025. Rent: $1,500/month.',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.tenantName).toBe('Jane Smith')
      expect(data.data.depositAmount).toBeNull()
      expect(data.data.petPolicy).toBeNull()
    })

    it('should extract data with pets allowed', async () => {
      // Arrange
      const mockResponse = {
        tenantName: 'Bob Wilson',
        leaseStartDate: '2024-03-01',
        leaseEndDate: '2025-02-28',
        rentAmount: 1800,
        depositAmount: 1800,
        petPolicy: 'One cat allowed with $500 pet deposit',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/extract-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaseText: 'Tenant Bob Wilson may keep one cat with additional $500 pet deposit. Rent $1800, deposit $1800. Term: March 1, 2024 to February 28, 2025.',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.data.petPolicy).toContain('cat')
      expect(data.data.petPolicy).toContain('$500')
    })
  })

  describe('validation errors', () => {
    it('should return error when leaseText is missing', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/extract-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Lease text is required')
      expect(generateText).not.toHaveBeenCalled()
    })

    it('should return error when leaseText is empty string', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/extract-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaseText: '',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(data.error).toBe('Lease text is required')
    })
  })

  describe('error handling', () => {
    it('should handle AI API failures gracefully', async () => {
      // Arrange
      ;(generateText as jest.Mock).mockRejectedValue(new Error('AI service down'))

      const request = new Request('http://localhost:3000/api/ai/extract-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaseText: 'Sample lease text',
        }),
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
        text: 'Not JSON at all',
      })

      const request = new Request('http://localhost:3000/api/ai/extract-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaseText: 'Sample lease text',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to extract lease data')
    })

    it('should handle malformed request body', async () => {
      // Arrange
      const request = new Request('http://localhost:3000/api/ai/extract-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not json',
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to extract lease data')
    })
  })

  describe('edge cases', () => {
    it('should handle very long lease text', async () => {
      // Arrange
      const mockResponse = {
        tenantName: 'Test Tenant',
        leaseStartDate: '2024-01-01',
        leaseEndDate: '2024-12-31',
        rentAmount: 1000,
        depositAmount: 1000,
        petPolicy: 'No pets',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const longLeaseText = 'A'.repeat(10000) + ' Tenant: Test Tenant. Rent: $1000. Dates: Jan 1 2024 to Dec 31 2024.'

      const request = new Request('http://localhost:3000/api/ai/extract-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaseText: longLeaseText,
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return confidence scores for all fields', async () => {
      // Arrange
      const mockResponse = {
        tenantName: 'Alice Brown',
        leaseStartDate: '2024-09-01',
        leaseEndDate: '2025-08-31',
        rentAmount: 2000,
        depositAmount: 2000,
        petPolicy: 'No pets',
      }

      ;(generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse),
      })

      const request = new Request('http://localhost:3000/api/ai/extract-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaseText: 'Lease agreement for Alice Brown.',
        }),
      })

      // Act
      const response = await POST(request)
      const data = await response.json()

      // Assert
      expect(data.confidence).toHaveProperty('tenantName')
      expect(data.confidence).toHaveProperty('leaseStartDate')
      expect(data.confidence).toHaveProperty('leaseEndDate')
      expect(data.confidence).toHaveProperty('rentAmount')
      expect(data.confidence).toHaveProperty('depositAmount')
      expect(data.confidence).toHaveProperty('petPolicy')
      expect(typeof data.confidence.tenantName).toBe('number')
    })
  })
})
