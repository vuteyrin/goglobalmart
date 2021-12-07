import { gql } from "@apollo/client";

// export const GET_ALL_PRODUCT = gql`
//   query getAllProducts($type: String, $keyword: String) {
//     allProducts(type: $type, keyword: $keyword) {
//       rating
//       id
//       productName
//       productImage
//       price
//       category
//     }
//   }
// `;


// export const GET_PRODUCT_BY_ID = gql`
//   query getProductById($id: ID!) {
//     getProductById(id: $id) {
//       id
//       category
//       productName
//       countInStock
//       rating
//       productImage
//       price
//       description
//       review {
//         id
//         name
//         rating
//         comment
//       }
//     }
//   }
// `;

export const GET_PRODUCTBYSELECT_CTG = gql`
query getProductBySelectCTG($input: InputPagination) {
  getProductBySelectCTG(input: $input) {
    data {
      id
      code
      description
      image
      price
      um
      category {
        id
        description
      }
      remark
    }
  }
}
`
export const GET_ALL_PRODUCT = gql`
  query getProducts($input: InputPagination) {
    getProducts(input: $input) {
      data {
        id
        code
        description
        image
        price
        um
        category {
          id
          description
          product
        }
        remark
        inStock
      }
      pagination {
        current
        count
      }
    }
  }
`;


export const GET_PRODUCT_BY_ID = gql`
  query ($input: InputId! ) {
    getProductById(input: $input) {
      id
      description
      price
      image
      remark
      inStock
      category {
        description
        id
      }
    }
  }
`;


