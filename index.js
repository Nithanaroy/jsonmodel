const { validate } = require( "jsonschema" );
const axios = require( "axios" );
const errorMessageGenerator = require( "./error_generator" ).generateErrorMessages;

class JSONModel{
  constructor ( schema = {}, settings = {}) {
    this.__schema = schema; // TODO: Validate if its a valid JSON schema
    this.__settings = settings;
  }
  static async find ( criteria = {}, schema = {}, settings = {}) {
    let isFindAllRequest = typeof criteria === "object";
    let response;
    if ( isFindAllRequest ){
      let res = [];
      response = await axios.get( settings.url, { "params": criteria });
      for ( let modelJson of response.data[settings.parseListProp] ){
        res.push( this.__deserialize( modelJson, schema, settings ) );
      }
      return res;
    } else {
      // find one request
      response = await axios.get( `${settings.url}/${criteria}` );
      return this.__deserialize( response.data[settings.parseInstanceProp], schema, settings );
    }
  }
  static __deserialize ( jsonResponse, schema, settings ) {
    let j = new JSONModel( schema, settings );
    j.__updateSelf( jsonResponse );
    return j;
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
    const isNewModel = typeof this[this.__settings.idProp] === "undefined";
    if ( errors.length === 0 ){
      let response;
      if ( isNewModel ){
        response = await axios.post( this.__settings.url, this.__requestPayload );
      } else {
        response = await axios.put( this.__settings.url, this.__requestPayload );
      }
      this.__updateSelf( response.data[this.__settings.parseInstanceProp] );
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