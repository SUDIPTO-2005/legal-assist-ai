import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { LEGAL_DISCLAIMER_TEXT } from '../lib/constants';

describe('DisclaimerBanner Component', () => {
  it('renders the mandatory legal assistance disclaimer text', () => {
    render(<DisclaimerBanner />);
    expect(screen.getByText(LEGAL_DISCLAIMER_TEXT)).toBeInTheDocument();
  });

  it('renders compact mode with scale icon', () => {
    render(<DisclaimerBanner compact />);
    expect(screen.getByText(LEGAL_DISCLAIMER_TEXT)).toBeInTheDocument();
  });
});
