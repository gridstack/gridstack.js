#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, '../doc/html/index.html');

if (!fs.existsSync(docsPath)) {
  console.error('HTML documentation file not found:', docsPath);
  process.exit(1);
}

const content = fs.readFileSync(docsPath, 'utf8');

// Function to extract class sections from HTML
function extractClassSections(html) {
  const sections = [];
  const classRegex = /<section class="tsd-panel tsd-member tsd-kind-class"[^>]*>([\s\S]*?)(?=<section class="tsd-panel|$)/g;
  let match;
  
  while ((match = classRegex.exec(html)) !== null) {
    const sectionContent = match[0];
    // Extract class name from the section
    const nameMatch = sectionContent.match(/<h3 class="tsd-index-signature"[^>]*>\s*<span class="tsd-kind-class">Class<\/span>\s+<a href="[^"]*" class="tsd-index-link">\s*([^<]+)\s*<\/a>/);
    if (nameMatch) {
      sections.push({
        name: nameMatch[1].trim(),
        content: sectionContent,
        startIndex: match.index
      });
    }
  }
  
  return sections;
}

// For HTML, we need to work with the TypeDoc generated structure
// Reorder the main content sections (Classes and Interfaces)

function reorderMainContent(html) {
  // Reorder Classes section
  const classesRegex = /<details class="tsd-panel-group tsd-member-group tsd-accordion" open><summary class="tsd-accordion-summary" data-key="section-Classes"[^>]*>[\s\S]*?<h2>Classes<\/h2><\/summary><dl class="tsd-member-summaries">([\s\S]*?)<\/dl><\/details>/;
  const classesMatch = html.match(classesRegex);
  
  if (classesMatch) {
    const classesContent = classesMatch[1];
    
    // Extract individual class items
    const classItemRegex = /<dt class="tsd-member-summary"[^>]*>[\s\S]*?<\/dt><dd class="tsd-member-summary"><\/dd>/g;
    const classItems = [];
    let match;
    
    while ((match = classItemRegex.exec(classesContent)) !== null) {
      const item = match[0];
      // Extract class name
      const nameMatch = item.match(/<a href="[^"]*">([^<]+)<\/a>/);
      if (nameMatch) {
        classItems.push({
          name: nameMatch[1],
          content: item
        });
      }
    }
    
    // Define priority order for classes
    const classPriorityOrder = ['GridStack', 'GridStackEngine', 'Utils'];
    
    // Separate priority classes from others
    const priorityClasses = [];
    const otherClasses = [];
    
    classItems.forEach(item => {
      if (classPriorityOrder.includes(item.name)) {
        priorityClasses.push(item);
      } else {
        otherClasses.push(item);
      }
    });
    
    // Sort priority classes
    priorityClasses.sort((a, b) => {
      const aIndex = classPriorityOrder.indexOf(a.name);
      const bIndex = classPriorityOrder.indexOf(b.name);
      return aIndex - bIndex;
    });
    
    // Create new classes content
    const reorderedClasses = [...priorityClasses, ...otherClasses];
    const newClassesContent = reorderedClasses.map(item => item.content).join('');
    
    html = html.replace(classesMatch[0], classesMatch[0].replace(classesContent, newClassesContent));
  }
  
  // Reorder Interfaces section to prioritize GridStackOptions
  const interfacesRegex = /<details class="tsd-panel-group tsd-member-group tsd-accordion" open><summary class="tsd-accordion-summary" data-key="section-Interfaces"[^>]*>[\s\S]*?<h2>Interfaces<\/h2><\/summary><dl class="tsd-member-summaries">([\s\S]*?)<\/dl><\/details>/;
  const interfacesMatch = html.match(interfacesRegex);
  
  if (interfacesMatch) {
    const interfacesContent = interfacesMatch[1];
    
    // Extract individual interface items
    const interfaceItemRegex = /<dt class="tsd-member-summary"[^>]*>[\s\S]*?<\/dt><dd class="tsd-member-summary"><\/dd>/g;
    const interfaceItems = [];
    let match;
    
    while ((match = interfaceItemRegex.exec(interfacesContent)) !== null) {
      const item = match[0];
      // Extract interface name
      const nameMatch = item.match(/<a href="[^"]*">([^<]+)<\/a>/);
      if (nameMatch) {
        interfaceItems.push({
          name: nameMatch[1],
          content: item
        });
      }
    }
    
    // Find GridStackOptions and prioritize it
    const gridStackOptionsItem = interfaceItems.find(item => item.name === 'GridStackOptions');
    const otherInterfaces = interfaceItems.filter(item => item.name !== 'GridStackOptions');
    
    // Create new interfaces content with GridStackOptions first
    const reorderedInterfaces = gridStackOptionsItem ? [gridStackOptionsItem, ...otherInterfaces] : interfaceItems;
    const newInterfacesContent = reorderedInterfaces.map(item => item.content).join('');
    
    html = html.replace(interfacesMatch[0], interfacesMatch[0].replace(interfacesContent, newInterfacesContent));
  }
  
  return html;
}

function reorderSidebarNavigation(html) {
  // Also reorder the sidebar navigation to match the main content
  const sidebarRegex = /<details open class="tsd-accordion tsd-page-navigation-section"><summary class="tsd-accordion-summary" data-key="section-Classes"[^>]*>[\s\S]*?<span>Classes<\/span><\/summary><div>([\s\S]*?)<\/div><\/details>/;
  const sidebarMatch = html.match(sidebarRegex);
  
  if (sidebarMatch) {
    const sidebarContent = sidebarMatch[1];
    
    // Extract sidebar items
    const sidebarItemRegex = /<a href="[^"]*"[^>]*>[\s\S]*?<span>([^<]+)<\/span><\/a>/g;
    const sidebarItems = [];
    let match;
    
    while ((match = sidebarItemRegex.exec(sidebarContent)) !== null) {
      sidebarItems.push({
        name: match[1].replace(/<wbr\/>/g, ''),
        content: match[0]
      });
    }
    
    // Reorder sidebar classes
    const classPriorityOrder = ['GridStack', 'GridStackEngine', 'Utils'];
    const priorityClasses = [];
    const otherClasses = [];
    
    sidebarItems.forEach(item => {
      if (classPriorityOrder.includes(item.name)) {
        priorityClasses.push(item);
      } else {
        otherClasses.push(item);
      }
    });
    
    priorityClasses.sort((a, b) => {
      const aIndex = classPriorityOrder.indexOf(a.name);
      const bIndex = classPriorityOrder.indexOf(b.name);
      return aIndex - bIndex;
    });
    
    const reorderedSidebar = [...priorityClasses, ...otherClasses];
    const newSidebarContent = reorderedSidebar.map(item => item.content).join('');
    
    html = html.replace(sidebarMatch[0], sidebarMatch[0].replace(sidebarContent, newSidebarContent));
  }
  
  return html;
}

// Update the HTML content
let updatedContent = reorderMainContent(content);
updatedContent = reorderSidebarNavigation(updatedContent);

// Add a custom note at the top about the ordering
const customNote = `
<!-- Documentation ordered with GridStack → GridStackEngine → GridStackOptions first -->
`;

updatedContent = updatedContent.replace('<body>', '<body>' + customNote);

// Write the updated content back
fs.writeFileSync(docsPath, updatedContent);

console.log('✅ HTML documentation navigation reordered successfully!');
console.log('Order: GridStack → GridStackEngine → Utils → GridStackOptions → Others');
