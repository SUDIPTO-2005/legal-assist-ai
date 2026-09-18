import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RiskScoreGauge } from '../components/analysis/RiskScoreGauge';
import { EscalationAlert } from '../components/common/EscalationAlert';

describe('Risk and Escalation UI Components', () => {
  it('renders risk gauge score correctly', () => {
    render(<RiskScoreGauge score={68} riskLevel="medium" />);
    expect(screen.getByText('68')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('renders human escalation alert with prominent warning', () => {
    render(<EscalationAlert reason="Active arbitration dispute detected." />);
    expect(screen.getByText(/Professional Legal Review Recommended/i)).toBeInTheDocument();
    expect(screen.getByText(/Active arbitration dispute detected/i)).toBeInTheDocument();
  });
});
