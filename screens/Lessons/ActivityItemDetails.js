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
            headerRight: (
                <Button
                  title="编辑"
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
        console.log("here is in activity details screen, following is the navigation props")
        // console.log(navigation)
        const activity = navigation.state.params;
        console.log(activity)
        const {title, duration, assessment, rubrics_name} = activity
        // const activities = navigation.getParam('activities', [])
        console.log("===============")
        // console.log(activities)
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={{marginTop: 16}}>
                <Title text={title}/>
                <Text style={styles.contentText}>活动时长: {Math.floor(duration/60)}小时{duration%60}分</Text>
                <Text style={styles.contentText}>评估方式: {assessment['type']==='score'?('基于总分'):(assessment['type']==='level'?('基于级别'):(assessment['type']==='rubrics'?('基于多维评估标准'):('不评分')))}</Text>
                {assessment['type']==='score'?(<Text style={styles.contentText}>总分: {assessment['total']}分</Text>)
                :(assessment['type']==='level'?(<Text style={styles.contentText}>级别: {assessment['total']}级</Text>)
                :(assessment['type']==='rubrics'?(<Text style={styles.contentText}>评估标准: {rubrics_name}({assessment['rubrics_id']})</Text>)
                :(<></>)))}     
            </View>
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
    },
    contentText:{
        fontSize: 18,
        marginVertical: 12
        // color: '#e6e6e6'
    }
})
