const createRp = (value)=>{
    const str = String(value).split('');
    const strReverse = str.reverse();
    let result = '';
    for (let i= 0 ; i<strReverse.length ;i++)
    {
        result += strReverse[i];
        if((i+1)%3 === 0 && (i+1) !== strReverse.length) result+='.';
    }
    return 'Rp '+result.split('').reverse().join('');
};


module.exports = createRp;