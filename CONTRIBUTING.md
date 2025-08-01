# Contributing to Apify Actor Executor

Thank you for your interest in contributing to the Apify Actor Executor! This guide will help you get started.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/apify-actor-executor.git
   cd apify-actor-executor
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🛠 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Apify API key for testing

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Add your Apify API key if needed for testing
3. Start the development server

### Code Style
- **TypeScript**: All new code should be written in TypeScript
- **ESLint**: Run `npm run lint` to check for issues
- **Prettier**: Run `npm run format` to format code
- **Tailwind CSS**: Use Tailwind classes for styling

## 📝 How to Contribute

### Reporting Bugs
1. **Check existing issues** first
2. **Create a new issue** with:
   - Clear, descriptive title
   - Detailed description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

### Suggesting Features
1. **Check existing issues** for similar suggestions
2. **Create a feature request** with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach
   - Mockups or examples if applicable

### Submitting Changes

#### Branch Naming Convention
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation changes
- `refactor/description` - for code refactoring

#### Pull Request Process
1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, well-documented code
   - Follow existing code patterns
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**:
   ```bash
   npm run lint      # Check for linting issues  
   npm run type-check # Check TypeScript types
   npm run build     # Ensure it builds successfully
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```
   
   Use conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Provide a clear title and description
   - Link to related issues
   - Include screenshots for UI changes
   - Mention any breaking changes

## 🏗 Project Structure

```
src/
├── app/
│   ├── api/              # Next.js API routes
│   │   ├── actors/       # Actor-related endpoints
│   │   ├── execute/      # Execution endpoint
│   │   └── user/         # User-related endpoints
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── *.tsx        # Feature components
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript type definitions
│   └── globals.css      # Global styles
```

## 🎨 Component Guidelines

### Creating New Components
1. **Use TypeScript** with proper type definitions
2. **Follow naming conventions**: PascalCase for components
3. **Include JSDoc comments** for complex components
4. **Use Tailwind CSS** for styling
5. **Make components responsive** by default

### Example Component Structure:
```tsx
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  optional?: boolean;
}

/**
 * MyComponent does something specific
 * @param title - The component title
 * @param optional - Optional parameter
 */
export const MyComponent: FC<MyComponentProps> = ({ 
  title, 
  optional = false 
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">{title}</h2>
      {optional && <p>Optional content</p>}
    </div>
  );
};
```

## 🔧 API Development

### Adding New Endpoints
1. Create files in `src/app/api/`
2. Follow Next.js App Router conventions
3. Include proper error handling
4. Add TypeScript interfaces for request/response
5. Validate input parameters
6. Document the endpoint in README.md

### Example API Route:
```tsx
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Implementation here
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🧪 Testing Guidelines

Currently, the project doesn't have automated tests, but we welcome contributions to add:
- Unit tests for components
- Integration tests for API routes
- End-to-end tests for user workflows

## 📚 Documentation

### Updating Documentation
- Update README.md for feature changes
- Add JSDoc comments for new functions
- Update type definitions
- Include code examples where helpful

### Writing Good Documentation
- Be clear and concise
- Include examples
- Explain the "why" not just the "what"
- Keep it up-to-date with code changes

## 🐛 Debugging Tips

### Common Issues
1. **API Key Problems**: Ensure valid Apify API key
2. **CORS Issues**: Check API route configuration
3. **Build Errors**: Run `npm run type-check` first
4. **Styling Issues**: Check Tailwind CSS classes

### Debugging Tools
- Browser Developer Tools
- Next.js built-in error overlay
- Console logging for API routes
- TypeScript compiler errors

## 🎯 Priority Areas for Contribution

We especially welcome contributions in these areas:

### High Priority
- [ ] Unit and integration tests
- [ ] Error boundary components
- [ ] Accessibility improvements
- [ ] Performance optimizations

### Medium Priority  
- [ ] Dark mode support
- [ ] Keyboard navigation
- [ ] Mobile experience improvements
- [ ] Additional actor type support

### Low Priority
- [ ] Internationalization (i18n)
- [ ] Advanced filtering and search
- [ ] Export/import functionality
- [ ] User preferences storage

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: Tag maintainers in PRs for review

## 📜 Code of Conduct

Please be respectful and constructive in all interactions. We're building a welcoming community for everyone interested in web scraping and automation.

### Guidelines:
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the golden rule

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

---

**Ready to contribute? Pick an issue labeled "good first issue" and get started!** 🚀

Thank you for helping make the Apify Actor Executor better for everyone!
