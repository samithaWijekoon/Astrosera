import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Chat from '../src/Pages/chat/chat';
import { BrowserRouter } from 'react-router-dom';

HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn()
});
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const mockLocation = { state: { autoQuery: 'What is a black hole?' } };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

describe('Chat Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    
    // Polyfill window.scrollTo and resize logic
    window.scrollTo = vi.fn();
    Storage.prototype.getItem = vi.fn(() => 'user123');
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Chat />
      </BrowserRouter>
    );
  };

  it('initializes and triggers auto query from location state', async () => {
    // 1. First fetch is health check (returns ok)
    // 2. Second fetch is the QA endpoint for the autoQuery
    // 3. Third fetch is the gamification record
    
    global.fetch.mockImplementation((url) => {
      if (url.includes('/health')) {
        return Promise.resolve({ ok: true });
      }
      if (url.includes('/qa')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ answer: "A black hole is a region of spacetime..." })
        });
      }
      if (url.includes('/gamification/record-interaction')) {
        return Promise.resolve({ ok: true });
      }
      return Promise.reject(new Error('Unknown endpoint ' + url));
    });

    renderComponent();

    // Allow effects to process the API health check and trigger autoQuery
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/health'));
    });

    // Check that the user queried the exact location autoQuery parameter 
    await waitFor(() => {
        expect(screen.getByText('What is a black hole?')).toBeInTheDocument();
    });

    // Check that the bot responded
    await waitFor(() => {
      expect(screen.getByText(/region of spacetime/i)).toBeInTheDocument();
    });
  });
  
  it('manually sends a chat query and renders response', async () => {
    // Override the mock location state so it doesn't auto-send
    mockLocation.state = null;

    global.fetch.mockImplementation((url) => {
      if (url.includes('/health')) return Promise.resolve({ ok: true });
      if (url.includes('/qa')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ answer: "Mars is the 4th planet." })
        });
      }
      return Promise.resolve({ ok: true });
    });

    renderComponent();

    // Wait for the welcome screen
    await waitFor(() => {
      expect(screen.getByText('Ask me about space')).toBeInTheDocument();
    });

    // Find the textarea and type
    const textarea = screen.getByPlaceholderText(/Ask about space/i);
    fireEvent.change(textarea, { target: { value: 'Tell me about Mars' } });
    
    // Find the send button
    const buttons = screen.getAllByRole('button');
    const sendButton = buttons[buttons.length - 1]; // last button is send
    
    fireEvent.click(sendButton);

    // Verify response
    await waitFor(() => {
      expect(screen.getByText('Tell me about Mars')).toBeInTheDocument();
      expect(screen.getByText('Mars is the 4th planet.')).toBeInTheDocument();
    });
  });

});
