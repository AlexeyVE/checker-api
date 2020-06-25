const psList = require('ps-list');
 
(async () => {
    console.log(await psList());
})();