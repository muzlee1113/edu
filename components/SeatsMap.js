import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl, TouchableOpacity, Text, Dimensions, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements'
import { createStackNavigator, createAppContainer } from 'react-navigation';

var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;

export default class SeatsMap extends React.Component {
    state = {
        seatsMapData: []
    }
    
    componentDidMount(){
        console.log("componentDidMountcomponentDidMountcomponentDidMountcomponentDidMountcomponentDidMountcomponentDidMount")
       this.configSeatsMapData()
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceivePropscomponentWillReceivePropscomponentWillReceivePropscomponentWillReceiveProps")
        this.configSeatsMapData()
    }

    configSeatsMapData=()=>{
        console.log("EMPTY SEATSMAPDATA!!! EMPTY SEATSMAPDATA!!!! EMPTY SEATSMAPDATA!!!!")
        const seatsMapData = [...this.props.seatsMap]
        const emptySeatsMapData = seatsMapData.map(row=>{
            row.map(seat=>{
                if(seat){
                    seat['studentName'] = ''
                    seat['studentId'] = ''
                }
                return seat
            })
            return row
        })
        this.setState({
            seatsMapData:[...emptySeatsMapData]
        },()=>{
            this.assignStudent()
        })
    }

   
    assignStudent=()=>{
        console.log(">>>>>>>>>>>>>>>now the seatsMapData in before assigning is<<<<<<<<<<<<<<<<<")
        console.log(this.state.seatsMapData)
        const seatsMapData = [...this.state.seatsMapData]
        console.log(">>>>>>>>>>>>>>>now the students data before assigning is <<<<<<<<<<<<<<<<<")
        console.log(this.props.students)        
        console.log(">>>>>>>>>>>>>>>==============================================<<<<<<<<<<<<<<<<<")

        console.log("==================start assigning==========")
        this.props.students.forEach(student=>{
            if(student.hasOwnProperty('seat')){
                // student info object
                let updatedSeatObj = {
                    studentName: student.name, 
                    studentId: student._id
                }
                
                let {rowIndex, seatIndex} = student.seat
                seatsMapData[rowIndex].splice(seatIndex,1,{...updatedSeatObj})
                console.log("================== assign a student ================")
                console.log(student)
                console.log("================== to =================")
                console.log(student.seat)
            }else{
                console.log("don't have a")
            }
        })
        // set state so change the dom
        this.setState({
            seatsMapData: [...seatsMapData],
        },()=>{
            console.log('seatsMapData has been changed')
            console.log(this.state.seatsMapData)
        })
    }

    render() {
        const seatsMapData = this.state.seatsMapData
        // const seatNum =  this.props.seatNum || this.props.seatsMapData[0].length
        // const seatNum =  this.state.seatsMapData[0].length || 1

        // console.log(this.props)
        // console.log("====================")

        return (<>
            <ScrollView 
                contentContainerStyle={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                }}
                style={{  
                    // height: height*0.8-16,
                    position: 'relative', 
                    width: width-32, 
                }}
                maximumZoomScale={3}
                minimumZoomScale={1}
            >
            {seatsMapData.length > 0 ? (seatsMapData.map((row, i) => {
                return (
                    <ScrollView 
                        // horizontal
                        // centerContent
                     
                        // onScroll={this.scrollTogether}
                        // scrollEventThrottle={16}
                        key={i} 
                        contentContainerStyle={{
                            flex:1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        style={{
                        
                        backgroundColor: "#EAE8E8",
                        width: width-32,
                        maxHeight: 60,
                        minHeight: 46,
                        marginVertical: 8,
                    }}>
                        {row.map((seat, j) => {
                            let seatNum = row.length
                            let seatWidth = Math.floor((((width - 16 - seatNum * 16) / seatNum)))
                            let seatHeight = Math.floor((seatWidth / 3 * 2))
                            let fontSize = seatWidth/4
                            let seatPadding = Math.floor((seatHeight - fontSize) / 2)
                            // let aisleWidth = (seatWidth / 3) > 16 ? Math.floor((seatWidth / 3)) : 16
           


                            return seat ?
                                (<TouchableOpacity
                                    key={j}
                                    style={{
                                        flex:1,
                                        // width: seatWidth,
                                        // height: '100%',
                                        // minWidth: 46,
                                        maxHeight: 46,
                                        maxWidth: 69,
                                        backgroundColor: '#C4C0C0', 
                                        marginHorizontal: 4,
                                        // marginVertical: 12
                                    }}
                                    onPress={()=>{
                                        console.log('row is ' + i)
                                        console.log('seat is ' + j)
                                        this.props.touchEventHandler(i,j,seat.studentId)
                                    }}
                                >
                                        <Text style={{ textAlign: "center", paddingVertical: seatPadding, fontSize: fontSize, overflow: 'hidden' }}>
                                            {seat.studentName}
                                        </Text>
                                    </TouchableOpacity>)
                                : (<View key={j} style={{ width: 16, height: '100%', backgroundColor: '#EAE8E8', margin: 0 }} />);
                        }
                        )}
                    </ScrollView>
                );
            })
            ) : (<></>)}
        <View style={{
            // width: '100%',
            height: 46,
            backgroundColor: 'lightgray',
            marginTop: 32,
            // position: 'absolute',
            // bottom: 2
        }}>
            <Text style={{ textAlign: 'center', paddingVertical: 16 }}>讲台</Text>
        </View>
        </ScrollView>
       
        </>
);
    }
}
