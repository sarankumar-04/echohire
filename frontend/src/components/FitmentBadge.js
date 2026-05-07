import React from 'react';
import { fitmentConfig } from '../utils/helpers';
export default function FitmentBadge({ cat }) {
  const c = fitmentConfig[cat] || fitmentConfig['pending'];
  return React.createElement('span', { className: 'badge ' + c.badgeClass }, c.icon + ' ' + c.label);
}
