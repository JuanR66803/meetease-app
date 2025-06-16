// src/setup-tests.js
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }) => <div>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
  useMapEvents: () => ({}),
}));

vi.mock('leaflet', () => ({
  icon: () => ({}),
}));
