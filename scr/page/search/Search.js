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
  ActivityIndicator
} from 'react-native';
import { EvilIcons,Feather } from '@expo/vector-icons';
import AllitemCart from '../../../components/header/AllitemCart';
import {useQuery,useLazyQuery} from '@apollo/client';
import {GET_ALL_PRODUCT,GET_PRODUCTBYSELECT_CTG} from '../../../graphql/product';
import { overlapItem } from '../../../function/Function';
import Root from '../../../components/root/root';

const Search = ({navigation, route}) => {
  const [keyword, setKeyword] = React.useState('');
  const categoryId = route.params === undefined ?"" : route.params.category;
  const [marginBottom, setMarginBottom] = React.useState(65);
  const [currentPage,setCurrentPage] = React.useState(1);
  const [limit,setLimit] = React.useState(12);
  const [refreshing, setRefreshing] = React.useState(false);
  const [products, setProducts] = React.useState([])
  const [getProducts, { called, loading, data }] = useLazyQuery(GET_ALL_PRODUCT);
  // const [getProductBySelectCTG, { called:calledPro, loading:loadingPro, data:dataByCategory }] = useLazyQuery(GET_PRODUCTBYSELECT_CTG);
  // React.useEffect(()=>{
  //   getProductBySelectCTG({
  //     variables: {
  //       input: {
  //         id: categoryId
  //       }
  //     }
  //   })
  // },[])
  React.useEffect(()=>{
    getProducts({
      variables :{
        input: {
          // current: currentPage,
          // limit: limit,
          keyword: keyword,
          sort: {name:"",value:""},
          filter: {name:"",value:""},
        }
      }
    })
  },[currentPage,keyword])

  
  React.useEffect(()=>{
      if(data){
        setProducts([]);
        setProducts((e)=>([...e,...data?.getProducts?.data]))
      }
  },[data])

  React.useEffect(()=>{
    if(keyword){
      setProducts(data?.getProducts?.data)
    }
  },[keyword]);


  // console.log(data,)
  // React.useEffect(()=>{
  //   if(categoryId){
  //     setProducts(dataByCategory?.getProductBySelectCTG?.data);
  //   }
  // },[categoryId])
  const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        setCurrentPage(e=> e+=1)
      }, 3000);

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
        <Text style={{color: '#006633'}}>{(item.price*1).toFixed(2)}$/{item.um}</Text>
        <Text>{overlapItem(item?.description)}</Text>
      </View>
    </TouchableOpacity>
  );

// console.log(keyword)
  return (
    <TouchableWithoutFeedback onPress={() => setMarginBottom(65)}>
    <View style={styles.container}>
      <View style={styles.search}>
        <EvilIcons name="search" size={20} color="black" />
        <TextInput
          style={styles.inputSearch}
          autoFocus={true}
          value={keyword}
          onChangeText={e => setKeyword(e)}
          onFocus={() => setMarginBottom(0)}
          placeholder="search..."
        />
        <Feather name="sliders" size={20} color="#CCCC" />
      </View>
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
                <ActivityIndicator size="large" color="#006633" />
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
    height: 36,
    borderColor: '#EEEE',
    backgroundColor: '#EEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
    marginBottom: 4,
  },
  inputSearch: {
    width: '85%',
    // backgroundColor: 'red',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    color: 'gray',
    paddingVertical: 5,
  },
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
export default Search;
