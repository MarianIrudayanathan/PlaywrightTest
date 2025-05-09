const { test, expect} = require('@playwright/test');
const {testConfig} = require('../Configs/config');
const {captureResponse, performHealthCheck, createProduct, deleteProduct, getProductDetails, orderProduct} = require('../utils/apiHelper');
const BASE_URL = testConfig.BaseURL;
const testUser = {
  username: `${testConfig.TestUserName}`,
  password: `${testConfig.TestUserPassword}`,
  incorrectPassword: `${testConfig.IncorrectPassword}`
};
let authToken = '';
const uniqueId = Date.now();
let updatedProductName = {};
let requestContext;
let productId = {};
let stockProductId = {};
let buyOrderId = {};
let sellOrderId = {};

test.beforeAll(async ({ playwright }) => {
  requestContext = await playwright.request.newContext({
    baseURL: `${BASE_URL}`,
  });
});

test.afterAll(async () => {
  await requestContext.dispose();
});

// Login to get auth token
test.beforeAll(async ({ request }) => {
  try {
    await performHealthCheck(requestContext, BASE_URL);
    console.log('Health check passed, proceeding with tests');
  } catch (error) {
    console.error('Health check failed:', error.message);
    throw error; // Fail the test setup
  }

  const loginResponse = await request.post(`${BASE_URL}/auth/login`, {
    data: {
      username: testUser.username,
      password: testUser.password
    }
  });

  if(loginResponse.ok()){
    expect(loginResponse.ok()).toBeTruthy();
    const loginBody = await loginResponse.json();
    console.log(loginBody);
    authToken = loginBody.token;
    expect(authToken).toBeTruthy();
    console.log('Authentication successful');
  } else {
    await captureResponse(loginResponse);
  }
});

//

// Product Management API Tests
test.describe.serial('Product Management API Tests', () => {

  // Create a category first to use with products
  test('1. Create a new product', async () => {
    console.log ('Creating a new product...');
    productId = await createProduct(requestContext, BASE_URL, authToken, 'New', testConfig);
  });

// Update a product
  test('2. Update a product', async ({ request }) => {
    console.log(`Updating product details for product id: ${productId}...`);
    const updatedData = {
      name: `${testConfig.UpdateProductName} + ${uniqueId}`,
      price: testConfig.UpdateProductPrice,
      quantity: testConfig.UpdateProductQuantity
    };

    const updateProductResponse = await request.put(`${BASE_URL}/products/${productId}`, {
      data: updatedData,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (updateProductResponse.status() === 200) {
      // Get the product details and check if they are updated
      const productDetails = await getProductDetails(requestContext, BASE_URL, authToken, productId);
      expect(updateProductResponse.ok()).toBeTruthy();
      const body = await updateProductResponse.json();
      updatedProductName.prodName = body.name;
      expect(productDetails.name).toBe(updatedData.name);
      expect(productDetails.price).toBe(updatedData.price);
      expect(productDetails.quantity).toBe(updatedData.quantity);
      console.log(`Product updated successfully: ${body.name}`);
    } else {
      await captureResponse(updateProductResponse);
    }

  });

  // Delete a product
  test('3. Delete a product', async () => {
    console.log(`Deleting product: ${productId}...`)
    await deleteProduct(requestContext, BASE_URL, authToken, productId);
  });

  // Get all products
  test('Get all products', async ({ request }) => {
    console.log('Getting all product details....');
    const productListResponse = await request.get(`${BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (productListResponse.status() === 200) {
      const body = await productListResponse.json();
      expect(Array.isArray(body)).toBeTruthy();

      // Log the number of products
      console.log(`Total products found: ${body.length}`);
    } else {
      await captureResponse(productListResponse);
    }
  });

});

// Stock  Management API Tests
test.describe('Stock Management API Tests', () => {
  // Create a new order
  test('Create a new order and check stock', async () => {
    console.log('Placing a new order...');
    //Create a product
    stockProductId = await createProduct(requestContext, BASE_URL, authToken, 'Stock', testConfig);

    //Insufficient stock to sell orders
    await orderProduct(requestContext, BASE_URL, authToken, stockProductId, 'sell', testConfig);

    // Place a buy order
    buyOrderId = await orderProduct(requestContext, BASE_URL, authToken, stockProductId, 'buy', testConfig);

    // Place a sell order
    sellOrderId = await orderProduct(requestContext, BASE_URL, authToken, stockProductId, 'sell', testConfig);
  });

});

// Error Handling Tests
test.describe('Error Handling Tests', () => {

  // Test incorrect product type
  test('Incorrect product type', async () => {
    console.log('Checking for incorrect product type in creating a product... ');
    await createProduct(requestContext, BASE_URL, authToken, 'New', testConfig, 'Invalid');
  });

  test('No product found to update', async () => {
    console.log('Checking for product to delete... ');
    let incorrectProductId = testConfig.IncorrectProductId;
    await deleteProduct(requestContext, BASE_URL, authToken, incorrectProductId, testConfig, 'Invalid');
  });


});


