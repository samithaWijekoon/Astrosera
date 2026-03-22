import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import DailyQuizSection from '../src/component/landingpage/DailyQuizSection';
import AuthContext from '../src/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('DailyQuizSection Component', () => {
  const mockUser = { _id: 'user123', name: 'Test' };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    Storage.prototype.getItem = vi.fn(() => 'user123'); // For localStorage.getItem('userId')
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <DailyQuizSection />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  it('renders loading state initially', () => {
    // Keep fetch promise pending to test loading
    global.fetch.mockReturnValue(new Promise(() => {}));
    const { container } = renderComponent();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('fetches quiz data and renders the question', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/gamification/dashboard')) {
        return Promise.resolve({
          json: () => Promise.resolve({ success: true, user: { currentStreak: 5, totalScore: 100 } }),
          ok: true
        });
      }
      if (url.includes('/quiz/random')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            question: "Question Test?",
            option1: "A",
            option2: "B",
            option3: "C",
            option4: "D",
            correctAnswer: "B"
          }),
          ok: true
        });
      }
    });

    renderComponent();

    // Verify question renders
    await waitFor(() => {
      expect(screen.getByText("Question Test?")).toBeInTheDocument();
    });

    // Verify streak counts render
    expect(screen.getAllByText(/5 day streak/i)[0]).toBeInTheDocument();

    // Select correct option
    fireEvent.click(screen.getByText("B"));

    // Verify success banner renders
    await waitFor(() => {
      expect(screen.getByText(/Correct! Did you know\?/i)).toBeInTheDocument();
    });
  });

  it('handles incorrect answer selection', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/gamification/dashboard')) {
        return Promise.resolve({ json: () => Promise.resolve({ success: false }) });
      }
      if (url.includes('/quiz/random')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            question: "Another Question?",
            option1: "X",
            option2: "Y",
            option3: "Z",
            correctAnswer: "X"
          }),
          ok: true
        });
      }
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Another Question?")).toBeInTheDocument();
    });

    // Select incorrect option
    fireEvent.click(screen.getByText("Y"));

    // Verify failure banner renders
    await waitFor(() => {
      expect(screen.getByText(/Not quite! Did you know\?/i)).toBeInTheDocument();
    });
  });
});
