import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { StateProvider, useStateValue } from "./context/StateProvider";
import reducer, { initialState } from "./context/Reducer";
import { WebSocketLink } from "apollo-link-ws";
import {LogBox,Platform,StatusBar } from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from '@apollo/client';
import {createUploadLink} from 'apollo-upload-client';
import { getMainDefinition } from "@apollo/client/utilities";
const App = () => {
  
  const httpLink = new HttpLink({
    uri:"http://96.9.90.104:5500/graphql"
  });
  const uploadLink = createUploadLink({
    uri: "http://96.9.90.104:5500/graphql",
  });

  const wsLink = new WebSocketLink({
    uri: "ws://96.9.90.104:5500/graphql",
    options: {
      reconnect: true,
    },
  });
  const splitLink = split(
    ({query}) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    uploadLink,
  );
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getAllPosts: {
            merge: true,
            }
        },
      },
    },
  });
 
  LogBox.ignoreLogs(['Reanimated 2']);
  const client = new ApolloClient({
    link: splitLink, httpLink,
    cache: cache,
  
  });
  return (
    <NavigationContainer>
      <ApolloProvider client={client}>
      <StateProvider initialState={initialState} reducer={reducer}>
       {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />} 
        <DrawerNavigator />
      </StateProvider>
      </ApolloProvider>
    </NavigationContainer>

  );
};
export default App;
