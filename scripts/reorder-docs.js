#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, '../doc/API.md');

if (!fs.existsSync(docsPath)) {
  console.error('Documentation file not found:', docsPath);
  process.exit(1);
}

const content = fs.readFileSync(docsPath, 'utf8');

// Split content by ### headers to get sections
const sections = content.split(/(?=^### )/m);
const header = sections[0]; // The initial content before first ###

// Extract class/interface sections
const classSections = sections.slice(1);

// Find specific sections we want to prioritize
const gridStackSection = classSections.find(s => s.startsWith('### GridStack\n'));
const gridStackEngineSection = classSections.find(s => s.startsWith('### GridStackEngine\n'));
const utilsSection = classSections.find(s => s.startsWith('### Utils\n'));
const gridStackOptionsSection = classSections.find(s => s.startsWith('### GridStackOptions\n'));

// Remove prioritized sections from the rest
const remainingSections = classSections.filter(s => 
  !s.startsWith('### GridStack\n') && 
  !s.startsWith('### GridStackEngine\n') && 
  !s.startsWith('### Utils\n') &&
  !s.startsWith('### GridStackOptions\n')
);

// Extract existing anchor links from the content to preserve TypeDoc's numbering
const extractExistingAnchors = (content) => {
  const anchorMap = new Map();
  const linkRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const anchor = match[2];
    // Map clean title to actual anchor
    const cleanTitle = linkText.replace(/`/g, '').trim();
    anchorMap.set(cleanTitle, anchor);
  }
  
  return anchorMap;
};

// Create table of contents using existing anchors
const createToc = (sections, anchorMap) => {
  let toc = '\n## Table of Contents\n\n';
  
  // Add main sections first
  if (gridStackSection) {
    toc += '- [GridStack](#gridstack)\n';
  }
  if (gridStackEngineSection) {
    toc += '- [GridStackEngine](#gridstackengine)\n';
  }
  if (utilsSection) {
    toc += '- [Utils](#utils)\n';
  }
  if (gridStackOptionsSection) {
    toc += '- [GridStackOptions](#gridstackoptions)\n';
  }
  
  // Add other sections using existing anchors when possible
  sections.forEach(section => {
    const match = section.match(/^### (.+)$/m);
    if (match) {
      const title = match[1];
      const cleanTitle = title.replace(/`/g, '').trim();
      
      // Use existing anchor if found, otherwise generate one
      let anchor = anchorMap.get(cleanTitle);
      if (!anchor) {
        // Fallback anchor generation
        anchor = title
          .toLowerCase()
          .replace(/`/g, '')
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      toc += `- [${title}](#${anchor})\n`;
    }
  });
  
  return toc + '\n';
};

// Extract existing anchors from the original content  
const anchorMap = extractExistingAnchors(content);

// Rebuild content with desired order
let reorderedContent = header;

// Add table of contents
reorderedContent += createToc(remainingSections, anchorMap);

// Add prioritized sections first with explicit anchors
if (gridStackSection) {
  const sectionWithAnchor = gridStackSection.replace(/^### (.+)$/m, '<a id="gridstack"></a>\n### $1');
  reorderedContent += sectionWithAnchor;
}
if (gridStackEngineSection) {
  const sectionWithAnchor = gridStackEngineSection.replace(/^### (.+)$/m, '<a id="gridstackengine"></a>\n### $1');
  reorderedContent += sectionWithAnchor;
}
if (utilsSection) {
  const sectionWithAnchor = utilsSection.replace(/^### (.+)$/m, '<a id="utils"></a>\n### $1');
  reorderedContent += sectionWithAnchor;
}
if (gridStackOptionsSection) {
  const sectionWithAnchor = gridStackOptionsSection.replace(/^### (.+)$/m, '<a id="gridstackoptions"></a>\n### $1');
  reorderedContent += sectionWithAnchor;
}

// Add remaining sections with explicit anchors
remainingSections.forEach(section => {
  // Add explicit anchor tags to headers for better compatibility
  const sectionWithAnchors = section.replace(/^### (.+)$/gm, (match, title) => {
    const cleanTitle = title.replace(/`/g, '').trim();
    let anchor = anchorMap.get(cleanTitle);
    if (!anchor) {
      anchor = title
        .toLowerCase()
        .replace(/`/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    return `<a id="${anchor}"></a>\n### ${title}`;
  });
  
  reorderedContent += sectionWithAnchors;
});

// Write the reordered content back
fs.writeFileSync(docsPath, reorderedContent);

console.log('✅ Documentation reordered successfully!');
console.log('Order: GridStack → GridStackEngine → Utils → GridStackOptions → Others');
