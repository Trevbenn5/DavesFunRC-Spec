import { describe, expect, it } from 'vitest';
import html from '../../index.html?raw';

describe('index.html', () => {
  it('has the charset declaration as the first head element', () => {
    expect(html.indexOf('<meta charset="UTF-8" />')).toBeLessThan(html.indexOf('<script>'));
  });

  it('installs the GTM loader script in <head>, high up and referencing the env placeholder', () => {
    const headEnd = html.indexOf('</head>');
    const gtmScriptIndex = html.indexOf("'https://www.googletagmanager.com/gtm.js?id='");

    expect(gtmScriptIndex).toBeGreaterThan(-1);
    expect(gtmScriptIndex).toBeLessThan(headEnd);
    expect(html).toContain("'script', 'dataLayer', '%VITE_GTM_CONTAINER_ID%'");
  });

  it('installs the GTM noscript iframe immediately after <body>', () => {
    const bodyIndex = html.indexOf('<body>');
    const noscriptIndex = html.indexOf('<noscript');
    const appDivIndex = html.indexOf('<div id="app">');

    expect(noscriptIndex).toBeGreaterThan(bodyIndex);
    expect(noscriptIndex).toBeLessThan(appDivIndex);
    expect(html).toContain('https://www.googletagmanager.com/ns.html?id=%VITE_GTM_CONTAINER_ID%');
  });

  it('no longer references the retired direct gtag.js integration', () => {
    expect(html).not.toContain('gtag');
  });
});
