const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'mimalicious_app', 'src', 'pages');

const mapping = {
  'Landing.jsx': 'page-landing',
  'Home.jsx': 'page-home',
  'Menu.jsx': 'page-menu',
  'History.jsx': 'page-history',
  'Admin.jsx': 'page-admin',
  'About.jsx': 'page-about',
  'Contact.jsx': 'page-contact',
  'Login.jsx': 'page-login'
};

for (const [file, className] of Object.entries(mapping)) {
  const filePath = path.join(pagesDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Ensure useEffect is imported
    if (!content.includes('useEffect')) {
      content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]react['"];/, (match, p1) => {
        return `import { ${p1.trim()}, useEffect } from 'react';`;
      });
      // If it still doesn't have useEffect, it might be importing React only or not importing at all
      if (!content.includes('useEffect')) {
        content = "import { useEffect } from 'react';\n" + content;
      }
    }

    // Inject the useEffect block inside the main component function
    // Find the export default function ...
    const functionRegex = /export\s+default\s+function\s+\w+\s*\([^)]*\)\s*{/;
    const match = content.match(functionRegex);
    if (match) {
      const insertionPoint = match.index + match[0].length;
      const effectCode = `\n  useEffect(() => {\n    document.body.classList.add('${className}');\n    return () => document.body.classList.remove('${className}');\n  }, []);\n`;
      
      // Check if it's already injected to prevent duplicates
      if (!content.includes(`document.body.classList.add('${className}')`)) {
        content = content.substring(0, insertionPoint) + effectCode + content.substring(insertionPoint);
        fs.writeFileSync(filePath, content);
      }
    }
  }
}

console.log('Successfully patched all JSX pages with useEffect body class toggling.');
