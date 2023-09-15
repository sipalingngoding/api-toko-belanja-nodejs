const {describe, beforeEach, afterAll, test, expect} = require("@jest/globals");
const {removeCategoryTest, insertCategoryTest, lastIdCategory, AllCategory} = require("../util-test");
const {ValidationError} = require("sequelize");
const NotFoundError = require("../../src/error/not-found-error");

const categoryService = new (require('../../src/service/categories-service'));

beforeEach(async ()=>{
    await removeCategoryTest();
    await insertCategoryTest();
});

const categoryNew = {type : 'Musik'};

describe('Test get All Categories', () => {
    test('get all success',async ()=>{
        const categories = await categoryService.getAll();
        expect(categories).toHaveLength(2);
        expect(categories).toEqual(await AllCategory());
    });
});

describe('Test Get By Id', () => {
    test('get category success',async ()=>{
        const category = await categoryService.getById(await lastIdCategory());
        expect(category).not.toBeNull();
        expect(category.type).toBe('Elektronik');
    });

    test('get category not found',async ()=>{
        await expect(categoryService.getById(await lastIdCategory()+1)).resolves.toBeNull();
    })
});

describe('Test add category', () => {
    test('add category success',async ()=>{
        const id = await categoryService.addCategory(categoryNew);
        expect(id).toBe(await lastIdCategory());
        const categories = await AllCategory();
        expect(categories).toHaveLength(3);
    });

    test('add category fail, invalid input',async ()=>{
        await expect(categoryService.addCategory({type : 'Ssa'})).rejects.toThrow(ValidationError);
    });
});

describe('Test  update category', () => {
    test('update category success',async ()=>{
        await expect(categoryService.update({categoryId : await lastIdCategory(),type : 'Kendaraan'})).resolves.toBeTruthy();
        const category = await categoryService.getById(await lastIdCategory());
        expect(category.type).not.toBe('Elektronik');
        expect(category.type).toBe('Kendaraan');
    });
    test('update category fail, not found',async ()=>{
        await expect(categoryService.update({categoryId : await lastIdCategory()+1,type : 'Kendaraaan'})).rejects.toThrow(NotFoundError);
    });

    test('update category fail, invalid input',async ()=>{
        await expect(categoryService.update({categoryId : await lastIdCategory(),type : 'Kend'})).rejects.toThrow(ValidationError);
    });
});

describe('Test delete category', () => {
    test('delete category success',async ()=>{
        const lastId = await lastIdCategory();
        await expect(categoryService.delete(lastId)).resolves.toBeTruthy();
        expect(await categoryService.getById(lastId)).toBeNull();
    });

    test('delete category fail, not found',async ()=>{
        const lastId = await lastIdCategory();
        await expect(categoryService.delete(lastId+1)).rejects.toThrow(NotFoundError);
        expect(await categoryService.getAll()).toHaveLength(2);
    });
});