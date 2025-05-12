const {expect} = require("@playwright/test");
const uniqueName = Date.now();
let createdProductId = {};
let orderIdValue = {};
let prodType = '';

async function captureResponse(response) {
    console.log(`Request failed with status: ${response.status()}`);
    const errorBody = await response.json();

    // You can choose to fail the test or handle specific error codes
    if (response.status() === 400 || 401 || 404 || 500) {
        console.log('Error details:', errorBody);
    }  else {
        console.log(`Unexpected error: ${response.status()} - ${errorBody.message || 'Unknown error'}`);
    }
}

async function performHealthCheck(requestContext, baseUrl, expectedStatus = 200, options = {}) {
    const response = await requestContext.get(`${baseUrl}/status`, options);

    if (response.status() !== expectedStatus) {
        throw new Error(`Health check failed for ${baseUrl}. Expected status: ${expectedStatus}, Actual: ${response.status()}`);
    }

    return {
        ok: response.ok(),
        status: response.status(),
        body: await response.json().catch(() => null)
    };
}

async function createProduct(requestContext, baseUrl, authToken, createReason, testDataConfig, isDataValid) {
    if(isDataValid === 'Invalid') {
         prodType = testDataConfig.InvalidProductType;
    } else {
         prodType = testDataConfig.CreateProductType;
    }
    const productData = {
        name: `Test ${createReason} Product ${uniqueName}`,
        price: testDataConfig.CreateProductPrice,
        productType: `${prodType}`,
        quantity: testDataConfig.CreateProductQuantity
    };

    const createProductResponse = await requestContext.post(`${baseUrl}/products`, {
        data: productData,
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (createProductResponse.ok()) {
        expect(createProductResponse.status()).toBe(201);
        const createProductBody = await createProductResponse.json();
        expect(createProductBody.name).toBe(productData.name);
        expect(createProductBody.price).toBe(productData.price);

        createdProductId.prodId = createProductBody.productId;
        console.log(`Created product ID: ${createdProductId.prodId}`);
    } else {
        console.log('Create product error log: ');
        await captureResponse(createProductResponse);
    }

    return createdProductId.prodId;
}

async function deleteProduct(deleteRequest, baseUrl, authToken, prodId, testDataConfig, isDataValid) {
    if(isDataValid === 'Invalid') {
        prodId = testDataConfig.InvalidProductId;
    }
    const productDeleteResponse = await deleteRequest.delete(`${baseUrl}/products/${prodId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (productDeleteResponse.status() === 200) {
        console.log(`Product deleted: Product id: ${prodId}`);

        // Verify product was deleted
        const getResponse = await deleteRequest.get(`${baseUrl}/products/${prodId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        expect(getResponse.status()).toBe(404);
    } else {
        await captureResponse(productDeleteResponse);
    }
}

async function getProductDetails(getProductRequest, baseUrl, authToken, productId) {
    console.log(`Fetching product details for product id: ${productId}...`);
    const productDetailResponse = await getProductRequest.get(`${baseUrl}/products/${productId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if(productDetailResponse.status() === 200) {
        const productDetailsBody = await productDetailResponse.json();
        expect(productDetailsBody.productId).toBe(productId);
        console.log(`Product details for the Product id: ${productId}:`);
        console.log(productDetailsBody);
    } else {
        await captureResponse(productDetailResponse);
    }
    return await productDetailResponse.json();
}

async function getStockDetails(getStockRequest, baseUrl, authToken, productId) {
    const stockDetailResponse = await getStockRequest.get(`${baseUrl}/orders/product/${productId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if(stockDetailResponse.status() === 200) {
        const stockDetailsBody = await stockDetailResponse.json();
        expect(stockDetailsBody.productId).toBe(productId);
        console.log(`Stock details for the Product id: ${productId}:`);
        console.log(stockDetailsBody);
    } else {
        await captureResponse(stockDetailResponse);
    }
    return await stockDetailResponse.json();
}

async function orderProduct(orderRequest, baseUrl, authToken, orderProdId, orderType, dataConfig) {
    const orderData = {
        orderType: `${orderType}`,
        productId: `${orderProdId}`,
        quantity: dataConfig.OrderQuantity
    };

    const oldProductDetails = await getStockDetails(orderRequest, baseUrl, authToken, orderProdId, dataConfig);
    const oldQuantity = oldProductDetails.currentStock;

    const orderResponse = await orderRequest.post(`${baseUrl}/orders`, {
        data: orderData,
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (orderResponse.status() === 201) {
        const placeOrderBody = await orderResponse.json();
        expect(placeOrderBody.productId).toBe(orderProdId);
        expect(placeOrderBody.orderType).toBe(orderData.orderType);
        expect(placeOrderBody.quantity).toBe(orderData.quantity);

        orderIdValue = placeOrderBody.orderId;
        if (orderType === 'buy') {
            // Check if the order stock details are updated
            const newQuantity = oldQuantity + orderData.quantity;
            const buyProductDetails = await getStockDetails(orderRequest, baseUrl, authToken, orderProdId, dataConfig);
            expect(buyProductDetails.currentStock).toBe(newQuantity);
            console.log(`Buy order created: ${orderIdValue} for product id: ${orderProdId}`);
        } else {
            // Check if the order stock details are updated
            const newQuantity = oldQuantity - orderData.quantity;
            const sellProductDetails = await getStockDetails(orderRequest, baseUrl, authToken, orderProdId, dataConfig);
            expect(sellProductDetails.currentStock).toBe(newQuantity);
            console.log(`Sell order created: ${orderIdValue} for product id: ${orderProdId}`);
        }
    } else {
        await captureResponse(orderResponse);
    }
    return orderIdValue;
}

// Export the function
module.exports = {
    captureResponse,
    performHealthCheck,
    createProduct,
    deleteProduct,
    getProductDetails,
    orderProduct
};
