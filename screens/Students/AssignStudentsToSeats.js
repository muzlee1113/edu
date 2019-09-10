import React from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    TouchableOpacity
    // Button
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements'

// import { Icon } from 'expo';
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";


// components
import SeatsMap from '../../components/SeatsMap'
import SeatsMapEmpty from '../../components/SeatsMapEmpty'




var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;



class AssignStudents extends React.Component {
// TBD: 随机安排，全部清空
   componentDidMount(){
       this.props.clearUpStudentSeat()
   }
    render() {
        let {studentsToBeAssigned, students} = this.props
        
        return <View style={{marginTop: 16}}>
                <Text
                    style={{
                        color: "#707070", fontSize: 18
                    }}
                >共{students.length}名学生，已安排({(students.length-studentsToBeAssigned.length)}/{students.length})</Text>
        {studentsToBeAssigned.length>0?(
            <>
            <Text
                style={{
                    color: "black", fontSize: 24, fontWeight: "bold", marginVertical: 8
                }}
            >点击方块,给以下学生安排座次</Text>
            <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginVertical: 8
                    }}
                >
                <TouchableOpacity
                style={{ 
                // borderRadius: '50%',
                // borderWidth: 1,
                // borderColor: '#707070',
                height: 30, 
                width: 30,
                alignItems: 'center', 
                justifyContent: 'center' 
                }}
                onPress={this.props.prevStudent}
                >
                    <Icon 
                        name= "chevron-left"
                        size= {30}
                        color= "#707070"
                    />
                </TouchableOpacity>
                 <Text
                    style={{
                        color: "black", 
                        fontSize: 24, 
                        marginHorizontal: 24, 
                    }}>{this.props.onScreenStudent.name}</Text>
                <View
                    style={{ 
                    // borderRadius: '50%',
                    // borderWidth: 1,
                    // borderColor: '#707070',
                    height: 30, 
                    width: 30,
                    alignItems: 'center', 
                    justifyContent: 'center',
                    }}
                    >  
                </View>
            </View></>)
            :(<Text
                style={{
                    color: "black", fontSize: 24, fontWeight: "bold", marginVertical: 8
                }}
            >点击完成保存设置</Text>)}
        </View>
    }
}



