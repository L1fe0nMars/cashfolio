import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const contentSecurityPolicy = [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
    // Vite inlines small assets (like arrow-down.svg) as data URIs
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'none'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'"
].join('; ');

// Build only: the dev server relies on inline scripts and styles that this policy would block
const cspPlugin = {
    name: 'csp-meta',
    apply: 'build',
    transformIndexHtml: () => [{
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy },
        injectTo: 'head-prepend'
    }]
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), cspPlugin],
    server: { open: true }
})
