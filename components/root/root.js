import React, {useContext } from 'react'
import { View, Text, SafeAreaView, StatusBar, ScrollView, Dimensions } from 'react-native'
const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;
export default function Root({children}) {
    return (
        <View>
            <StatusBar barStyle="dark" />
            <SafeAreaView style={{height: Height,backgroundColor: "#FFFF",paddingBottom:60}}>
                <ScrollView >
                    <View style={{paddingBottom: 65}}>
                        {children}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}
