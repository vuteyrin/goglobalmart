import { gql } from "@apollo/client";

export const CREATE_NEW_ORDER = gql`
mutation setSaleOrders($input: SaleOrderInputSet) {
  setSaleOrders(input: $input) {
    id
    customer {
      id {
        id
      }
    }
    grandTotal
    products {
      product {
        image
        description
        id
      }
      price
      qty
      total
      remark
    }
    status {
      isPrepared
      isCooked
      isDelivered
      deliveryTime
      isPaid
    }
  }
}
`;



export const GET_ORDER_BYID = gql`
query getSaleOrderById($input: InputId) {
  getSaleOrderById(input: $input) {
    id
    date
    grandTotal
    products {
      product {
        id
        description
        image
        remark
        createAt
      }
      price
      qty
      total
    }
    status {
      isPrepared
      isCooked
      isDelivered
      deliveryTime
      isPaid
    }
  }
}
`;

export const GET_MY_ORDER = gql`
query getSaleOrdersByCustomerId($input: InputPagination) {
  getSaleOrdersByCustomerId(input: $input) {
    data {
      id
      customer {
        id {
          id
        }
      }
      createAt
      subTotal
      date
      status {
        isPaid
      }
    }
  }
}
`;

export const SUB_ORDER_ONTHEWAY = gql`
  subscription updateStatus($input: InputId) {
    updateStatus(input: $input) {
      id
      isPrepared
      isCooked
      isDelivered
      deliveryTime
      isPaid
    }
  }
`;

export const GET_ORDER_PANDING = gql`
query getSaleOrdersBadgeByCustomerId($input: InputPagination) {
  getSaleOrdersBadgeByCustomerId(input: $input)
}
`

export const SUB_NEW_ORDER = gql`
subscription newSaleOrder {
  newSaleOrder {
    customer {
      id {
        id
      }
    }
  }
}
`

