import { gql } from "@apollo/client";

export const GET_ALL_OFFERS = gql`
  query allOffers {
    allOffers {
      id
      title
      start_date
      end_date
      discount
      createdAt
      description
    }
  }
`;
