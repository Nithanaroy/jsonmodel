## JSONModel

JSONModel is a tiny yet powerful library which does three things:
- Provides utility functions for save, update, find and delete without developer needing to write verbose AJAX apis
- Gives a structure to a JSON string which makes it easier to understand and maintain
- Validates the passed JSON and returns well-formatted error messages
 
In summary, it uses W3C JSON schema to define object structure, provides well-formatted error messages, and a simple default RESTful CRUD interface.

We are using JSONModel in our Core Analytics Portal client and backend apps. This makes it very easy to share schemas across stacks as it is based of JSON without any code duplication for all the 3 tasks!