import type { ComponentType } from 'preact';
import { HomePage } from '../features/home/HomePage';
import { VideosPage } from '../features/videos/VideosPage';
import { ThreeDDesignsPage } from '../features/three-d-designs/ThreeDDesignsPage';
import { SuggestionsPage } from '../features/suggestions/SuggestionsPage';
import { AboutPage } from '../features/about/AboutPage';

export interface RouteDefinition {
  path: string;
  label: string;
  Component: ComponentType;
  showInNav: boolean;
}

export const routes: RouteDefinition[] = [
  { path: '/', label: 'Home', Component: HomePage, showInNav: true },
  { path: '/videos', label: 'Videos', Component: VideosPage, showInNav: true },
  { path: '/3d-designs', label: '3D Designs', Component: ThreeDDesignsPage, showInNav: true },
  { path: '/suggestions', label: 'Suggestions', Component: SuggestionsPage, showInNav: true },
  { path: '/about', label: 'About', Component: AboutPage, showInNav: true },
];
