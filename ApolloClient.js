import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, Observable } from 'apollo-link';
import { split } from 'apollo-link';
import { AsyncStorage } from 'react-native';

const BASE_URL = 'http://localhost:4000/graphql';

//Apollo client will determine whether to send auth token

const httpLink = new HttpLink({
    uri: BASE_URL,
    credentials: 'include'
})
//crendtials - allow us to send tokens with each request

const request = async (operation) => {
    //If we have token saved locally, we unpack it with ASYNC STORAGE 
    // like getItem in local storage
    const token = await AsyncStorage.getItem('token');
    //for each operation, we set a context
    //we will pass autgorization header if we have a token
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : ''
        }
    })
}

//add observer to each request
//fwd operation with existing context
// applies middlewar, credntials
//the point - is to pass on our authentication token to each request
const requestLink = new ApolloLink((operation, forward) =>
//every time we return an Apollo Link we're going to be returning a new observable link.
    new Observable(observer => {
        let handle;
        //each request sent we're going to resolve it using a promise
        Promise.resolve(operation)
        //upon completion pass operation to next request
            .then(oper => request(oper))
            .then(() => {

                handle = forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                });
            })
            .catch(observer.error.bind(observer));

        return () => {
            if (handle) handle.unsubscribe();
        };
    })
);


//ApolloLink allows multiple  (initialize an array of links)
const client = new ApolloClient({
    link: ApolloLink.from([requestLink, httpLink]),
    cache: new InMemoryCache(),
});
export default client;