import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native';
import { EvilIcons,Feather } from '@expo/vector-icons';
import AllitemCart from '../../../components/header/AllitemCart';
import {useQuery,useLazyQuery} from '@apollo/client';
import {GET_ALL_PRODUCT,GET_PRODUCTBYSELECT_CTG} from '../../../graphql/product';
import { overlapItem } from '../../../function/Function';
import Root from '../../../components/root/root';
import { colorapp } from '../../../context/Reducer';
const AllItem = ({navigation, route}) => {
  const [keyword, setKeyword] = React.useState('');
  const categoryId = route.params === undefined ?"" : route.params.category;
  const [marginBottom, setMarginBottom] = React.useState(60);
  const [currentPage,setCurrentPage] = React.useState(1);
  const [limit,setLimit] = React.useState(1000);
  const [refreshing, setRefreshing] = React.useState(false);
  const [products, setProducts] = React.useState([])
  const [getProducts, { called, loading, data }] = useLazyQuery(GET_ALL_PRODUCT);
  const [getProductBySelectCTG, { called:calledPro, loading:loadingPro, data:dataByCategory }] = useLazyQuery(GET_PRODUCTBYSELECT_CTG);
  
  React.useEffect(()=>{
    getProductBySelectCTG({
      variables: {
        input: {
          id: categoryId,
        }
      }
    })
  },[dataByCategory])

  React.useEffect(()=>{
    getProducts({
      variables :{
        input: {
          current: currentPage,
          limit: limit,
          sort: {name:"",value:""},
          filter: {name:"",value:""},
        }
      }
    })
  },[currentPage]);

  React.useEffect(()=>{
    if(categoryId){
      setProducts(dataByCategory?.getProductBySelectCTG?.data);
    }else{
      setProducts([]);
    }
},[dataByCategory])

React.useEffect(()=>{
      if(!categoryId){
        setProducts(data?.getProducts.data);
      }
  },[data])
  const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        // setCurrentPage(e=> e+=1)
      }, 1000);

  }, []);
  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      underlayColor="#FFFF"
      onPress={() =>
      navigation.navigate('Product Detail', {
          id: item?.id,
        })
      }
      style={styles.btnCart}>
      <AllitemCart image={item?.image} />
      <View style={{alignItems: 'center'}}>
        <Text style={{color: colorapp}}>{(item.price*1).toFixed(2)}$/{item.um}</Text>
        <Text>{overlapItem(item?.description)}</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <TouchableWithoutFeedback onPress={() => setMarginBottom(65)}>
    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={() => navigation.navigate("Search")}>
        <View style={styles.search}>
          <EvilIcons name="search" size={20} color="black" />
          <Text style={styles.inputSearch}>search</Text>
          <Feather name="sliders" size={20} color="#CCCC" />
        </View>
      </TouchableWithoutFeedback>
      <View
        style={{
          ...styles.FlatList,
          flex: 1,
          alignItems: data?.getProducts.data.length < 3 ? 'flex-start' : 'center',
          paddingBottom: Platform.OS==="ios"?80: marginBottom,
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={products}
          renderItem={renderItem}
          onScroll={()=>setMarginBottom(65)}
          numColumns={3}
          onScrollEndDrag={() => {
            onRefresh();
          }}
          ListFooterComponent={
            refreshing ? (
              <View style={styles.pageLoading}>
                <ActivityIndicator size="large" color={colorapp} />
              </View>
            ) : null
          }
          keyExtractor={(item, index) => String(index)}
        />
      </View>
    </View>
    </TouchableWithoutFeedback>

  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    flex: 1,
    // paddingBottom: 65,
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
  btnCart: {
    marginHorizontal: '1%',
    backgroundColor: '#FFFF',
    borderRadius: 12,
    elevation: 5,
    paddingBottom: 10,
    marginVertical: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
    height: 170,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  FlatList: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    alignItems: 'center',
    paddingBottom: Platform.OS === "ios"?80 : 60,
  },
});
export default AllItem;
