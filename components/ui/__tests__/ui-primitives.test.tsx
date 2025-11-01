import { render, screen } from '@testing-library/react'
import { Button } from '../button'
import { Input } from '../input'
import { Label } from '../label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card'
import { Badge } from '../badge'
import { Skeleton } from '../skeleton'
import { Separator } from '../separator'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../table'
import { Textarea } from '../textarea'
import { Checkbox } from '../checkbox'
import { Switch } from '../switch'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs'

describe('UI Primitives - Smoke Tests', () => {
  describe('Button', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('should render button with different variants', () => {
      const { rerender } = render(<Button variant="default">Default</Button>)
      expect(screen.getByText('Default')).toBeInTheDocument()

      rerender(<Button variant="destructive">Destructive</Button>)
      expect(screen.getByText('Destructive')).toBeInTheDocument()

      rerender(<Button variant="outline">Outline</Button>)
      expect(screen.getByText('Outline')).toBeInTheDocument()
    })
  })

  describe('Input', () => {
    it('should render input element', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('should accept value', () => {
      render(<Input value="test value" readOnly />)
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
    })
  })

  describe('Label', () => {
    it('should render label with text', () => {
      render(<Label>Username</Label>)
      expect(screen.getByText('Username')).toBeInTheDocument()
    })
  })

  describe('Card', () => {
    it('should render card with all subcomponents', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      )

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card Description')).toBeInTheDocument()
      expect(screen.getByText('Card Content')).toBeInTheDocument()
      expect(screen.getByText('Card Footer')).toBeInTheDocument()
    })
  })

  describe('Badge', () => {
    it('should render badge with text', () => {
      render(<Badge>New</Badge>)
      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('should render badge with different variants', () => {
      const { rerender } = render(<Badge variant="default">Default</Badge>)
      expect(screen.getByText('Default')).toBeInTheDocument()

      rerender(<Badge variant="secondary">Secondary</Badge>)
      expect(screen.getByText('Secondary')).toBeInTheDocument()
    })
  })

  describe('Skeleton', () => {
    it('should render skeleton element', () => {
      const { container } = render(<Skeleton />)
      expect(container.firstChild).toHaveClass('animate-pulse')
    })
  })

  describe('Separator', () => {
    it('should render separator', () => {
      const { container } = render(<Separator />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Table', () => {
    it('should render table with rows and cells', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })
  })

  describe('Textarea', () => {
    it('should render textarea element', () => {
      render(<Textarea placeholder="Enter description" />)
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument()
    })
  })

  describe('Checkbox', () => {
    it('should render checkbox', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('Switch', () => {
    it('should render switch', () => {
      render(<Switch />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })
  })

  describe('Select', () => {
    it('should render select trigger', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByText('Select option')).toBeInTheDocument()
    })
  })

  describe('Dialog', () => {
    it('should render dialog trigger', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('Open Dialog')).toBeInTheDocument()
    })
  })

  describe('Tabs', () => {
    it('should render tabs with triggers and content', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Tab 1 Content</TabsContent>
          <TabsContent value="tab2">Tab 2 Content</TabsContent>
        </Tabs>
      )

      expect(screen.getByText('Tab 1')).toBeInTheDocument()
      expect(screen.getByText('Tab 2')).toBeInTheDocument()
    })
  })
})
