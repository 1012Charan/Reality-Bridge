# Contributing to RealityBridge

Thank you for your interest in contributing to RealityBridge! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project.

## How to Contribute

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables

3. Run the development server:
   ```bash
   npm run dev
   ```

## Coding Standards

- Use TypeScript for type safety
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation when necessary

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation if you're changing functionality
3. The PR will be merged once you have the sign-off of at least one other developer

## Testing

Please ensure your changes are tested before submitting a PR:
- Run the linter: `npm run lint`
- Test the application locally
- Ensure all features work as expected

## Questions?

Feel free to open an issue for any questions or concerns. 