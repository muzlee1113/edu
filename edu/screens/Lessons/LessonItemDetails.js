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




export default class LessonItemDetails extends React.Component {
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
        const lessonId = navigation.getParam('_id', 'NO-ID');
        const lessonName = navigation.getParam('title', '未命名课程');
        // const activities = navigation.getParam('activities', [])
        console.log("===============")
        // console.log(activities)
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Title text={lessonName} />
                <View>
                    <ListItem
                        lessonId={lessonId}
                        titleStyle={styles.item}
                        key='prep'
                        title="课前准备"
                        chevron={true}
                        bottomDivider={true}
                        subtitleStyle={{ color: '#707070', fontSize: 16 }}
                        subtitle="添加、编辑课堂活动"
                        onPress={() => {
                            /* 1. Navigate to the Details route with params */
                            console.log("lesson prep")
                            navigation.navigate("LessonPrepLesson", {lessonId: lessonId, lessonName: lessonName});
                        }}
                    
                    />
                    <ListItem
                        lessonId={lessonId}
                        titleStyle={styles.item}
                        key='start'
                        title="开始上课"
                        chevron={true}
                        bottomDivider={true}
                        subtitleStyle={{ color: '#707070', fontSize: 16 }}
                        subtitle="进入课堂记录模式"
                        onPress={() => {
                            /* 1. Navigate to the Details route with params */
                            console.log("lesson start")
                            navigation.navigate("StartLessonScreen", {lessonId: lessonId, lessonName: lessonName});
                        }}
                    />
                    <ListItem
                        lessonId={lessonId}
                        titleStyle={styles.item}
                        key='reply'
                        title="课后反馈"
                        subtitleStyle={{ color: '#707070', fontSize: 16 }}
                        subtitle="查看、编辑学生课堂表现情况"
                        chevron={true}
                        bottomDivider={true}
                        onPress={() => {
                            /* 1. Navigate to the Details route with params */
                            console.log("lesson reply")
                            navigation.navigate("ReplyLessonScreen", {lessonId: lessonId, lessonName: lessonName});
                        }}
                    />
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
    }
})
