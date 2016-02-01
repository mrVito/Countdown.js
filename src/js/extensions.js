Array.prototype.removeWhere = function (property, value) {
    "use strict";

    for(var i = 0; i < this.length; i++) {
        if(this[i][property] === value) {
            this.splice(i, 1);

            break;
        }
    }
};
