# Rapyd MNEE Frontend Dashboard

A dashboard is hosted on [http://rapydmnee.duckdns.org/](http://rapydmnee.duckdns.org/) for trying it out.

**Rapyd MNEE Frontend** is a Vue.js-based dashboard that allows you to manage all your merchant activities in one place. With this dashboard, you can:

- View and update merchant details
- Configure webhooks
- Create and import products
- Create subscription sessions
- Generate checkout URLs
- Manage everything from a single dashboard

## Prerequisites

Before running the frontend, make sure the following services are running:

- **Payment Service**: [https://github.com/rapyd-mnee-payment-gateway/paymentservice.git](https://github.com/rapyd-mnee-payment-gateway/paymentservice.git)
- **MNEE Service**: [https://github.com/rapyd-mnee-payment-gateway/mnee-service](https://github.com/rapyd-mnee-payment-gateway/mnee-service)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/rapyd-mnee-payment-gateway/mnee-stripe.git
cd mnee-stripe
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run serve
```

The frontend dashboard should now be running locally, typically on `http://localhost:8080` (or the port shown in your terminal).

## Usage

Once the dashboard is running:

- Connect it with the running **Payment Service** and **MNEE Service**
- Manage products, subscriptions, and checkout sessions directly from the UI
- Update merchant settings and webhooks effortlessly
