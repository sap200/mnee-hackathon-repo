\# Rapyd MNEE – Hackathon Demonstration



This repository contains a \*\*monorepo\*\* implementation of \*\*Rapyd MNEE\*\*, a Stripe-like offsite payment gateway built for e-commerce and subscription use cases using the MNEE stablecoin.



The project was created as part of a hackathon submission under the \*\*Commerce \& Creator Tools\*\* track.



---



\## 🎥 Project Demonstration



A full end-to-end demonstration of the project is provided in the accompanying video.



Otherwise, you can try the system directly using the links below. \*\*Everything is already installed, deployed, and configured.\*\*



The system is fully deployed.



The PrestaShop store and the custom merchant store are demonstrated using \*\*test credentials created by the author\*\* to showcase the complete integration flow.



The Rapyd MNEE dashboard can be tested by signing up as a new merchant.



To test the PrestaShop store locally, you can install PrestaShop and configure the PrestaShop back-office module. This process is shown at the end of this README under \*Setting up your own Rapyd MNEE module for PrestaShop\*.



You can also directly verify the \*\*final integration result\*\* using the live links below.



---



\## 🔗 Live Demo Links (Preconfigured)



\* \*\*Rapyd MNEE Dashboard\*\*

&nbsp; \[http://rapydmnee.duckdns.org/](http://rapydmnee.duckdns.org/)



\* \*\*Custom Merchant Website\*\*

&nbsp; \[http://rapydmnee.duckdns.org:9000/](http://rapydmnee.duckdns.org:9000/)



\* \*\*PrestaShop Store\*\*

&nbsp; \[http://172.233.91.86:9005/prestashop/index.php](http://172.233.91.86:9005/prestashop/index.php)



---



\## 🧱 Monorepo Structure



This monorepo contains all services and integrations required for the platform:



\* `paymentservice` – Spring Boot backend for payments, merchants, payouts, and subscriptions

\* `mnee-service` – Node.js service that communicates with MNEE APIs

\* `mnee-stripe` – Merchant dashboard and hosted checkout/subscription pages

\* `custom-merchant-website` – Example merchant storefront

\* `rapydmnee` – PrestaShop payment module



---



\## ⚙️ Prerequisites



Before setting up the project locally, ensure the following are installed and configured:



\* Create a \*\*MNEE Developer Account\*\* and obtain an API key (Sandbox)

&nbsp; \[https://developer.mnee.net/auth](https://developer.mnee.net/auth)



\* Install \*\*MongoDB\*\* and ensure the service is running



\* Sign up on \*\*Pangea Cloud\*\*

&nbsp; \[https://pangea.cloud/](https://pangea.cloud/)



&nbsp; \* Create a project

&nbsp; \* Enable \*\*AuthN\*\*



\* Install \*\*Java 17\*\*



\* Install \*\*Maven\*\*



\* Install \*\*Node.js (>= 22.0.1)\*\* and npm



---



\## 🚀 Setting Up the Project Locally



\### 1️⃣ Clone the Repository



```bash

git clone <repo-url>

cd <repo-name>

```



---



\## 💳 Payment Service



Navigate to the `paymentservice` directory.



\### Configuration



Edit `application.properties`:



```properties

spring.application.name=paymentservice

server.port=8085

mnee.apikey=<<MNEE\_API\_KEY>>

spring.data.mongodb.uri=mongodb://localhost:27017/mneepay\_db

spring.data.mongodb.database=mneepay\_db

mnee.hosted.page.base=http://localhost:8082/hosted-checkout-page

mnee.hosted.subpage.base=http://localhost:8082/hosted-subscription-page

pangea.token=<<PANGEA\_AUTH\_TOKEN>>

pangea.domain=<<PANGEA\_DOMAIN>>

spring.jackson.deserialization.fail-on-null-for-primitives=false

spring.data.mongodb.auto-index-creation=true

```



Replace the following values:



\* Replace `mnee.apikey` with the API key from your MNEE developer account (run in \*\*sandbox mode\*\*)

\* Replace `spring.data.mongodb.uri` with your MongoDB URI

\* Replace `pangea.token` with the default token from the Pangea dashboard

\* Replace `pangea.domain` with the domain from the Pangea dashboard



\### Run in Developer Mode



```bash

mvn spring-boot:run

```



The service will start on \*\*port 8085\*\*.



---



\## 🔌 MNEE Service



Navigate to the `mnee-service` directory.



\### Install Dependencies



```bash

npm install

```



\### Configuration



Edit `./config/mnee.js`:



```js

const config = {

&nbsp; environment: '<<ENVIRONMENT>>', // production or sandbox

&nbsp; apiKey: '<<MNEE\_API\_KEY>>'

};

```



\* Set `environment` to \*\*production\*\* or \*\*sandbox\*\*

\* Paste the API key obtained from the MNEE developer portal



\### Run



```bash

npm start

```



The service will start on \*\*port 8083\*\*.



---



\## 🖥️ MNEE Stripe-like Dashboard \& Hosted Pages



Navigate to the `mnee-stripe` directory.



\### Configuration



Edit `./src/constants.js`:



```js

export const HOST\_URL = 'http://localhost:8085';

export const MNEE\_HOST\_URL = 'http://localhost:8083';

export const MNEE\_STRIPE\_DASHBOARD = 'RAPYD\_MNEE\_DASHBOARD';

export const LOGIN\_MICRO\_URL = '<<PANGEA\_MICRO\_URL>>';

```



\* `HOST\_URL` should point to the payment service (localhost:8085 if you followed this documentation)

\* `MNEE\_HOST\_URL` should point to the MNEE service (localhost:8083 if you followed this documentation)

\* For `LOGIN\_MICRO\_URL`, copy the \*\*Pangea Micro URL\*\* from the \*Branding\* section under \*\*AuthN\*\*



\### Run



```bash

npm run serve

```



This should start the server on \*\*port 8082\*\*.



If it runs on a different port, copy the correct URL and update the following in `paymentservice/application.properties`:



```properties

mnee.hosted.page.base=<<HOST>>/hosted-checkout-page

mnee.hosted.subpage.base=<<HOST>>/hosted-subscription-page

```



After updating, restart the payment service.



---



\## 🛍️ Custom Merchant Website



Update the configuration in the merchant code:



```js

const merchantId = "<<YOUR\_MERCHANT\_ID>>";

const merchantApiKey = "<<YOUR\_MERCHANT\_API\_KEY>>";

const HOST\_URL = 'http://localhost:8081';

const source = "CUSTOM\_MERCHANT\_STORE";

```



After signing up on the dashboard, copy your \*\*merchantId\*\*, \*\*merchant API key\*\*, and the \*\*payment service host URL\*\*.



Open `index.html` in the browser to test the checkout flow.



---



\## 🧩 PrestaShop Integration (Rapyd MNEE Module)



Navigate to the `rapydmnee` folder.



\### Configure API Base URL



Edit `./controllers/payment.php`:



```php

private $apiBaseUrl = 'http://172.31.48.1:8085';

```



Replace the URL with your payment service host.



\### Package Module



Zip the entire `rapydmnee` folder.



\### Install PrestaShop



Follow the official installation guide:

\[https://prestashop.com/blog/tech-en/how-to-install-prestashop-complete-step-by-step-guide-for-beginners/](https://prestashop.com/blog/tech-en/how-to-install-prestashop-complete-step-by-step-guide-for-beginners/)



\### Install and Configure Module



1\. Go to \*\*PrestaShop Back Office → Module Manager\*\*

2\. Upload the zipped `rapydmnee` module

3\. Click \*\*Configure\*\*

4\. Enter the API key obtained from the Rapyd MNEE dashboard (running on port 8082)

5\. Click \*\*Save\*\*



\### Test Checkout



\* Browse the store

\* Add products to the cart

\* Proceed to checkout

\* Select \*\*Pay by Rapyd MNEE\*\*



The payment will redirect to the hosted checkout page and complete exactly as shown in the demonstration video.



---



\## ✅ Notes for Judges



\* All flows demonstrated in the video are fully functional

\* Live links are provided for quick evaluation

\* Local setup instructions are included for full verification



Thank you for reviewing this project 🙌



