import React from 'react';
import {
    //   Image,
    //   Platform,
    ScrollView,
    StyleSheet,
    Text,
    //   TouchableOpacity,
    View,
    Button,
    ActivityIndicator,
    RefreshControl,
    TabBarIOS
} from 'react-native';
import { Icon } from 'expo';
import { ButtonGroup } from 'react-native-elements';
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";



// components
import Title from '../components/Title';
import Lessons from './Lessons/LessonsTab';
import Students from './Students/StudentsTab'
import Seats from './Students/SeatsTab'


export default class ClassItemDetails extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerBackTitle: navigation.getParam('title', 'NO-NAME'),
            headerStyle: {
                borderBottomWidth: 0,
                shadowColor: 'transparent'
              },
            headerRight: (
            <Button
                title="设置"
                type='clear'
                titleStyle={{ fontSize: 16 }}
                onPress={()=>{
                    // navigation.navigate("AddNewClass")
                }}
            />),
        };
    };
    constructor(){

        super()
        this.state = {
            selectedIndex: 0,
            lessons:[],
            students:[],
            seatsMap:[],
            loading: false,

        }
        this.updateIndex = this.updateIndex.bind(this)
    }

    componentDidMount() {
        console.log('componentDidMount in class details!!!!!!')
        console.log(this.props.navigation.state.params._id)
        this.setState({ 
            loading: true, 
        })
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
            this.loadData();
        });
    }

    // methods to load students and lessons
    loadData = () => {
        let classId = this.props.navigation.state.params._id
        console.log("loading data")
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("smartedu");
        const students = db.collection("students");
        const lessons = db.collection("lessons");
        const classes = db.collection("classes")
        
        // find lesson list
        console.log("loading lessons")
        lessons
            .find({ class: classId })
            .asArray()
            .then(docs => {
                this.setState({ lessons: docs });
                console.log("find lessons with class Id " + classId)
                // console.log(docs)
                
                // find student list
                console.log("loading students")
                students
                    .find({ class: classId })
                    .asArray()
                    .then(docs => {
                        this.setState({ students: docs});
                        console.log("find students with class Id " + classId)
                        // console.log(docs)
                        
                        // find seatMap
                        console.log("loading seatsMap")
                        classes.findOne({_id: classId})
                        .then((data)=>{
                            console.log('get class seatsMap with class Id' + classId)
                            this.setState({
                                seatsMap: data['seatsMap']||[],
                                loading: false 
                            })
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                    })
                    .catch(err => {
                        console.warn(err);
                    });
            })
            .catch(err => {
                console.warn(err);
            });
        
    }
   

    updateIndex (selectedIndex) {
        this.setState({
            selectedIndex: selectedIndex
        })
    }

    render() {
        // Tabs
        const buttons = ['课程', '学生', '座位']
        const { selectedIndex } = this.state
        /* 2. Get the param, provide a fallback value if not available */
        const { navigation } = this.props;
        const classId = navigation.getParam('_id', 'NO-ID');
        const className = navigation.getParam('title', '未命名班级');
        // const lessons = navigation.getParam('lessons', []) 
        console.log("here is from class details, class id coming from param is:")
        console.log(classId)
        console.log("here is from class details, class id coming from props is:")
        console.log(this.props.classId)


        return (this.state.loading ? (
            <View style={[styles.loadingContainer, styles.horizontal]}>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
                ) : (
            <ScrollView 
                style={styles.container}
                refreshControl={
                <RefreshControl
                    refreshing={this.state.loading}
                    onRefresh={this.loadData}
                />}
            >
                <Title text={className} style={{marginHorizontal: 16}}/>
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    // containerStyle={{height: 100}}
                />
                {/* show content according to selectedIndex */}
                {(selectedIndex===0)?
                (<Lessons classId = {classId} lessons={this.state.lessons} navigation={navigation}/>)
                :(selectedIndex===1)?
                (<Students classId = {classId} className = {className} students={this.state.students} navigation={navigation}/>)
                :(<Seats classId = {classId} className = {className} students={this.state.students} navigation={navigation} seatsMap={this.state.seatsMap}/> )}      
            </ScrollView>)
        )
    }
}



const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center'
    },
        horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    //Original
    container: {
        flex: 1
    },
    contentContainer: {
        paddingTop: 16,
    }
})
