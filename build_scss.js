const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const appDir = path.join(baseDir, 'mimalicious_app', 'src');

const files = [
  { name: 'index.html', className: 'page-landing' },
  { name: 'home.html', className: 'page-home' },
  { name: 'menu.html', className: 'page-menu' },
  { name: 'history.html', className: 'page-history' },
  { name: 'admin.html', className: 'page-admin' },
  { name: 'about.html', className: 'page-about' },
  { name: 'contact us.html', className: 'page-contact' },
  { name: 'login.html', className: 'page-login' }
];

let scssContent = '/* Auto-generated page-specific SCSS */\n\n';

for (const file of files) {
  const filePath = path.join(baseDir, file.name);
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf-8');
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch && styleMatch[1]) {
      let css = styleMatch[1];
      
      // We want to scope the CSS to body.className
      // So body { padding-top: 0; } becomes & { padding-top: 0; } when nested inside body.className { ... }
      css = css.replace(/body\s*{/g, '& {');
      
      scssContent += `body.${file.className} {\n${css}\n}\n\n`;
    }
  }
}

fs.writeFileSync(path.join(appDir, 'pages.scss'), scssContent);

// Also revert index.css
const indexCssPath = path.join(appDir, 'index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf-8');
const separator = '/* ============================================================ \n   PAGE-SPECIFIC CSS EXTRACTED FROM HTML FILES \n   ============================================================ */';
const sepIndex = indexCss.indexOf(separator);
if (sepIndex !== -1) {
  indexCss = indexCss.substring(0, sepIndex);
  fs.writeFileSync(indexCssPath, indexCss);
}

// Add import to main.jsx
const mainJsxPath = path.join(appDir, 'main.jsx');
let mainJsx = fs.readFileSync(mainJsxPath, 'utf-8');
if (!mainJsx.includes("import './pages.scss';")) {
  mainJsx = mainJsx.replace("import './index.css';", "import './index.css';\nimport './pages.scss';");
  fs.writeFileSync(mainJsxPath, mainJsx);
}

console.log('Successfully generated pages.scss, reverted index.css, and updated main.jsx');
