import * as dotenv from 'dotenv';
dotenv.config();

export const testConfig = {
    BaseURL: 'https://apiforshopsinventorymanagementsystem.onrender.com',
    TestUserName: 'user01',
    TestUserPassword: 'secpassword*',
    CreateProductPrice: 29.99,
    CreateProductQuantity: 100,
    CreateProductType: 'games',
    UpdateProductName: 'Updated Product',
    UpdateProductPrice: 39.99,
    UpdateProductQuantity: 75,
    OrderQuantity: 2,
    InvalidProductType: 'type',
    IncorrectProductId: 123
};
