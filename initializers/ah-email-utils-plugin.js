var _ = require('underscore');
var validator = require('validator');

module.exports = {
  initialize : function(api, next){

    _.each(api.actions.actions, function(action){
      _.each(action, function(actionTemplate, version){
        var emailFields = _.pick(actionTemplate.inputs, 'email', 'emailAddress', 'emailaddress', 'email-address');
        _.each(emailFields, function(input, fieldName){
          if((!input.validator && !_.isBoolean(input.validator)) || (_.isBoolean(input.validator) && input.validator)){
            input.validator = function(param){
              if(validator.normalizeEmail(param)){
                return true
              }else{
                var hasConfig = _.isFunction(api.config.errors.invalidEmail)
                var error = 'invalid ' + fieldName;
                if(hasConfig) error = api.config.errors.invalidEmail(param); 
                return new Error( error )
              }
            }
          }

          if((!input.formatter && !_.isBoolean(input.formatter)) || (_.isBoolean(input.formatter) && input.formatter)){
            input.formatter = function(param){
              return validator.normalizeEmail(param)
            }
          }
        })
      })
    })
    
    next();
  }
};