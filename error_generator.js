function generateErrorMessages ( validationResult, schema ) {
  return validationResult.errors.map( error => schema.properties[error.argument].error_messages[error.name] );
}

module.exports = generateErrorMessages;