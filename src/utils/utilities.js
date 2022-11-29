const isValidOperation = (arr, arr2) =>{
    return  arr2.every(key=>arr.includes(key)); 
}

module.exports = {isValidOperation}; 