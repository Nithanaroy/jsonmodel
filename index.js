var validate = require( "jsonschema" ).validate;
var errorMessageGenerator = require( "./error_generator" ).generateErrorMessages;

class JSONModel{
  constructor ( schema, { idProp = "id", url } = {}) {
    this.__schema = schema; // TODO: Validate if its a valid JSON schema
    this.__idProp = idProp;
    this.__url = url;
  }
  save () {
    const validationResult = validate( this, this.__schema );
    const errors = errorMessageGenerator( validationResult, this.__schema );
    if ( errors.length === 0 ){
      return "Saved";
    }
    return errors;
  }
  delete () {

  }
}

module.exports.JSONModel = JSONModel;