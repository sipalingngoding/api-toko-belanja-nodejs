const {describe, test, expect} = require('@jest/globals');
const createRp =  require('../src/utils/Rp');


describe('Test Rp Function', () => {
    test('Must Be Same',()=>{
        expect(createRp(100000)).toBe('Rp 100.000');
    });
});