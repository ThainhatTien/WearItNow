# WearItNow - Frontend User

This is the frontend user application for WearItNow, an e-commerce platform for fashion products.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/WearItNow-FrontEnd-User.git
cd WearItNow-FrontEnd-User
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
# API Keys for GHN Shipping Service
REACT_APP_GHN_API_KEY=your_api_key_here
REACT_APP_GHN_SHOP_ID=your_shop_id_here
REACT_APP_GHN_TOKEN=your_token_here
REACT_APP_GHN_SHOP_ID_NUM=your_shop_id_number_here

# API Base URLs
REACT_APP_API_BASE_URL=https://api.wearltnow.online/api
```

4. Start the development server:
```bash
npm start
```

## Environment Variables

The application uses the following environment variables:

| Variable | Description |
|----------|-------------|
| REACT_APP_GHN_API_KEY | API Key for GHN Shipping Service |
| REACT_APP_GHN_SHOP_ID | Shop ID for GHN Shipping Service |
| REACT_APP_GHN_TOKEN | Token for GHN Shipping Service |
| REACT_APP_GHN_SHOP_ID_NUM | Shop ID Number for GHN Shipping Service |
| REACT_APP_API_BASE_URL | Base URL for the backend API |

## Features

- User authentication (login, register, forgot password)
- Product browsing and searching
- Product categories
- Shopping cart
- Checkout process with shipping and payment options
- User profile management
- Order history
- Favorites/wishlist

## Built With

- React.js
- TypeScript
- Tailwind CSS
- Axios for API requests
- React Router for navigation
- Context API for state management

## Project Structure

- `src/components`: Reusable UI components
- `src/context`: Context providers for global state
- `src/hooks`: Custom React hooks
- `src/Interceptors`: API request interceptors
- `src/layout`: Layout components
- `src/modal`: Modal components
- `src/page`: Page components
- `src/routers`: Routing configuration
- `src/services`: API service functions
- `src/stores`: Data models and stores
- `src/styles`: CSS styles
- `src/utils`: Utility functions
- `src/views`: View components

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Submit a pull request

## License

This project is licensed under the MIT License.
