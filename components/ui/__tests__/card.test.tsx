
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../card';

describe('Card Components', () => {
  it('should render Card with children', () => {
    render(<Card><div>Child Content</div></Card>);
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should render CardHeader with children', () => {
    render(<CardHeader><div>Header Content</div></CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('should render CardFooter with children', () => {
    render(<CardFooter><div>Footer Content</div></CardFooter>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('should render CardTitle with children', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('should render CardDescription with children', () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should render CardContent with children', () => {
    render(<CardContent><div>Content</div></CardContent>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply custom className to Card', () => {
    const { container } = render(<Card className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply custom className to CardHeader', () => {
    const { container } = render(<CardHeader className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply custom className to CardFooter', () => {
    const { container } = render(<CardFooter className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply custom className to CardTitle', () => {
    const { container } = render(<CardTitle className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply custom className to CardDescription', () => {
    const { container } = render(<CardDescription className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply custom className to CardContent', () => {
    const { container } = render(<CardContent className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
