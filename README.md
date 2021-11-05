# booking-node-mongo
A booking nodejs rest API with Koa and mongodb

you can find a DevLog at ./dev_log.txt

**Application start**

```npm i```

```docker-compose up```

**Testing**

*Run Integration test*

```npm run test```

Import the insomnia.json file on Insomnia App so you can have a collection of the REST API endpoints

before booking you have to set the restaurant settings. 
use the POST method on the SETTINGS folder of the insomnia collection.

**Api Details**

POST /settings  :   creates the restaurant and set the initial and final time

PUT /settings   :   changes the restaurant settings

POST /table     :   creates an table using a number as a key, there must be at least one table for the manager to create some booking

GET /table      :   returns an list of the restaurant tables and its bookings

POST /booking   :   creates a booking for an table

PATCH /booking  :   allows to change customer and number of chairs

DELETE /booking :   removes a booking for a determined table and date