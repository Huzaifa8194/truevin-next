# Vehicle Inventory Next.js Application

This is a Next.js application for browsing and searching vehicle inventory. The application features server-side rendering for vehicle details and search results, with a modern UI built using Tailwind CSS.

## Features

- Server-side rendered vehicle detail pages
- Server-side rendered search results
- Infinite scroll vehicle list
- 360-degree image viewer
- Responsive design
- Google AdSense integration
- SEO optimization with dynamic meta tags

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Google AdSense account (for ads)
- API key for vehicle data

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd vin-next
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API key:
```
API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── vehicle/           # Vehicle detail pages
│   ├── search/            # Search results page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx        # Navigation bar
│   ├── Footer.tsx        # Footer
│   ├── VehicleList.tsx   # Vehicle list with infinite scroll
│   ├── SearchBar.tsx     # Search functionality
│   ├── Custom360Spin.tsx # 360-degree image viewer
│   ├── DynamicMeta.tsx   # Dynamic meta tags
│   └── GoogleAd.tsx      # Google AdSense component
└── types/                # TypeScript type definitions
```

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deployment

The application can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or a custom server.

## Environment Variables

- `API_KEY`: Your API key for accessing vehicle data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
