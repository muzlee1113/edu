// import React from 'react';
// import { StyleSheet, View, FlatList, RefreshControl, TouchableOpacity, Text, Dimensions } from 'react-native';
// import { ListItem } from 'react-native-elements'
// import { createStackNavigator, createAppContainer } from 'react-navigation';
// import { ExpoConfigView } from '@expo/samples';
// import seatsMapData from '../components/DummySeatsMap.json'
// import DraggableFlatList from 'react-native-draggable-flatlist'

// var height = Dimensions.get("window").height;
// var width = Dimensions.get("window").width;


// export default class SettingsScreen extends React.Component {

//   componentDidMount(){
//     // console.log(seatsMapData)
//   }
//   render() {
//     return (
//       <View style={{ padding: 16 }}>
//           {seatsMapData.map((row,i) => {
//               return (
//                 <View key={i} style={{ 
//                   // display:'flex',
//                   flexDirection: 'row', 
//                   justifyContent: 'center', 
//                   alignItems: 'center', 
//                   width: '100%'
//                   }}>
//                     {row.map((seat,j) => {
                      
//                         let seatNum = row.length
//                         let seatWidth = Math.floor(((width/seatNum)-16-8*seatNum))
//                         let seatHeight = Math.floor((seatWidth/3*2))
//                         let seatPadding = Math.floor((seatHeight-16)/2)
//                         let aisleWidth = (seatWidth/3)>16?Math.floor((seatWidth/3)):16
//                         console.log('seatWidth ' + seatWidth)
//                         console.log('seatHeight ' + seatHeight)
//                         console.log('seatPadding ' + seatPadding)
//                         console.log('aisleWidth ' + aisleWidth)



//                         return seat?(<View key={j} style={{ 
//                           maxWidth: 46,
//                           maxHeight: 30,
//                           width: seatWidth, 
//                           height: seatHeight, 
//                           backgroundColor: 'lightgray', 
//                           marginHorizontal: 8 , 
//                           marginVertical: 12, 
//                           borderTopLeftRadius: 16, 
//                           borderTopRightRadius: 14, 
//                           borderBottomLeftRadius: 2, 
//                           borderBottomRightRadius: 2}}><Text style={{textAlign: "center", paddingVertical: seatPadding, fontSize: 16, overflow:'hidden'}}>{seat.studentName}</Text></View>)
//                         :(<View key={j} style={{ width: aisleWidth, height: seatHeight, backgroundColor: 'white', margin: 0 }}/>);
//                     }
//                 )}
//             </View>
//          );
//           })
//          }
//          <View style={{width:'100%', 
//          height:46, 
//          backgroundColor: 'lightgray', 
//          marginTop: 32}}><Text style={{textAlign:'center', paddingVertical: 16}}>讲台</Text></View>
//       </View>
//       );
//   }
// }
// import React, { Component } from 'react'
// import { View, TouchableOpacity, Text } from 'react-native'
// import DraggableFlatList from 'react-native-draggable-flatlist'

// class Example extends Component {

//   state = {
//     data: [...Array(20)].map((d, index) => ({
//       key: `item-${index}`,
//       label: index,
//       backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index * 5}, ${132})`,
//     }))
//   }

//   renderItem = ({ item, index, move, moveEnd, isActive }) => {
//     return (
//       <TouchableOpacity
//         style={{ 
//           height: 100, 
//           backgroundColor: isActive ? 'blue' : item.backgroundColor,
//           alignItems: 'center', 
//           justifyContent: 'center' 
//         }}
//         onLongPress={move}
//         onPressOut={moveEnd}
//       >
//         <Text style={{ 
//           fontWeight: 'bold', 
//           color: 'white',
//           fontSize: 32,
//         }}>{item.label}</Text>
//       </TouchableOpacity>
//     )
//   }

//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <DraggableFlatList
//           data={this.state.data}
//           renderItem={this.renderItem}
//           keyExtractor={(item, index) => `draggable-item-${item.key}`}
//           scrollPercent={5}
//           onMoveEnd={({ data }) => this.setState({ data })}
//         />
//       </View>
//     )
//   }
// }

// export default Example

// import React, { Component } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import DateTimePicker from "react-native-modal-datetime-picker";
// import { Input, Button, Icon } from 'react-native-elements'


// export default class DateTimePickerTester extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isDateTimePickerVisible: false,
//       duration: 0
//     };
//   }

//   showDateTimePicker = () => {
//     this.setState({ isDateTimePickerVisible: true });
//   };

//   hideDateTimePicker = () => {
//     this.setState({ isDateTimePickerVisible: false });
//   };

//   handleDatePicked = date => {
//     console.log("A date has been picked: ", date);
//     this.setState({ duration: date });
//     this.hideDateTimePicker();
// };

//   render() {
//     return (
//       <>
//         <Text
//           style={{
//               color: "black", fontSize: 24, fontWeight: "bold", marginTop: 8,
//               marginBottom: 20,
//           }}
//             >此项活动预计时长为</Text>
//         <TouchableOpacity 
//           onPress={()=>this.showDateTimePicker()}
//           style={{
//             // flexDirection: 'row',
//             borderBottomWidth: 1,
//             // alignItems: 'center',
//             borderColor: '#86939e',
//           }}
//           >
//         {this.state.duration?(<Text style={{fontSize: 18}}>{this.state.date}</Text>)
//         :(<Text style={{fontSize: 18}}>请选择时间</Text>)}
//         </TouchableOpacity>
//         <DateTimePicker
//           cancelTextIOS={'取消'}
//           confirmTextIOS={'确定'}
//           titleIOS={'设置时长'}
//           mode={'time'}
//           locale="en_GB"           
//           isVisible={this.state.isDateTimePickerVisible}
//           onConfirm={this.handleDatePicked}
//           onCancel={this.hideDateTimePicker}
//         />
//       </>
//     );
//   }
// }



//===========================================
import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import TimePicker from "react-native-24h-timepicker";
 
class Example extends Component {
  constructor() {
    super();
    this.state = {
      hour: 0,
      minute:0
    };
  }
 
  onCancel() {
    this.TimePicker.close();
  }
 
  onConfirm(hour, minute) {
    this.setState({ hour, minute });
    this.TimePicker.close();
  }
 
  render() {
    return (
      <View style={styles.container}>
        <Text
          style={{
              color: "black", fontSize: 24, fontWeight: "bold", marginTop: 8,
              marginBottom: 20,
          }}
            >此项活动预计时长为</Text>
        <TouchableOpacity 
          onPress={() => this.TimePicker.open()}
          style={{
            // flexDirection: 'row',
            borderBottomWidth: 1,
            // alignItems: 'center',
            borderColor: '#86939e',
          }}
          >
        {this.state.hour||this.state.minute?(<Text style={{fontSize: 18}}>{this.state.hour}小时 {this.state.minute}分</Text>)
        :(<Text style={{fontSize: 18}}>请选择时间</Text>)}
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => this.TimePicker.open()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>TIMEPICKER</Text>
        </TouchableOpacity>
        <Text style={styles.text}>{this.state.time}</Text> */}
        <TimePicker
          ref={ref => {
            this.TimePicker = ref;
          }}
          hourUnit=' 小时'
          minuteUnit=' 分'
          textConfirm='确定'
          textCancel='取消'
          onCancel={() => this.onCancel()}
          onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
        />
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 100
  },
  text: {
    fontSize: 20,
    marginTop: 10
  },
  button: {
    backgroundColor: "#4EB151",
    paddingVertical: 11,
    paddingHorizontal: 17,
    borderRadius: 3,
    marginVertical: 50
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  }
});
 
export default Example;