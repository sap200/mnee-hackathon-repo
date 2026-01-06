<template>
  <div class="docs-page">
    <h1>MNEE Checkout & Subscription Integration Docs</h1>

    <!-- ========================= -->
    <!-- SECTION 1: CHECKOUT -->
    <!-- ========================= -->
    <section class="doc-section">
      <h2>1. One-Time Checkout Integration</h2>
      <p>
        Use this snippet to create a checkout session and redirect your customer
        to the MNEE hosted checkout page.
      </p>

      <div class="api-endpoint">
        <b>Checkout API Endpoint: </b>
        <code>{{ HOST_URL }}/checkout-session/create</code>
      </div>

      <pre class="code-block">
<span class="keyword">async</span> function checkout(productId, quantity) {
  <span class="keyword">try</span> {
    <span class="keyword">const</span> bodyData = {
      merchantApiKey: "abcd-1234-acdc-11scs-a0dsa",
      name: "checkout_" + productId,
      itemList: [
        { productObjectId: productId, quantity: quantity }
      ],
      source: "CUSTOM_MERCHANT_WEBSITE_1"
    }

    <span class="keyword">const</span> res = <span class="keyword">await</span> fetch(
      CHECKOUT_API_ENDPOINT,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      }
    )

    <span class="keyword">const</span> data = <span class="keyword">await</span> res.json()

    <span class="comment">// Redirect to hosted checkout page</span>
    window.location.href = data.checkoutSession.hostedPage

  } <span class="keyword">catch</span> (e) {
    alert("Checkout failed")
  }
}
      </pre>
    </section>

    <hr />

    <!-- ========================= -->
    <!-- SECTION 2: SUBSCRIPTION -->
    <!-- ========================= -->
    <section class="doc-section">
      <h2>2. Subscription Integration (Hosted Page)</h2>

      <p>
        MNEE supports recurring subscriptions using a hosted subscription page.
        Merchants must first create a subscription object, then redirect the
        customer to the hosted page returned in the API response.
      </p>

      <div class="api-endpoint">
        <b>Subscription API Endpoint: </b>
        <code>{{ HOST_URL }}/subscription/create-customer-subscription</code>
      </div>

      <pre class="code-block">
<span class="keyword">async</span> function createSubscription(planId, customerId) {
  <span class="keyword">try</span> {
    <span class="keyword">const</span> bodyData = {
      planId: planId,
      customerId: customerId
    }

    <span class="keyword">const</span> res = <span class="keyword">await</span> fetch(
      SUBSCRIPTION_API_ENDPOINT,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      }
    )

    <span class="keyword">const</span> data = <span class="keyword">await</span> res.json()

    <span class="comment">// Redirect to hosted subscription page</span>
    window.location.href = data.hostedSubscriptionPage

  } <span class="keyword">catch</span> (e) {
    alert("Subscription creation failed")
  }
}
      </pre>

      <p>
        After redirection, the customer completes payment on the hosted page.
        Once successful, the subscription becomes active.
      </p>
    </section>

    <hr />

    <!-- ========================= -->
    <!-- SECTION 3: EXAMPLES -->
    <!-- ========================= -->
    <section class="doc-section">
      <h2>3. Example Project</h2>
      <ul>
        <li>
          <b>GitHub: </b>
          <a :href="exampleGitHub" target="_blank">
            Example of Rapyd MNEE integration in custom website
          </a>
        </li>
        <li>
          <b>Live Demo: </b>
          <a :href="exampleProject" target="_blank">
            Demo Merchant Website
          </a>
        </li>
      </ul>
    </section><hr>

<section class="doc-section">
  <h2>4. PrestaShop Integration</h2>
  <p> An example of Rapyd MNEE module in prestashop can be found here: 
    <a href="http://rapydmnee.duckdns.org:9005/prestashop/index.php" target="_blank"> Rapyd MNEE prestashop payment module demo</a>
  </p>
  <p>
    To integrate MNEE payments in your PrestaShop store, follow these steps:
  </p>
  <ol>
    <li>
      <p>
      <b>Download the PrestaShop Extension:</b>
      <a href="https://github.com/rapyd-mnee-payment-gateway/rapydmnee/releases/download/alpha/rapydmnee.zip" target="_blank"> Rapyd MNEE prestashop module link</a>
        GitHub Repository
      </p>
    </li>

    <li>
      <b>Upload to PrestaShop Back Office:</b>
      <ul>
        <li>Log in to your PrestaShop admin panel.</li>
        <li>Go to <b>Modules & Services → Upload a module</b>.</li>
        <li>Choose the ZIP file you downloaded from the link above and upload it.</li>
      </ul>
    </li>
    <li>
      <b>Install and Configure the Module:</b>
      <ul>
        <li>Find the MNEE module in <b>Modules & Services → Installed Modules</b>.</li>
        <li>Click <b>Install</b>.</li>
        <li>Open the configuration page for the module.</li>
        <li>Paste your <b>Merchant API Key</b> obtained from your MNEE merchant account.</li>
        <li>Save the configuration.</li>
      </ul>
    </li>
    <li>
      <b>Start Accepting Payments:</b> Once the module is configured, your store can start processing payments through MNEE.
    </li>
  </ol>
  <p>
    <b>Note:</b> Make sure your Merchant API Key is valid. 
  </p>
</section>


  </div>
</template>

<script>
import { HOST_URL } from '@/constants.js'

export default {
  name: "DocsPage",
  data() {
    return {
      HOST_URL,
      merchantApiKey: "your_merchant_api_key_here",
      source: "web_demo",
      exampleGitHub: "https://github.com/rapyd-mnee-payment-gateway/custom-merchant-store",
      exampleProject: "http://rapydmnee.duckdns.org:9000/"
    }
  },
  methods: {
    async checkout(productId, quantity) {
      try {
        const bodyData = {
          merchantApiKey: this.merchantApiKey,
          name: "checkout_" + productId,
          itemList: [{ productObjectId: productId, quantity }],
          source: this.source
        }

        const res = await fetch(
          `${this.HOST_URL}/checkout-session/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
          }
        )

        const data = await res.json()
        window.location.href = data.checkoutSession.hostedPage

      } catch (e) {
        alert("Checkout failed")
      }
    },

    async createSubscription(planId, customerId) {
      try {
        const bodyData = {
          planId,
          customerId
        }

        const res = await fetch(
          `${this.HOST_URL}/subscription/create-customer-subscription`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
          }
        )

        const data = await res.json()
        window.location.href = data.hostedSubscriptionPage

      } catch (e) {
        alert("Subscription failed")
      }
    }
  }
}
</script>

<style scoped>
.docs-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  font-family: "Segoe UI", sans-serif;
  background: #f9fafc;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
}

.doc-section {
  margin-bottom: 40px;
  text-align: left;
}

.api-endpoint {
  background-color: #e8f0fe;
  padding: 10px 16px;
  border-left: 4px solid #2b7cff;
  font-family: Consolas, monospace;
  font-size: 14px;
  margin: 10px 0;
}

.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  text-align: left;
  font-family: "Fira Code", Consolas, monospace;
  font-size: 14px;
  white-space: pre;
  line-height: 1.5;
}

.keyword {
  color: #569cd6;
  font-weight: bold;
}

.comment {
  color: #6a9955;
}

a {
  color: #2b7cff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
