import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://tender-caiman-91.hasura.app/v1/graphql',
  headers: {
    'x-hasura-admin-secret': '9wV7aslZ3fyByyCNBXkLKQpkJJGVEO5ZT7G12BlmLjMELxp50ttWbRnIus3ll92X'
  },
  cache: new InMemoryCache()
})

console.log(client)

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
, document.querySelector('#root'))