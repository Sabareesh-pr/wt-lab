import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
// Inline the small shared stylesheet to avoid a render-blocking network request.
const inlineSmallCss = {
  name:'inline-small-css', apply:'build', enforce:'post',
  generateBundle(options,bundle) {
    const index = bundle['index.html'];
    if (!index) return;
    index.source = String(index.source).replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, tag => {
      const href = tag.match(/href="([^"]+)"/)?.[1];
      const css = href && bundle[href.replace(/^\//,'')];
      return css?.type === 'asset' && String(css.source).length <= 8192
        ? `<style>${css.source}</style>` : tag;
    });
  }
};
export default defineConfig({plugins:[react(),inlineSmallCss], server:{proxy:{'/api':'http://localhost:5000'}}});
