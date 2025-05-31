# AI Writer - Local Inference App

A beautiful, modern AI writing assistant that runs entirely on your local machine using Ollama. No cloud APIs, no data sharing - everything stays private and local.

![AI Writer App](https://img.shields.io/badge/AI-Writer-blue) ![Ollama](https://img.shields.io/badge/Powered%20by-Ollama-green) ![Local](https://img.shields.io/badge/100%25-Local-red) ![Privacy](https://img.shields.io/badge/Privacy-First-orange)

## 🎯 App Type Selected: AI Writer

This app can generate three types of content:
- **📖 Stories**: Creative short stories and narratives
- **✍️ Blog Intros**: Professional blog introductions
- **🐦 Tweets**: Engaging social media posts

## ✨ Features

### Core Features
- ✅ **Prompt Input Box**: Clean, expandable textarea for your ideas
- ✅ **Model Output Display**: Beautiful formatted output with syntax highlighting
- ✅ **Temperature Setting**: Adjustable creativity slider (0.1 - 1.5)
- ✅ **Loading UI**: Elegant spinner with generation status
- ✅ **Output Logging**: Local file logging (`outputs.log`) + frontend history

### Advanced Features
- 🧠 **Multiple Models**: Support for all Gemma 3 variants (1B, 4B, 12B, 27B)
- 🎨 **Content Types**: Specialized prompts for stories, blog posts, and tweets
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🔄 **Real-time Status**: Live Ollama connection monitoring
- 📋 **Copy to Clipboard**: One-click copying of generated content
- 🔄 **Regenerate**: Easy regeneration with same settings
- 📚 **History**: Local browser storage of recent generations
- 🎯 **Smart Placeholders**: Context-aware input suggestions
- 🌈 **Beautiful UI**: Modern glassmorphism design with smooth animations

## 🚀 How to Run the App Locally

### Prerequisites

1. **Install Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)

2. **Install Ollama**
   - Download from [ollama.ai](https://ollama.ai/)
   - Make sure it's running on port 11434

3. **Download a Model**
   ```bash
   # Recommended model (best balance of speed/quality)
   ollama pull gemma3:4b
   
   # Alternative models
   ollama pull gemma3:1b    # Faster, smaller
   ollama pull gemma3:12b   # Better quality
   ollama pull gemma3:27b   # Best quality (requires more RAM)
   ```

### Setup Instructions

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd ai-writer-local
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Ollama** (if not already running)
   ```bash
   ollama serve
   ```

4. **Run the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically check Ollama connection status

### Development Mode

For development with auto-reload:
```bash
npm run dev
```

## 🤖 Model Used

**Primary Model**: Gemma 3 4B (`gemma3:4b`)
- **Size**: 3.3GB
- **Context Window**: 128K tokens
- **Type**: Multimodal (Text + Image)
- **Performance**: Excellent balance of speed and quality

**Supported Models**:
- `gemma3:1b` - Fast, lightweight (815MB)
- `gemma3:4b` - Recommended (3.3GB)
- `gemma3:12b` - High quality (8.1GB)
- `gemma3:27b` - Best quality (17GB)

The app automatically detects available models and populates the dropdown.

## 🎮 How to Use

1. **Select Content Type**
   - Choose between Story, Blog Intro, or Tweet
   - Each type has specialized prompts for better results

2. **Choose Your Model**
   - Select based on your hardware and quality needs
   - 4B is recommended for most users

3. **Adjust Creativity**
   - Use the temperature slider to control randomness
   - Lower values = more focused and conservative
   - Higher values = more creative and varied

4. **Enter Your Prompt**
   - Type your topic or idea in the input box
   - Use Ctrl+Enter for quick generation

5. **Generate Content**
   - Click Generate or use Ctrl+Enter
   - Watch the beautiful loading animation
   - Copy or regenerate as needed

6. **Browse History**
   - View your recent generations
   - Click any history item to reload it

## 📁 Project Structure

```
ai-writer-local/
├── package.json          # Dependencies and scripts
├── server.js             # Express server with Ollama integration
├── outputs.log           # Local generation logging (created automatically)
├── README.md             # This file
└── public/
    ├── index.html        # Main HTML file
    ├── styles.css        # Beautiful CSS with animations
    └── script.js         # JavaScript for all interactions
```

## 🔧 API Endpoints

- `GET /` - Serve the main application
- `POST /api/generate` - Generate content with Ollama
- `GET /api/models` - Get available Ollama models
- `GET /api/health` - Check Ollama connection status

## 🎨 Design Features

- **Glassmorphism UI**: Modern transparent design with blur effects
- **Gradient Backgrounds**: Beautiful purple-blue gradients
- **Smooth Animations**: Fade-ins, hover effects, and transitions
- **Responsive Layout**: Perfect on all screen sizes
- **Dark/Light Accents**: Careful color balance for readability
- **Loading States**: Engaging spinners and status indicators

## 📝 Output Logging

The app logs all generations in two ways:

1. **Local File**: `outputs.log` (JSON format for analysis)
2. **Browser Storage**: Recent generations with click-to-reload

Log entry format:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "prompt": "A magical forest adventure",
  "output": "Generated story content...",
  "type": "story",
  "model": "gemma3:4b",
  "temperature": 0.7
}
```

## 🔒 Privacy & Security

- ✅ **100% Local**: No data leaves your machine
- ✅ **No API Keys**: No external services required
- ✅ **Private Storage**: All history stored locally
- ✅ **Open Source**: Full transparency in code

## 🐛 Troubleshooting

### Ollama Connection Issues
- Ensure Ollama is installed and running
- Check that port 11434 is available
- Restart Ollama service if needed

### Model Not Found
- Pull the model using `ollama pull gemma3:4b`
- Check available models with `ollama list`

### Slow Generation
- Try a smaller model (gemma3:1b)
- Lower the temperature setting
- Ensure sufficient RAM/VRAM

## 🚀 Performance Tips

- **RAM Requirements**:
  - 1B model: 1GB RAM
  - 4B model: 4GB RAM
  - 12B model: 8GB RAM
  - 27B model: 16GB RAM

- **Speed Optimization**:
  - Use SSD storage for better I/O
  - Close other applications to free RAM
  - Use GPU acceleration if available

## 📄 License

MIT License - feel free to modify and distribute!

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues and enhancement requests.

---

**Built with ❤️ using Ollama for local AI inference** 