export default class CreatSeatsMap extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            // step: 0,
            seatsMap: [],
            // rowNum: '0',
            // seatNum: '0',
            // aisleMap: [],
            onScreenStudentIndex: 0,
            onScreenStudent:{},
            students:[],
            studentsToBeAssigned:[],
            studentsHaveBeenAssigned:[],
            buttonLoading: false,
        };

    }
    

    static navigationOptions = ({ navigation }) => {

        return {
            title: '分配座次',
            // headerLeft: navigation.state.params.headerLeft,
            headerRight: (
                <Button
                    title="关闭"
                    type='clear'
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => {
                        navigation.goBack()
                    }}
                />),
        };
    };

    // _setNavigationParams() {
    //     let headerLeft = <Button 
    //                         title="上一步"
    //                         type='clear'
    //                         // disabled={this.state.step?(false):(true)}
    //                         titleStyle={{ fontSize: 16 }}
    //                         onPress={this._prevStep} 
    //                         />;

    //     this.props.navigation.setParams({
    //         headerLeft,
    //     });
    // }

    // componentWillMount() {
    //     // console.log('willmount willmount willmount')
    //     // console.log(this.state)
    //     this._setNavigationParams();

    // }

    componentWillMount(){
        this.setState({
            students: [...this.props.navigation.state.params.students]
        },()=>{
            this.configSeatsMap(()=>{this.checkRemainingStudents(this.setOnScreenStudent)})
        })
        // this.setState({
        //     students: this.props.navigation.getParam('students', []), 
        //     step: this.props.navigation.getParam('startingStep', 0),
        //     seatsMap: this.props.navigation.getParam('seatsMap', []),
        // },()=>{
            
        // })
    }

    

    configSeatsMap = (callback)=>{
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
        RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("smartedu");
        const classes = db.collection("classes");
        const classId = this.props.navigation.state.params.classId
        classes.findOne({_id: classId})
        .then((data)=>{
            console.log('get class seatsMap')
            this.setState({
                seatsMap: data['seatsMap'],
            },()=>{
                callback()
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }


    checkRemainingStudents=(callback)=>{
        console.log("checking remaining students")
        console.log(this.state.students)
        let studentsToBeAssigned = this.state.students.filter((student) => student.hasOwnProperty('seat') === false);
        this.setState({
            studentsToBeAssigned: [...studentsToBeAssigned]
        },()=>{

            callback()
        
        })
    }

    setOnScreenStudent=()=>{
        this.setState({
            // onScreenStudentIndex: nextStudentIndex,
            onScreenStudent: this.state.studentsToBeAssigned[0]
        },()=>{
            console.log("students have been assigned is =>>>>>>>>>>>>>>>")
            console.log(this.state.studentsHaveBeenAssigned)
            console.log("students to be assigned is =>>>>>>>>>>>>>>>")
            console.log(this.state.studentsToBeAssigned)
        })
    }

    // assign students
    touchEventHandler=(rowIndex, seatIndex, studentId, callback)=>{
        let onScreenStudent = this.state.onScreenStudent
        let seat = {rowIndex:rowIndex, seatIndex:seatIndex}
        // let studentsToBeAssigned = {}
        let students = [...this.state.students]
        console.log("+=_=+------------===============----------------+-_-+")

        console.log("you click a seat!!")
        console.log(seat)
        console.log("with studentId")
        console.log(studentId)

        // update student data in state
        let updatedStudents = students.map((student,i)=>{
            // click seat already with student
            if(studentId === student._id){
                console.log("you click a seat already has student!!")
                delete student.seat;
            }
            // set on screen student to the seat
            if(onScreenStudent._id===student._id){
                student.seat = {...seat}
            }
            return student
        })

        this.setState({
            students: [...updatedStudents]
        },()=>{
            // move to the next student
            this.nextStudent()        
        })
    }

    clearUpStudentSeat=()=>{
        // get students from state
        const students = [...this.state.students]
        let updatedStudents = students.map((student,i)=>{
            // delete all the seat property
            if(student.hasOwnProperty('seat')){
                delete student.seat;
            }
            return student
        })

        this.setState({
            students: [...updatedStudents]
        },()=>{
            console.log("clear up seats!")
        })
    }

    nextStudent=()=>{
        // let nextStudentIndex = this.state.onScreenStudentIndex+1,
        // here move the assigned students to another array
        this.setState({
            studentsHaveBeenAssigned:[...this.state.studentsHaveBeenAssigned, this.state.onScreenStudent],
        },()=>{
            // updateRemaining students
            this.checkRemainingStudents(this.setOnScreenStudent)
        })
    }

   

    prevStudent=()=>{
        
        // rewind the set seat of previous student
        let preStudent = this.state.studentsHaveBeenAssigned[this.state.studentsHaveBeenAssigned.length-1]
        // delete seat data of prev student in students data
        let updatedStudents = this.state.students.map((student,i)=>{
            if(student._id===preStudent._id){
                delete student.seat;
            }
            return student
        })
        // remove the students from havebeenassigned array
        let updatedHaveBeenAssigned = [...this.state.studentsHaveBeenAssigned]
        updatedHaveBeenAssigned.pop()

        this.setState({
            students: [...updatedStudents],
            studentsHaveBeenAssigned: [...updatedHaveBeenAssigned]
        },
        ()=>{
            console.log("students data now look like")
            console.log(this.state.students)
            // the following function should auto move the prev student back to tobeassigned array
            this.checkRemainingStudents(this.setOnScreenStudent)
        }
        )
    }

    submitStudents=(callback)=>{
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
        RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("smartedu");
        const students = db.collection("students");
        const classId = this.props.navigation.state.params.classId
        const className = this.props.navigation.state.params.className
        const newStudentsData = [...this.state.students]
        newStudentsData.forEach(student=>{
            students.findOneAndUpdate({_id: student._id}, {$set:{seat: student.seat}})
            .then((data)=>{
               console.log("updated a student's seat")
               console.log(data)
               this.props.navigation.navigate('ClassItemDetails',{ startingStep:3, _id: classId, title: className })
            })
            .catch(err=>{
                console.log(err)
            })

        })
        callback()
        
    }

   

    render() {
        let {classId, className} = this.props.navigation.state.params        
        console.log("here is from create seat map")
        // get class Id from navigation
        console.log(classId)
        console.log('now is step ' + this.state.step)
        return (
            <ScrollView 
            style={styles.container}
            >
                <AssignStudents 
                    students={this.state.students}
                    studentsToBeAssigned={this.state.studentsToBeAssigned} 
                    onScreenStudent={this.state.onScreenStudent}
                    nextStudent={this.nextStudent}
                    prevStudent={this.prevStudent}
                    clearUpStudentSeat={this.clearUpStudentSeat}
                />
              
                {/* seat map */}
                <View style={styles.seatsMapContainer}>
                    <SeatsMap
                     seatsMap = {this.state.seatsMap}
                     students = {this.state.students}
                     touchEventHandler={this.touchEventHandler}
                    />
                </View>
                <View>
                    <Button
                        title='完成'
                        onPress={()=>this.submitStudents(()=>{console.log('update student seats')})}
                        loading={this.state.buttonLoading}
                        disabled={this.state.studentsHaveBeenAssigned.length<this.state.students.length?(true):(false)}
                    />
                </View>
            
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
            />
            </ScrollView>
            
        )
    }
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#fff",
        marginLeft: 16,
        marginRight: 16
      },
    seatsMapContainer:{
        // paddingHorizontal: 8,
        marginVertical: 16,
        // minHeight: height*0.6-16,
        // minWidth: width,
        // borderWidth: 1,
        // borderColor: 'lightgray'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
})
