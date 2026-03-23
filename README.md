# Google AI Studio Manager

A comprehensive web application for managing Google AI Studio models with local storage, analytics, and model selection capabilities.

## Features

### 🤖 Model Management
- **Complete Model Inventory**: All your Google AI Studio models in one place
- **Real-time Usage Tracking**: Monitor RPM, TPM, and RPD limits
- **Visual Usage Bars**: Instant visual feedback on rate limit consumption
- **Status Indicators**: Available, Limited, or Unavailable status for each model
- **Smart Filtering**: Filter by category, status, or search by name

### 📊 Analytics Dashboard
- **Usage Overview**: Doughnut chart showing model availability distribution
- **Category Distribution**: Bar chart of models by category
- **RPM/TPM Usage**: Top 10 models by usage percentage
- **Detailed Statistics Table**: Complete usage data for all models
- **Interactive Charts**: Powered by Chart.js for responsive visualizations

### 💬 Chat Interface
- **Model Selection**: Choose from available models for conversations
- **Chat History**: Persistent conversation history stored locally
- **Model-Specific Context**: Each conversation tied to selected model
- **Clean Interface**: Modern, responsive chat design

### 💾 Data Management
- **Local Storage**: All data saved locally in browser
- **Export Functionality**: Download data as JSON file
- **Import Capability**: Restore data from backup files
- **Persistent Settings**: Your preferences and data survive browser restarts

## Model Categories Included

### Text-out Models
- Gemini 2.5 Flash, Gemini 3.1 Flash Lite, Gemini 2.5 Flash Lite
- Gemini 2.5 Pro, Gemini 2 Flash, Gemini 2 Flash Exp
- Gemini 2 Flash Lite, Gemini 3 Flash, Gemini 3.1 Pro

### Multi-modal Generative Models
- Gemini 2.5 Flash TTS, Gemini 2.5 Pro TTS
- Imagen 4 Generate, Imagen 4 Ultra Generate, Imagen 4 Fast Generate
- Nano Banana series, Veo 3 Generate, Veo 3 Fast Generate

### Other Models
- Gemma 3 series (1B, 2B, 4B, 12B, 27B)
- Gemini Embedding 1 & 2
- Gemini Robotics ER 1.5 Preview
- Computer Use Preview

### Agents
- Deep Research Pro Preview

### Live API
- Gemini 2.5 Flash Native Audio Dialog

### Tools
- Map Grounding tools for various Gemini models
- Search Grounding tools

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Usage

### Viewing Models
- Main dashboard shows all models with usage bars
- Color-coded status indicators (green/yellow/red)
- Hover effects for better interactivity

### Filtering Models
- Use category dropdown to filter by model type
- Status filter for availability
- Search bar for quick model lookup

### Analytics
- Click "Analytics" tab to view usage statistics
- Interactive charts update in real-time
- Detailed table shows exact usage percentages

### Chat Interface
- Select "Chat Interface" tab
- Choose model from dropdown
- Type messages and send
- Chat history saved automatically

### Data Management
- Export data using "Export Data" button
- Import previously saved data
- All changes auto-saved to local storage

## Technology Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Charts**: Chart.js for data visualization
- **Icons**: Lucide Icons
- **Storage**: Browser Local Storage
- **Development**: Live Server for hot reloading

## Rate Limit Tracking

The application tracks three key metrics for each model:

- **RPM (Requests Per Minute)**: Current usage vs. limit
- **TPM (Tokens Per Minute)**: Token consumption tracking
- **RPD (Requests Per Day)**: Daily usage monitoring

Visual progress bars show percentage usage for each metric, making it easy to identify which models are approaching their limits.

## Customization

### Adding New Models
Edit `script.js` and add new models to the `modelsData` or `toolsData` arrays:

```javascript
{
    name: "Model Name",
    category: "Category",
    rpm: { used: 0, limit: 100 },
    tpm: { used: 0, limit: 50000 },
    rpd: { used: 0, limit: 1000 },
    status: "available"
}
```

### Custom Styling
Modify Tailwind classes in `index.html` or add custom CSS in the `<style>` section.

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security

- All data stored locally (no server transmission)
- No API keys or sensitive information stored
- Import/export functionality for manual backup

## Future Enhancements

- Real-time API integration with Google AI Studio
- Automated usage tracking via API
- Usage predictions and alerts
- Team collaboration features
- Advanced analytics with trends

## License

MIT License - feel free to use, modify, and distribute.

## Support

For issues or feature requests, please check the project repository or create an issue.

---

**Note**: This is a management interface for Google AI Studio models. Actual API calls require proper authentication and API keys from Google AI Studio.
