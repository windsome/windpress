"use strict";
module.exports = {
    getAsJson: function(fieldName)  {
        return function()  {
            var content = this.getDataValue(fieldName);
            try {
                return content && JSON.parse(content) || content;
            } catch (e) {
                console.log ("warning: field '"+fieldName+"', json parse:", e.message);
                return content;
            }
        }
    },
    setFromJson: function(fieldName) {
        return function(val) {
            var content = val;
            try {
                content = val && JSON.stringify (val) || val;
            } catch (e) {
                console.log ("warning: field '"+fieldName+"', json stringify:", e.message);
                content = val;
            }
            this.setDataValue(fieldName, content);
        }
    }
};
