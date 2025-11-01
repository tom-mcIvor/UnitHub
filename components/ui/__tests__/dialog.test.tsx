import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '../dialog';

describe('Dialog Components', () => {
  it('should open and close the dialog', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <div>Dialog Content</div>
          <DialogFooter>
            <DialogClose asChild>
              <button>Close</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Initially, the dialog should be closed
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();

    // Open the dialog
    fireEvent.click(screen.getByText('Open Dialog'));
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();

    // Close the dialog
    const closeButtons = screen.getAllByText('Close');
    fireEvent.click(closeButtons[0]);
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();
  });

  it('should render Dialog components with custom classNames', () => {
    render(
      <Dialog open>
        <DialogContent className="custom-content">
          <DialogHeader className="custom-header">
            <DialogTitle className="custom-title">Dialog Title</DialogTitle>
            <DialogDescription className="custom-description">Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter className="custom-footer">
            <DialogClose className="custom-close" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByRole('dialog')).toHaveClass('custom-content');
    expect(screen.getByText('Dialog Title').parentElement).toHaveClass('custom-header');
    expect(screen.getByText('Dialog Title')).toHaveClass('custom-title');
    expect(screen.getByText('Dialog Description')).toHaveClass('custom-description');
    expect(screen.getByText('Close').closest('[data-slot="dialog-footer"]')).toHaveClass('custom-footer');
    expect(screen.getByText('Close')).toHaveClass('custom-close');
  });
});
