import React from 'react';      
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LocationSelector from '../LocationSelector';
import { vi } from 'vitest';


global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      {
        place_id: '1',
        display_name: 'Bogotá, Colombia',
        lat: '4.6097',
        lon: '-74.0818',
      },
    ]),
  })
);

describe('LocationSelector', () => {
  it('muestra sugerencias y permite seleccionarlas', async () => {
    const onLocationSelect = vi.fn();

    render(<LocationSelector onLocationSelect={onLocationSelect} />);

    const input = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(input, { target: { value: 'Bogotá' } });

    await waitFor(() => {
      expect(screen.getByText(/Bogotá, Colombia/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Bogotá, Colombia/));
    expect(onLocationSelect).toHaveBeenCalledWith({
      name: 'Bogotá, Colombia',
      lat: 4.6097,
      lon: -74.0818,
    });
  });
});
