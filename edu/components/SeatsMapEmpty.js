import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl, TouchableOpacity, Text, Dimensions, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements'
import { createStackNavigator, createAppContainer } from 'react-navigation';

var height = Dimensions.get("window").height;
var width = Dimensions.get("window").width;

export default class SeatsMap extends React.Component {
    state = {
    }
    
    
    render() {
        const seatsMapData = this.props.seatsMap || []

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
                                    // onPress={()=>{
                                    //     console.log('row is ' + i)
                                    //     console.log('seat is ' + j)
                                    //     this.props.touchEventHandler(i,j,seat.studentId)
                                    // }}
                                >
                                        <Text style={{ textAlign: "center", paddingVertical: seatPadding, fontSize: fontSize, overflow: 'hidden' }}>
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
