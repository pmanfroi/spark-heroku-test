# RESTful API

This project utilizes the React Query library to handle data fetching and caching in a seamless and efficient manner. React Query simplifies the process of managing API requests, caching, and state synchronization, providing a better user experience and reducing the need for complex state management solutions.

For more information and documentation on React Query, visit [the official docs](https://react-query.tanstack.com/).

## Custom Hooks

We have custom hooks under `/src/rest` directory to handle React Query and custom behaviors. Some hooks props are defined as the follow:

### Queries

Returns standard useQuery object (https://react-query.tanstack.com/reference/useQuery)
Options may contain any valid react-query useQuery() options

In addition, queries can be customized via the following options

options {
defaultResponse: any: Will be returned as results when query returns `undefined`
transformFn: func: run the results through this fxn before returning
resultsPropName: string: custom name for the results property (overrides defaults)
queryParams obj: { paramName1: paramVal1, paramName2: paramVal2, etc },
results in /some-path?paramName1=paramVal1&paramName2=paramVal2
paramVal may be a string, number or boolean
or string: Will be directly appended to the rest path
Assumed is in valid query string format
}

NOTE: you can also supply query params within the restPath itself

For more information, reference ./core/restHooks.js documentation.
