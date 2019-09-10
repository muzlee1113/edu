import React from 'react';
import {
    // Button,
    StyleSheet,
    Text,
    ScrollView,
    View,
    ActivityIndicator,
    RefreshControl,
    Button
} from 'react-native';
// import { Icon } from 'expo';
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";


// components
import SeatsMap from '../../components/SeatsMap'


export default class SeatsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seatsMapData: []
        };

    }

    componentDidMount(){
        // assigning students to seatsMap
        // this.assignStudent()
    }

   

    touchEventHandler=(rowIndex, seatIndex)=>{
        // let studentIndex = this.state.onScreenStudentIndex
        // let seat = {rowIndex:rowIndex, seatIndex:seatIndex}
        // let students = [...this.props.navigation.state.params.students]
        
        
        // // update student data in state
        // let updatedStudents = students.map((student,i)=>{
        //     if(studentIndex===i){
        //         student.seat = {...seat}
        //     }
        //     return student
        // })

        // this.setState({
        //     students: [...updatedStudents]
        // },()=>{

        //     // change dom, mapping students array's seat data into seat map
        //     this.assignStudent()
        //     // move to the next student
        //     this.nextStudent()
        
        // })
    }


    render() {
        const { navigation, students, classId, className, seatsMap } = this.props;
        console.log("here is from seats tab")
        console.log(classId)
        console.log(seatsMap)
        // const{seatsMap}=this.props
        
        return (
            <ScrollView style={styles.container}>
            {seatsMap.length === 0 ? 
            (<><Text>
                <Text style={{fontSize:16}}>{`还未设置座位，前往 `}</Text>
                <Text 
                    style={{color: '#4089D6', fontSize: 16 }} 
                    onPress={() => {navigation.navigate('CreateSeatsMap',{startingStep:0, classId:classId, className:className, students: students })}}>{`设置座位`}</Text>
                <Text style={{fontSize:16}}>{` 吧`}</Text>
                
            </Text></>)
            : (<>
                <View style={{flexDirection:'row'}}>
                    <Text 
                        style={{color: '#4089D6', fontSize: 16, marginHorizontal: 4 }} 
                        onPress={() => {navigation.navigate('CreateSeatsMap',{ startingStep:0, classId:classId, className:className, seatsMap:seatsMap, students: students })}}>{`重新设置座位`}
                    </Text>
                    <Text 
                        style={{color: '#4089D6', fontSize: 16, marginHorizontal: 4 }} 
                        onPress={() => {navigation.navigate('AssignStudentsToSeats',{classId:classId, className:className, students: students})}}>{`重排学生座次`}
                    </Text>  
                </View>
               

            <View style={styles.seatsMapContainer}>
                <SeatsMap 
                    withStudents = {true}
                    students = {students}
                    seatsMap = {seatsMap}
                    // seatsMapData={this.state.seatsMapData}
                    // seatNum = {this.state.seatNum}
                    touchEventHandler={this.touchEventHandler}        
                />
            </View>
            </>)}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    seatsMapContainer:{
        // paddingHorizontal: 8,
        marginVertical: 16,
        // minHeight: height*0.6-16,
        // minWidth: width,
        // borderWidth: 1,
        // borderColor: 'lightgray'
    },
})
