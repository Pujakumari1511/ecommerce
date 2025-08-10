## Run Locally

Clone the project

```bash
  git clone https://dredsoftlabs-admin@bitbucket.org/dredsoftlabs/ecommerce.git
```

Go to the project directory

```bash
  cd eCommerce
```

Install dependencies

```bash
  npm install

  or 

  npm install react-material-ui-carousel --save --legacy-peer-deps
```

Start the server

```bash
  npm start
```

The server should now be running. You can access the application by opening a web browser and entering the following URL:

```bash
  http://localhost:3000
```

# AI DEVELOPER TEST

## AI feature
Smart Product Search (NLP)

## AI used
Gemini

## model 
gemini-2.0-flash

## Google API using google library
install google genai library
``npm install @google/genai``

## AI featured used
function calling (which translate the user's search query in natural language into structured filter criteria). This is done in the file [gemini.js](https://github.com/Pujakumari1511/ecommerce/blob/main/api/utils/gemini.js)

## Set up
generate google api key from google AI studio and save it in .env file with the key GEMINI_API_KEY

## Assumptions
- Instead of fetching the products from https://fakestoreapi.com/products from frontend, I am fetching it from backend as I would be having control in applying the filter in the backend.
- I have used CORS to allow the network call from localhost:3000 (frontend) to localhost:4000(backend) to avoid the cors error in the browser.
- I have temporarily comented all the mongose model processing to avoid the mongo db calls.
- Assuming that if user will search something which is not in category, then matching the search query in title and description of the product. In case it is not found there in title and description, I am assuming to show the existing list with whatever filter applied instead of empty list.
For example: search query -> "Show me watches less then 500$ having rating more than 4"
This will translate to filter criteria as: 
  ```
  {
    query: "watches",
    price_max: 500,
    rating_min: 4
  }
  ```
  if the product catalog doesn't find the query text which is "watches" in this case, in any title or description, then it will only apply the filter of price_max and rating_min, so that user will not see empty search results
