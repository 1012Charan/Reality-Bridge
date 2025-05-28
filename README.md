# RealityBridge

A full-stack location-based web application that allows users to drop interactive pins on a live map, storing metadata like title, category, and description.

## Features

- Interactive map with custom pins
- User authentication with Firebase
- Real-time pin updates
- Mobile-friendly design
- Category-based organization
- Detailed pin information

## Tech Stack

- React
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- MongoDB
- Firebase Authentication
- React-Leaflet
- OpenAI API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   # MongoDB Configuration
   MONGODB_URI=your_mongodb_uri

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── models/          # MongoDB models
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 