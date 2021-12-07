export const API_URL = 'http://96.9.90.104/graphql/';
export const colorapp = "#5CD242";
export const initialState = {
  carts: [],
  customer: {},
  notificat: [],
  language: true,
  location: {},
  token: {},
  itemOrder: {},
  badgeNoti: 0,
 
};

export const actionTypes = {
  LOGOUT_USER: 'LOGOUT_USER',
  ADD_TO_CART: 'ADD_TO_CART',
  CUSTOMER: 'CUSTOMER',
  NOTIFICATION: 'NOTIFICATION',
  LANGUAGE: 'LANGUAGE',
  LOCATION: 'LOCATION',
  TOKEN: 'TOKEN',
  ITEMORDER : "ITEMORDER",
  BADGENOTI : "BADGENOTI"
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      return {
        ...state,
        carts: action.carts,
      };

    case actionTypes.CUSTOMER:
      return {
        ...state,
        customer: action.customer,
      };
    case actionTypes.NOTIFICATION:
      return {
        ...state,
        notificat: action.notificat,
      };
    case actionTypes.LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    case actionTypes.LOCATION:
        return {
          ...state,
          location: action.location,
        };
    case actionTypes.TOKEN:
          return {
            ...state,
            token: action.token,
          };
    case actionTypes.ITEMORDER:
          return {
          ...state,
          itemOrder: action.itemOrder,
        };
    case actionTypes.BADGENOTI:
          return {
          ...state,
          badgeNoti: action.badgeNoti,
        };
    default:
      return state;
  }
};

export default reducer;
