export interface RouteDefinition {
  path: string;
  label: string;
}

export const routes: RouteDefinition[] = [
  { path: '/', label: 'Home' },
  { path: '/videos', label: 'Videos' },
  { path: '/3d-designs', label: '3D Designs' },
  { path: '/suggestions', label: 'Suggestions' },
  { path: '/about', label: 'About' },
];
