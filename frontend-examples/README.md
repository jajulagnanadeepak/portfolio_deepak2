# Frontend Components for Portfolio Architecture Page

This folder contains frontend components that work with your backend API.

## Files Included

1. **Footer.jsx** - Footer component with "Design" link
2. **PortfolioArchitecture.jsx** - Portfolio Architecture page component
3. **App-Routing-Example.jsx** - Example routing setup

## Setup Instructions

### 1. Install Dependencies (if not already installed)
```bash
npm install react-router-dom
```

### 2. File Structure
```
src/
  components/
    Footer.jsx
  pages/
    PortfolioArchitecture.jsx
  App.jsx
```

### 3. Environment Variables
Create a `.env` file in your frontend root:
```
REACT_APP_API_BASE=http://localhost:5000
```

### 4. Update Your App.jsx
Use the routing example provided in `App-Routing-Example.jsx`

### 5. Features

- **Footer Component**: 
  - Contains "Design" link that navigates to `/design`
  - Responsive design matching your portfolio theme
  - Hover effects on links

- **Portfolio Architecture Page**:
  - Displays system architecture overview
  - Fetches and displays projects from your backend API
  - Shows technology stack
  - Responsive grid layout
  - Back button navigation

## API Endpoints Used

- `GET /api/v1/projects` - Fetches all projects to display on architecture page

## Styling

All components use inline styles matching your portfolio's dark theme:
- Background: `#0e0f12`
- Text: `#e8eaf1`
- Accent: `#7cd3ff`
- Borders: `#232531`

You can easily convert these to CSS modules or styled-components if preferred.



