import { gql } from "@apollo/client";

export const CREATE_NEW_CUSTOMER = gql`
mutation setCustomers($input: CustomerInputSet) {
  setCustomers(input: $input) {
    id
    lname
    fname
    tel
    uid
    token
    image
  }
}
`;
export const UPDATE_CUSTOMER_BY_ID = gql`
  mutation UpdateCustomersMutation($input: CustomerInputUpdate) {
    updateCustomers(input: $input)
  }
`;
// export const CREATE_NEW_CUSTOMER = gql`
//   mutation createCustomer($uid: String, $tel: String!, $token: String!) {
//     createCustomer(newCustomer: { uid: $uid, tel: $tel, token: $token }) {
//       id
//       name
//       uid
//       tel
//       token
//       email
//       customerImage
//     }
//   }
// `;

// export const IMAGE_UPLOADER = gql`
//   mutation imageUploade($file: Upload!) {
//     imageUploader(file: $file)
//   }
// `;

// export const UPDATE_CUSTOMER_BY_ID = gql`
//   mutation updateCustomer(
//     $id: ID!
//     $name: String
//     $tel: String
//     $email: String
//     $customerImage: String
//   ) {
//     updateCustomer(
//       id: $id
//       updatedCustomer: {
//         name: $name
//         tel: $tel
//         email: $email
//         customerImage: $customerImage
//       }
//     ) {
//       address
//       id
//       long
//       lat
//       email
//       customerImage
//       createdAt
//       name
//       tel
//       token
//       uid
//       updatedAt
//     }
//   }
// `;

// export const CREATE_TEST = gql`
//   mutation createTests {
//     createTests
//   }
// `;

