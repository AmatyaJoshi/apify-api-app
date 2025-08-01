# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** create a public GitHub issue

Security vulnerabilities should not be disclosed publicly until they have been addressed.

### 2. Report privately

Send an email to: **[your-security-email@example.com]**

Include:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if you have one)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Within 30 days (depending on complexity)

## Security Best Practices

### For Users

1. **API Key Security**
   - Never share your Apify API key
   - Use environment variables in production
   - Rotate API keys regularly
   - Monitor API key usage in Apify Console

2. **Application Security**
   - Keep the application updated
   - Use HTTPS in production
   - Validate all input data
   - Monitor for unusual activity

### For Developers

1. **Code Security**
   - Never commit API keys or secrets
   - Use server-side API routes for sensitive operations
   - Validate and sanitize all user inputs
   - Implement proper error handling

2. **Dependencies**
   - Regularly update dependencies
   - Run security audits: `npm audit`
   - Use tools like Snyk or Dependabot
   - Review dependency licenses

## Current Security Measures

### Client-Side Security
- ✅ API keys never exposed to client-side code
- ✅ Input validation on all forms
- ✅ XSS protection with React's built-in escaping
- ✅ CSRF protection through Next.js

### Server-Side Security
- ✅ All Apify API calls made server-side only
- ✅ Request validation in API routes
- ✅ Error message sanitization
- ✅ Rate limiting considerations

### Infrastructure Security
- ✅ HTTPS enforcement
- ✅ Secure headers configuration
- ✅ Environment variable protection
- ✅ Build-time security checks

## Known Security Considerations

### API Key Handling
- API keys are required for application functionality
- Keys are processed server-side only
- No persistent storage of API keys
- Users maintain full control of their credentials

### Third-Party Dependencies
- Apify Client SDK: Official, well-maintained library
- Next.js: Regular security updates applied
- React: Security-focused framework
- All dependencies: Regularly audited and updated

## Security Updates

Security updates will be:
1. Addressed with highest priority
2. Released as patch versions
3. Documented in [CHANGELOG.md](CHANGELOG.md)
4. Announced through GitHub releases

## Disclosure Policy

- We follow responsible disclosure practices
- Security researchers will be credited (with permission)
- Public disclosure only after fixes are available
- Timeline coordinated with reporter when appropriate

## Contact Information

For security-related questions or concerns:
- **Email**: [your-security-email@example.com]
- **GitHub**: [GitHub Issues](https://github.com/yourusername/apify-actor-executor/issues) (for non-sensitive matters)

---

**Thank you for helping keep Apify Actor Executor secure!** 🔒
