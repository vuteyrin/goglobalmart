import React from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  Image,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { EvilIcons, Feather } from "@expo/vector-icons";
import HomeCard from "../../../components/header/HomeCard";
import { useQuery,useLazyQuery,useSubscription} from "@apollo/client";
import { GET_ALL_PRODUCT,GET_ALL_CATEGORY} from "../../../graphql/product";
import {SUB_NEW_ORDER } from "../../../graphql/order";
import { useStateValue } from "../../../context/StateProvider";
import { overlapItem } from "../../../function/Function";
import Root from "../../../components/root/root"
import {colorapp} from "../../../context/Reducer"
const Home = ({ navigation, route }) => {
  const [{ language }, dispatch] = useStateValue();
  const [currentPage,setCurrentPage] = React.useState(1);
  const [limit,setLimit] = React.useState(12);
  const [refreshing, setRefreshing] = React.useState(false);
  const [products, setProduct] = React.useState([])
  const [getProducts, { called, loading, data,refetch}] = useLazyQuery(GET_ALL_PRODUCT,{
    onError: (e)=>{
      console.log(e)
    }
  });
  const getProductsData = async () =>{
    await  getProducts({
            variables :{
              input: {
                current: 1,
                limit: 100,
                sort: {name:"",value:""},
                filter: {name:"",value:""},
            
              }
          }
      })
  }

  const handlesetProduct = () =>{
    if(data?.getProducts.pagination.count >= products.length){
      setProduct(e=>([...e,...data?.getProducts.data]))
    }
  }
  const {data:newOrder} = useSubscription(SUB_NEW_ORDER,{
    onError: (e)=>{
      console.log(e)
    }
  });
  React.useEffect(()=>{
    getProductsData();
  },[currentPage]);

  React.useEffect(()=>{
    handlesetProduct();
  },[data])
  React.useEffect(()=>{
    refetch;
  },[newOrder])


  const onRefresh = React.useCallback(() => {
    if(data?.getProducts.pagination.count >= products.length){
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
          setCurrentPage(e=> e+=1)
        }, 3000);
    }
  }, []);
  // console.log(data)
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      underlayColor="#FFFF"
      onPress={() => navigation.navigate("Product Detail", { id: item?.id })}
      style={styles.cart}
    >
      <HomeCard image={item.image} />
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: colorapp }}>{item.price.toFixed(2)}$/{item.um}</Text>
        <Text>{overlapItem(item?.description)}</Text>
      </View>
    </TouchableOpacity>
  );
// console.log(currentPage)
if(!data || loading){
  return(
    <View style={styles.loading}>
      <Text>Loading....</Text>
      <ActivityIndicator size="large" color={colorapp} />
    </View>
  )
}
  return (

    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Search")}>
        <View style={styles.search}>
          <EvilIcons name="search" size={20} color="black" />
          <Text style={styles.inputSearch}>search</Text>
          <Feather name="sliders" size={20} color="#CCCC" />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.popular}>
        <Text style={{ fontSize: 18, color: "gray" }}>
          {language ? "Most Popular" : " ពេញ និយម បំផុត"}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("All Item")}>
          <Text style={{ color: colorapp, fontSize: 16 }}>
            {language ? "View All" : "ទាំងអស់"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.FlatList}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={products}
          onScrollEndDrag={() => {
            onRefresh();
          }}
          renderItem={renderItem}
          // ListFooterComponent={
          //   refreshing ? (
          //     <View style={styles.pageLoading}>
          //       <ActivityIndicator size="large" color="#006633" />
          //     </View>
          //   ) : null
          // }
          keyExtractor={(item, index) => String(index)}
        />
      </View>
      <View style={styles.category}>
        <TouchableOpacity
          style={styles.drink}
          activeOpacity={0.9}
          underlayColor="#FFFF"
          onPress={() =>
            navigation.navigate("All Item", {
              category: "617d058f141b6f98823e1691",
            })
          }
        >
          <Image
            source={require("../../../assets/menu/drink.jpg")}
            resizeMode="cover"
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
          />
          <Text style={styles.textDrinks}>
            {language ? "Drinks" : "ភេសជ្ជៈ"}
          </Text>
        </TouchableOpacity>
        <View style={styles.FoodFresh}>
          <TouchableOpacity
            style={styles.Food}
            activeOpacity={0.9}
            underlayColor="#FFFF"
            onPress={() =>
              navigation.navigate("All Item", {
                category: "617a128c2a6cb2cf6217cb9b",
              })
            }
          >
            <Image
              source={require("../../../assets/menu/food.jpg")}
              style={{ width: "100%", height: "100%", borderRadius: 12 }}
            />
            <Text style={styles.textFoods}>{language ? "Foods" : "អាហារ"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Fresh}
            activeOpacity={0.9}
            underlayColor="#FFFF"
            onPress={() =>
              navigation.navigate("All Item", {
                category: "617a13822a6cb2cf6217cba3",
              })
            }
          >
            <Image
              source={require("../../../assets/menu/fresh.jpg")}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 12,
              }}
            />
            <Text style={styles.textFresh}>
              {language ? "Fresh Products" : "ផលិតផលស្រស់ៗ"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <GetProductByCategory /> */}
      </View>
    </View>
  );
};
const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  loading : {
    flex : 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    position: "relative",
    // paddingBottom: 65
  },
  search: {
    borderWidth: 1,
    borderRadius: 30,
    marginHorizontal: 10,
    height: 33,
    borderColor: "#EEEE",
    backgroundColor: "#EEEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  inputSearch: {
    width: "85%",
    // backgroundColor: 'red',
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 12,
    color: "gray",
  },
  popular: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: 18,
    marginBottom: 10,
  },
  // child
  FlatList: {
    flex: 2,
    // marginHorizontal: 8,
    // backgroundColor: 'red',
    // marginVertical: 12,
    // paddingVertical: 10,
  },
  category: {
    flex: 3,
    flexDirection: "row",
    marginBottom: Platform.OS === "ios"? 80: 60,
    paddingTop: 5,
  },
  //child
  drink: {
    flex: 2,
    marginLeft: 10,
 
    borderRadius: 12,
    marginBottom: 10,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textDrinks: {
    color: "#FFFF",
    fontWeight: "bold",
    position: "absolute",
    fontSize: 16,
    paddingLeft: 13,
    top: 2,
  },
  textFoods: {
    color: "#4FC591",
    fontWeight: "bold",
    position: "absolute",
    fontSize: 16,
    paddingLeft: 13,
    top: 2,
  },
  FoodFresh: {
    flex: 3,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  Food: {
    flex: 3,
    // backgroundColor: 'blue',
    marginLeft: 20,
    // marginTop: 20,
    elevation: 5,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  Fresh: {
    flex: 3,
    marginLeft: 20,
    elevation: 5,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textFresh: {
    color: "#FFFF",
    position: "absolute",
    fontWeight: "bold",
    fontSize: 16,
    bottom: 4,
    left: 12,
  },
  cart: {
    marginHorizontal: 10,
    backgroundColor: "#FFFF",
    borderRadius: 20,
    elevation: 5,
    paddingBottom: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pageLoading: {
    flex: 1,
    // backgroundColor: "red",
    opacity: 0.5,
    alignItems: "center",
    justifyContent: "center",
    
  }
});
export default Home;
