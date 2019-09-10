import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { ListItem } from 'react-native-elements'
import { createStackNavigator, createAppContainer } from 'react-navigation';



class InfoList extends React.Component {
       
    render() {
        // console.log("=========this is from info list===============")
        
        return (
            <View>
                {
                    this.props.items.map((item, i) => (
                        <ListItem
                            dataId={item._id}
                            titleStyle={styles.item}
                            key={i}
                            title={item[this.props.titleName]}
                            leftIcon={{ name: this.props.listIcon }}
                            chevron={true}
                            bottomDivider={true}
                            onPress={() => {
                                /* 1. Navigate to the Details route with params */
                                this.props.navigation.navigate(this.props.pageModel
                                , 
                                {
                                    ...item
                                });
                              }}
                        />
                    ))
                }
            </View>
        );
    }
    
}


const styles = StyleSheet.create({
    item: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 10,
        paddingBottom: 8,
        fontSize: 18,
        height: 40,
    },
})

export default InfoList
