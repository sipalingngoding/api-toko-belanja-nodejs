const {describe, beforeEach, test, expect, afterAll} = require("@jest/globals");
const {removeCategoryTest, removeProductTest, insertCategoryTest, insertProductTest, lastIdCategory, lastProductId,
    AllProducts
} = require("../util-test");
const NotFoundError = require("../../src/error/not-found-error");
const {ValidationError} = require("sequelize");

const productService = new (require('../../src/service/product-service'));

beforeEach(async ()=>{
    await removeProductTest();
    await removeCategoryTest();
    await insertCategoryTest();
    await insertProductTest();
});

describe('TEST Get products', () => {
    test('get product success',async ()=>{
        const products = await productService.getAll();
        expect(products).toHaveLength(2);
        expect(products[0]).toHaveProperty('title','Makaroni');
        expect(products[0]).toHaveProperty('price',10000);
        expect(products[0]).toHaveProperty('stock',6);
        expect(products[0]).toHaveProperty('categoryId',await lastIdCategory()-1);
        expect(products[1]).toHaveProperty('title','Laptop');
        expect(products[1]).toHaveProperty('price',8000000);
        expect(products[1]).toHaveProperty('stock',8);
        expect(products[1]).toHaveProperty('categoryId',await lastIdCategory());
    });
});

describe('Test get by id', () => {
    test('get product success',async ()=>{
        const product = await productService.getByPk(await lastProductId());
        expect(product).not.toBeNull();
        expect(product).toHaveProperty('title','Laptop')
        expect(product).toHaveProperty('price',8000000)
    });

    test('get product fail, not found',async ()=>{
        await expect(productService.getByPk(await lastProductId()+1)).rejects.toThrow(NotFoundError);
    });
});

describe('Test add product', () => {
    test('add product success',async ()=>{
        const id = await productService.add({title : 'Hanphone',price : 4500000,stock: 5,categoryId : await lastIdCategory()});
        expect(await lastProductId()).toBe(id);
        const products = await AllProducts();
        expect(products).toHaveLength(3);
    });

    test('add product fail, category not found',async ()=>{
        await expect(productService.add({title : 'Hanphone',price : 4500000,stock: 10,categoryId : await lastIdCategory()+1})).rejects.toThrow(NotFoundError);
        const products = await AllProducts();
        expect(products).toHaveLength(2);
    });

    test('add product fail, invalid  input',async ()=>{
       await expect(productService.add({title : 'hand',price : 4500000, stock: 9,categoryId : await lastIdCategory()})).rejects.toThrow(ValidationError);
       const products = await AllProducts();
       expect(products).toHaveLength(2);
    });
});

describe('Test update product', () => {
    test('update product success',async ()=>{
        await expect(productService.update({title : 'Mackbook',productId : await lastProductId(),stock: 0})).resolves.toBeTruthy();
        const product = await productService.getByPk(await lastProductId());
        expect(product).toHaveProperty('title','Mackbook');
    });

    test('update product fail, not found',async ()=>{
        await expect(productService.update({title : 'Mackbook',productId : await lastProductId()+1})).rejects.toThrow(NotFoundError);
    });

    test('update product fail, invalid input',async ()=>{
        await expect(productService.update({title : 'Mac',productId : await lastProductId()})).rejects.toThrow(ValidationError);
    });
});

describe('Test update category product', () => {
    test('update category success',async ()=>{
        await expect(productService.updateCategory({productId: await lastProductId(),categoryId: await lastIdCategory()-1})).resolves.toBeTruthy();
        const product = await productService.getByPk(await lastProductId());
        expect(product).toHaveProperty('categoryId',await lastIdCategory()-1);
    });

    test('update category fail, category not found',async ()=>{
        await expect(productService.updateCategory({productId: await lastProductId(),categoryId: await lastIdCategory()+1})).rejects.toThrow(NotFoundError);
        const product = await productService.getByPk(await lastProductId());
        expect(product).toHaveProperty('categoryId',await lastIdCategory());
    });

    test('update category fail, product not found',async ()=>{
        await expect(productService.updateCategory({productId: await lastProductId()+1,categoryId: await lastIdCategory()-1})).rejects.toThrow(NotFoundError);
    });
});

describe('Test delete product', () => {
    test('delete product success',async ()=>{
        await expect(productService.delete(await lastProductId())).resolves.toBeTruthy();
        const products = await AllProducts();
        expect(products).toHaveLength(1);
    });

    test('delete product fail, not found',async ()=>{
        await expect(productService.delete(await lastProductId()+1)).rejects.toThrow(NotFoundError);
    });
});