const path = require('path');

//path.dirname(require.main.filename makes it easier to select paths for other components. Its set the main directory ex: i use this in admin.js and sets teh path automaticaly to routes, as its his main directory. in shop.js set routes also since its the same main directory.)
module.exports = path.dirname(require.main.filename);