const { validate } = require( "jsonschema" );
const axios = require( "axios" );
const errorMessageGenerator = require( "./error_generator" );

class JSONModel{
  static create ( schema = {}, settings = {}) {
    function Schema ( fields = {}) {
      this.__updateSelf = function ( newObj ) {
        for ( let key in newObj ){
          this[key] = newObj[key];
        }
      };

      this.__requestPayload = function () {
        let payload = Object.assign({}, this );
        const excludeKeys = Object.keys( payload ).filter( k => k.startsWith( "__" ) || ( schema.properties[k] || {}).serialize === false );
        for ( let key of excludeKeys ){
          delete payload[key];
        }
        return payload;
      };

      this.save = async function save () {
        const validationResult = validate( this, schema );
        const errors = errorMessageGenerator( validationResult, schema );
        const isNewModel = typeof this[settings.idProp] === "undefined";
        if ( errors.length === 0 ){
          let response;
          if ( isNewModel ){
            response = await axios.post( settings.url, this.__requestPayload() );
          } else {
            response = await axios.put( settings.url, this.__requestPayload() );
          }
          this.__updateSelf( response.data[settings.parseInstanceProp] );
          return this;
        }
        throw new Error( errors );
      };

      this.delete = async function () {
        throw new Error( "Not implemented" );
      };

      this.toString = function () {
        return this.__requestPayload();
      };

      this.__updateSelf( fields );
    }

    Schema.find = async function find ( criteria = {}) {
      function deserialize ( jsonResponse ) {
        let Model = JSONModel.create( schema, settings );
        let modelInstance = new Model( jsonResponse );
        return modelInstance;
      }

      let isFindAllRequest = typeof criteria === "object";
      let response;
      if ( isFindAllRequest ){
        let res = [];
        response = await axios.get( settings.url, { "params": criteria });
        for ( let modelJson of response.data[settings.parseListProp] ){
          res.push( deserialize( modelJson ) );
        }
        return res;
      } else {
        // find one request
        response = await axios.get( `${settings.url}/${criteria}` );
        return deserialize( response.data[settings.parseInstanceProp] );
      }
    };

    return Schema;
  }
}

module.exports = JSONModel;