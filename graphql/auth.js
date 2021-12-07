import { gql } from "@apollo/client";

export const typeDefs = gql`
  extend type Query {
    isLogin: Boolean!
  }
`;

export const IS_LOGIN = gql`
  query isLogin {
    isLogin @client
  }
`;
