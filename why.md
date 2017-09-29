# Why is JSON Model required?
- It is a combination of simplicity of JSON Schema and an object which can elegantly handle saving and retrieving data from an end point

## Advantages over CanJS Models/DefineMap
- Same standard JSON for schema and validation
- Model.List is an array and not DefineList as we dont need observsables everytime, which opens up all vanilla JavaScript array functions

## Additional Features to JSON Schema
- `error_messages` object which are verbose error messages to use
- `serialize` (boolean) property whether to save on server or not