# Apify Actor Executor

A modern web application built with Next.js that integrates with the Apify platform to execute web scraping actors with dynamic, schema-based forms.

![Apify Actor Executor Demo](./docs/demo-workflow.png)

## 🚀 Features

- **Secure API Integration**: Server-side API key handling for security
- **Dynamic Actor Discovery**: Browse and select from available Apify actors
- **Schema-Based Forms**: Automatically generated forms based on actor input schemas
- **Real-time Execution**: Execute actors and view results in real-time
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Progressive Workflow**: Step-by-step guided process (API key → Actor selection → Execution)

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, App Router
- **Backend**: Next.js API routes
- **API Integration**: Apify Client SDK
- **UI Components**: Lucide React for icons
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Advanced Animations**: GSAP for complex timeline-based animations
- **Styling**: Tailwind CSS with responsive design

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- An Apify account with API access
- Your Apify API token (available in your [Apify Console](https://console.apify.com/account/integrations))

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/apify-actor-executor.git
   cd apify-actor-executor
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Enter your Apify API key**
   - Get your API token from [Apify Console](https://console.apify.com/account/integrations)
   - Enter it in the application to start using actors

## 🏗 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── actors/           # Actor listing and schema endpoints
│   │   ├── execute/          # Actor execution endpoint
│   │   ├── store-actors/     # Actor storage endpoint
│   │   └── user/            # User profile endpoint
│   ├── components/          # React components
│   │   ├── ApiKeyForm.tsx   # API key input form
│   │   ├── ActorSelector.tsx # Actor selection interface
│   │   ├── ActorExecutor.tsx # Actor execution interface
│   │   ├── DynamicForm.tsx  # Dynamic form generator
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility functions
│   ├── types/               # TypeScript type definitions
│   └── globals.css          # Global styles
```

## 🔌 API Endpoints

### `GET /api/actors`
List all available actors for the authenticated user.

**Headers:**
- `x-api-key`: Apify API token

**Response:**
```json
{
  "data": {
    "items": [
      {
        "id": "actor_id",
        "name": "Actor Name",
        "description": "Actor description",
        "username": "username"
      }
    ]
  }
}
```

### `GET /api/actors/[id]`
Get the input schema for a specific actor.

**Parameters:**
- `id`: Actor ID

**Headers:**
- `x-api-key`: Apify API token

### `POST /api/execute`
Execute an actor with provided input data.

**Body:**
```json
{
  "actorId": "actor_id",
  "input": {
    // Actor-specific input data
  }
}
```

## 🔒 Security Features

- **Server-side API calls**: All Apify API interactions happen on the server
- **API key protection**: API keys are never exposed to the client
- **Input validation**: Both client and server-side validation
- **Error sanitization**: Error messages are sanitized before sending to client

## 🎯 Recommended Testing Actors

Here are some great actors to test the application with:

1. **Web Scraper** (`apify/web-scraper`)
   - General-purpose web scraping
   - Good for testing various input types
   - Complex schema with multiple configuration options

2. **Google Search Results Scraper** (`apify/google-search-scraper`)
   - Simple input schema (just search queries)
   - Fast execution for testing
   - Great for beginners

3. **Website Content Crawler** (`apify/website-content-crawler`)
   - Complex schema with multiple input types
   - Great for testing form generation
   - Demonstrates advanced form handling

4. **Instagram Scraper** (`apify/instagram-scraper`)
   - Medium complexity
   - Good for testing different data types
   - Popular use case

## 🎨 Design Decisions

### Architecture Choices
- **Next.js App Router**: Modern routing with server components where beneficial
- **API Routes**: Secure server-side API integration prevents API key exposure
- **Component Composition**: Modular, reusable React components for maintainability
- **TypeScript**: Full type safety across the application

### UI/UX Principles
- **Progressive Disclosure**: Step-by-step workflow (API key → Actor selection → Execution)
- **Dynamic Schema Handling**: Automatic form generation based on actor requirements
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for transitions, hover effects, and micro-interactions
- **Advanced Motion**: GSAP for complex timeline-based animations and scroll-triggered effects
- **Loading States**: Clear feedback during API operations with animated indicators
- **Error Boundaries**: Graceful error handling with user-friendly messages

### Performance Optimizations
- **Server-side Rendering**: Faster initial page loads
- **Component Lazy Loading**: Reduced bundle size
- **API Response Caching**: Improved user experience
- **Form Validation**: Client-side validation for immediate feedback

## 🧪 Usage Examples

### Basic Web Scraping
1. Enter your Apify API key
2. Select "Web Scraper" actor
3. Configure:
   - **Start URLs**: `["https://apify.com"]`
   - **Page Function**: Custom scraping logic
   - **Max Pages**: `10`
4. Execute and view results

### Google Search Scraping
1. Select "Google Search Results Scraper"
2. Configure:
   - **Queries**: `["web scraping tools", "apify platform"]`
   - **Results per Query**: `10`
   - **Country Code**: `US`
3. Execute to get search results data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**API Key Issues**
- Ensure your API key is valid and has the necessary permissions
- Check if your Apify account has sufficient credits

**Actor Not Found**
- Verify the actor ID is correct
- Make sure the actor is publicly available or you have access

**Form Generation Issues**
- Some actors may have complex schemas that require manual handling
- Check the browser console for detailed error messages

**Execution Failures**
- Check actor-specific requirements and input validation
- Verify your input data format matches the schema

## 🌟 Acknowledgments

- [Apify](https://apify.com) for providing the excellent web scraping platform
- [Next.js](https://nextjs.org) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations and micro-interactions
- [GSAP](https://greensock.com/gsap/) for powerful timeline-based animations
- [Lucide](https://lucide.dev) for the beautiful icons

## 📊 Demo & Screenshots

### Demo Video
🎥 **Coming Soon**: A complete walkthrough video demonstrating the full workflow from API key input to actor execution and results visualization.

### Screenshots
📸 **Coming Soon**: Screenshots showing:
- Landing page with feature highlights
- API key input form with secure validation
- Actor selection interface with search and filtering
- Dynamic form generation based on actor schemas
- Real-time execution progress and results display
- Mobile-responsive design across all devices

### Application Flow
1. **API Key Input**: Secure authentication with your Apify credentials
2. **Actor Selection**: Browse through your available actors with search and filtering
3. **Dynamic Form**: Auto-generated form based on the selected actor's input schema
4. **Execution & Results**: Real-time execution with formatted result display

### Key Features Demo
- Dynamic form generation adapts to any actor's schema with smooth transitions
- Real-time validation and error handling with animated feedback
- Responsive design works on all devices with fluid animations
- Secure API key handling (never exposed to client-side)
- Framer Motion animations for seamless user experience
- GSAP-powered scroll effects and complex timeline animations

---

**Ready to start web scraping with a beautiful, type-safe interface? Get started now!** 🚀

1. **Enter API Key**: Start by entering your Apify API key
2. **Select Actor**: Browse and select an actor from your available actors
3. **Configure Input**: Fill out the dynamically generated form based on the actor's schema
4. **Execute**: Run the actor and view results in real-time

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── actors/
│   │   │   ├── route.ts          # List actors
│   │   │   └── [id]/route.ts     # Get actor schema
│   │   └── execute/route.ts      # Execute actor
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main application page
├── components/
│   ├── ActorExecutor.tsx         # Actor execution interface
│   ├── ActorSelector.tsx         # Actor selection component
│   ├── ApiKeyForm.tsx            # API key input form
│   └── DynamicForm.tsx           # Schema-based form generator
└── types/
    └── apify.ts                  # TypeScript type definitions
```

## API Endpoints

- `GET /api/actors` - List available actors
- `GET /api/actors/[id]` - Get actor details and input schema
- `POST /api/execute` - Execute an actor with input data

## Security Features

- API keys are handled server-side only
- All Apify API calls go through Next.js API routes
- Input validation on both client and server side
- Secure headers and error handling

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Design Decisions

### Architecture
- **Next.js App Router**: Modern routing with server components where beneficial
- **API Routes**: Secure server-side API integration
- **Component Composition**: Modular, reusable React components

### UI/UX
- **Progressive Disclosure**: Step-by-step workflow (API key → Actor selection → Execution)
- **Dynamic Schema Handling**: Automatic form generation based on actor requirements
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Clear feedback during API operations

### Error Handling
- **User-Friendly Messages**: Clear error descriptions
- **Graceful Degradation**: Fallbacks for missing data
- **Validation**: Both client and server-side input validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
