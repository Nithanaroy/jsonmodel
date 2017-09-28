const { validate } = require( "jsonschema" );
const axios = require( "axios" );
const errorMessageGenerator = require( "./error_generator" ).generateErrorMessages;

class JSONModel{
  constructor ( schema, { idProp = "id", url, parseInstanceProp } = {}) {
    this.__schema = schema; // TODO: Validate if its a valid JSON schema
    this.__idProp = idProp;
    this.__url = url;
    this.__parseInstanceProp = parseInstanceProp;
  }
  async find () {

  }
  /**
   * Save or update an existing model instance
   * 
   * @returns Promise which resolves successfully to an updated model from server
   * @memberof JSONModel
   */
  async save () {
    const validationResult = validate( this, this.__schema );
    const errors = errorMessageGenerator( validationResult, this.__schema );
    const isNewModel = typeof this[this.__idProp] === "undefined";
    if ( errors.length === 0 ){
      let response;
      if ( isNewModel ){
        response = await axios.post( this.__url, this.__requestPayload );
      } else {
        response = await axios.put( this.__url, this.__requestPayload );
      }
      this.__updateSelf( response.data[this.__parseInstanceProp] );
      return this;
    }
    throw new Error( errors );
  }
  __updateSelf ( newObj ) {
    for ( let key in newObj ){
      this[key] = newObj[key];
    }
  }
  async delete () {

  }
  get __requestPayload () {
    let payload = Object.assign({}, this );
    const privateKeys = Object.keys( payload ).filter( k => k.startsWith === "__" );
    for ( let key of privateKeys ){
      delete payload[key];
    }
    return payload;
  }
  toString () {
    return this.__requestPayload;
  }
}

module.exports.JSONModel = JSONModel;