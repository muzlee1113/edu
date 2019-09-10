import React from 'react';
import {
    //   Image,
    //   Platform,
    ScrollView,
    StyleSheet,
    Text,
    //   TouchableOpacity,
    View,
    Button
} from 'react-native';
import { ListItem } from 'react-native-elements'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";



// components
import Title from '../../components/Title';




export default class ActivityItemDetails extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerBackTitle: navigation.getParam('title', 'NO-NAME'),
            // headerStyle: {
            //     borderBottomWidth: 0,
            //     shadowColor: 'transparent'
            // },
            headerRight: (
                <Button
                  title="设置"
                  type='clear'
                  titleStyle={{ fontSize: 16 }}
                  onPress={()=>{
                    //   navigation.navigate("AddNewClass")
                    }}
                />),
        };
    };
    
    componentDidMount(){
        // asking lesson data

    }

    render() {
        /* 2. Get the param, provide a fallback value if not available */
        const { navigation } = this.props;
        const activityId = navigation.getParam('_id', 'NO-ID');
        const activityName = navigation.getParam('title', '未命名课程');
        // const activities = navigation.getParam('activities', [])
        console.log("===============")
        // console.log(activities)
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text>Hello from activity details for {activityName}({activityId})</Text>
            </ScrollView>
        );
    }
}



const styles = StyleSheet.create({

    item: {
        // paddingLeft: 16,
        // paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 18,
        height: 40,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginLeft: 16,
        marginRight: 16,    
    },
    contentContainer: {
        paddingTop: 16,
    }
})
