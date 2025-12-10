import express, { Request, Response } from 'express';
import { TarkovSearch } from './search';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML UI
app.get('/', (req: Request, res: Response) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tarkov Search</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #e0e0e0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      width: 100%;
      background: rgba(40, 40, 40, 0.9);
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    h1 {
      color: #f5a623;
      margin-bottom: 10px;
      font-size: 2.5em;
      text-align: center;
    }
    .subtitle {
      text-align: center;
      color: #999;
      margin-bottom: 30px;
      font-size: 0.95em;
    }
    .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    input[type="text"] {
      flex: 1;
      padding: 15px 20px;
      font-size: 16px;
      border: 2px solid #444;
      border-radius: 8px;
      background: #2a2a2a;
      color: #e0e0e0;
      transition: border-color 0.3s;
    }
    input[type="text"]:focus {
      outline: none;
      border-color: #f5a623;
    }
    button {
      padding: 15px 30px;
      font-size: 16px;
      font-weight: 600;
      background: #f5a623;
      color: #1a1a1a;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s, transform 0.1s;
    }
    button:hover {
      background: #ffb84d;
    }
    button:active {
      transform: scale(0.98);
    }
    .type-selector {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .type-btn {
      padding: 10px 20px;
      font-size: 14px;
      background: #333;
      color: #999;
      border: 1px solid #444;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .type-btn:hover {
      background: #3a3a3a;
      color: #e0e0e0;
    }
    .type-btn.active {
      background: #f5a623;
      color: #1a1a1a;
      border-color: #f5a623;
    }
    .message {
      margin-top: 20px;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      display: none;
    }
    .message.success {
      background: rgba(76, 175, 80, 0.2);
      color: #81c784;
      border: 1px solid #4caf50;
    }
    .message.error {
      background: rgba(244, 67, 54, 0.2);
      color: #e57373;
      border: 1px solid #f44336;
    }
    .examples {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid #444;
    }
    .examples h3 {
      color: #f5a623;
      margin-bottom: 15px;
      font-size: 1.2em;
    }
    .example-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
    }
    .example-item {
      padding: 10px;
      background: #2a2a2a;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s;
      font-size: 0.9em;
    }
    .example-item:hover {
      background: #333;
    }
    .example-item strong {
      color: #f5a623;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎮 Tarkov Search</h1>
    <p class="subtitle">Search for items, quests, ammo, keys, and bosses</p>
    
    <form id="searchForm">
      <div class="search-box">
        <input 
          type="text" 
          id="searchInput" 
          placeholder="Enter item name, quest, ammo, key, or boss..." 
          required
          autofocus
        />
        <button type="submit">Search</button>
      </div>
      
      <div class="type-selector">
        <button type="button" class="type-btn active" data-type="auto">Auto-detect</button>
        <button type="button" class="type-btn" data-type="item">Item</button>
        <button type="button" class="type-btn" data-type="quest">Quest</button>
        <button type="button" class="type-btn" data-type="ammo">Ammo</button>
        <button type="button" class="type-btn" data-type="key">Key</button>
        <button type="button" class="type-btn" data-type="boss">Boss</button>
      </div>
    </form>
    
    <div id="message" class="message"></div>
    
    <div class="examples">
      <h3>Examples:</h3>
      <div class="example-list">
        <div class="example-item" data-query="RIP">
          <strong>Item:</strong> RIP
        </div>
        <div class="example-item" data-query="Debut">
          <strong>Quest:</strong> Debut
        </div>
        <div class="example-item" data-query="5.45x39 BP">
          <strong>Ammo:</strong> 5.45x39 BP
        </div>
        <div class="example-item" data-query="Dorm room 314">
          <strong>Key:</strong> Dorm room 314
        </div>
        <div class="example-item" data-query="Reshala">
          <strong>Boss:</strong> Reshala
        </div>
        <div class="example-item" data-query="Killa">
          <strong>Boss:</strong> Killa
        </div>
      </div>
    </div>
  </div>

  <script>
    let selectedType = 'auto';
    
    // Type selector buttons
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedType = btn.dataset.type;
      });
    });
    
    // Example items
    document.querySelectorAll('.example-item').forEach(item => {
      item.addEventListener('click', () => {
        document.getElementById('searchInput').value = item.dataset.query;
      });
    });
    
    // Form submission
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const query = document.getElementById('searchInput').value.trim();
      const message = document.getElementById('message');
      
      if (!query) {
        message.textContent = 'Please enter a search query';
        message.className = 'message error';
        message.style.display = 'block';
        return;
      }
      
      try {
        message.textContent = 'Opening pages in your browser...';
        message.className = 'message success';
        message.style.display = 'block';
        
        const response = await fetch('/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            query,
            type: selectedType === 'auto' ? undefined : selectedType
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          message.textContent = \`✓ Opened \${result.type} pages for "\${query}"\`;
          message.className = 'message success';
        } else {
          message.textContent = result.error || 'Search failed';
          message.className = 'message error';
        }
      } catch (error) {
        message.textContent = 'Error performing search';
        message.className = 'message error';
      }
      
      setTimeout(() => {
        message.style.display = 'none';
      }, 5000);
    });
  </script>
</body>
</html>
  `);
});

// Search API endpoint
app.post('/search', async (req: Request, res: Response) => {
  try {
    const { query, type } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }
    
    const search = new TarkovSearch();
    await search.search(query, type);
    
    res.json({ success: true, type: type || 'auto-detected' });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export function startServer(): void {
  app.listen(PORT, () => {
    console.log(`🎮 Tarkov Search Server running at http://localhost:${PORT}`);
    console.log(`Open your browser to http://localhost:${PORT} to start searching`);
  });
}
