// Array of quote objects - will be loaded from localStorage
let quotes = [];

// Default quotes to use if localStorage is empty
const defaultQuotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
  { text: "The only impossible journey is the one you never begin.", category: "Journey" },
  { text: "In the middle of difficulty lies opportunity.", category: "Wisdom" }
];

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Use default quotes if nothing in localStorage
    quotes = [...defaultQuotes];
    saveQuotes();
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Clear previous content
  quoteDisplay.innerHTML = '';
  
  if (quotes.length === 0) {
    quoteDisplay.textContent = 'No quotes available. Please add some quotes!';
    return;
  }
  
  // Select a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // Store last viewed quote in sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  
  // Create quote text element
  const quoteText = document.createElement('div');
  quoteText.className = 'quote-text';
  quoteText.textContent = `"${quote.text}"`;
  
  // Create category element
  const quoteCategory = document.createElement('div');
  quoteCategory.className = 'quote-category';
  quoteCategory.textContent = `- Category: ${quote.category}`;
  
  // Append elements to the display
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Function to restore last viewed quote from sessionStorage
function showLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    quoteDisplay.innerHTML = '';
    
    const quoteText = document.createElement('div');
    quoteText.className = 'quote-text';
    quoteText.textContent = `"${quote.text}"`;
    
    const quoteCategory = document.createElement('div');
    quoteCategory.className = 'quote-category';
    quoteCategory.textContent = `- Category: ${quote.category}`;
    
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  } else {
    showRandomQuote();
  }
}

// Function to create the add quote form
function createAddQuoteForm() {
  // Check if form already exists
  if (document.getElementById('addQuoteForm')) {
    return;
  }
  
  // Create form container
  const formContainer = document.createElement('div');
  formContainer.id = 'addQuoteForm';
  
  // Create form title
  const formTitle = document.createElement('h2');
  formTitle.textContent = 'Add Your Own Quote';
  formContainer.appendChild(formTitle);
  
  // Create input for quote text
  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';
  formContainer.appendChild(quoteInput);
  
  // Create input for category
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  formContainer.appendChild(categoryInput);
  
  // Create add button
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;
  formContainer.appendChild(addButton);
  
  // Append form to body
  document.body.appendChild(formContainer);
}

// Function to create import/export controls
function createImportExportControls() {
  // Check if controls already exist
  if (document.getElementById('importExportControls')) {
    return;
  }
  
  // Create container
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'importExportControls';
  controlsContainer.style.cssText = 'background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 20px;';
  
  // Create title
  const title = document.createElement('h2');
  title.textContent = 'Import/Export Quotes';
  controlsContainer.appendChild(title);
  
  // Create export button
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export Quotes as JSON';
  exportButton.onclick = exportToJsonFile;
  controlsContainer.appendChild(exportButton);
  
  // Create import file input
  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.id = 'importFile';
  importInput.accept = '.json';
  importInput.onchange = importFromJsonFile;
  importInput.style.cssText = 'display: block; margin: 15px 0;';
  controlsContainer.appendChild(importInput);
  
  // Create import label
  const importLabel = document.createElement('label');
  importLabel.htmlFor = 'importFile';
  importLabel.textContent = 'Import quotes from JSON file';
  importLabel.style.cssText = 'font-size: 0.9em; color: #666;';
  controlsContainer.insertBefore(importLabel, importInput);
  
  // Append to body
  document.body.appendChild(controlsContainer);
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
  
  // Validate inputs
  if (quoteText === '' || quoteCategory === '') {
    alert('Please enter both a quote and a category!');
    return;
  }
  
  // Create new quote object
  const newQuote = {
    text: quoteText,
    category: quoteCategory
  };
  
  // Add to quotes array
  quotes.push(newQuote);
  
  // Save to localStorage
  saveQuotes();
  
  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  
  // Show success message
  alert('Quote added successfully and saved to local storage!');
  
  // Display the newly added quote
  showRandomQuote();
}

// Function to export quotes to JSON file
function exportToJsonFile() {
  if (quotes.length === 0) {
    alert('No quotes to export!');
    return;
  }
  
  // Convert quotes array to JSON string
  const jsonStr = JSON.stringify(quotes, null, 2);
  
  // Create a Blob from the JSON string
  const blob = new Blob([jsonStr], { type: 'application/json' });
  
  // Create a download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  
  // Trigger download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert('Quotes exported successfully!');
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  
  if (!file) {
    return;
  }
  
  const fileReader = new FileReader();
  
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      
      // Validate that it's an array
      if (!Array.isArray(importedQuotes)) {
        alert('Invalid JSON format. Expected an array of quotes.');
        return;
      }
      
      // Validate quote structure
      const isValid = importedQuotes.every(quote => 
        quote.hasOwnProperty('text') && quote.hasOwnProperty('category')
      );
      
      if (!isValid) {
        alert('Invalid quote format. Each quote must have "text" and "category" properties.');
        return;
      }
      
      // Add imported quotes to existing quotes
      quotes.push(...importedQuotes);
      
      // Save to localStorage
      saveQuotes();
      
      alert(`Successfully imported ${importedQuotes.length} quotes!`);
      
      // Display a random quote from the updated list
      showRandomQuote();
      
    } catch (error) {
      alert('Error parsing JSON file: ' + error.message);
    }
  };
  
  fileReader.onerror = function() {
    alert('Error reading file!');
  };
  
  fileReader.readAsText(file);
  
  // Reset file input
  event.target.value = '';
}

// Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  // Load quotes from localStorage
  loadQuotes();
  
  // Display last viewed quote from sessionStorage or a random one
  showLastViewedQuote();
  
  // Create the add quote form
  createAddQuoteForm();
  
  // Create import/export controls
  createImportExportControls();
  
  console.log('Application initialized. Quotes loaded from localStorage.');
  console.log(`Total quotes: ${quotes.length}`);
});
