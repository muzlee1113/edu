import React from 'react';
import {
    // Button,
    StyleSheet,
    Text,
    ScrollView,
    View,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
// import { Icon } from 'expo';
import { Button } from 'react-native-elements';
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";


// components
import StudentList from '../../components/InfoList';



export default class StudentsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };

    }

    render() {
        const { navigation, students, classId, className } = this.props;
        console.log("here is from students tab")
        console.log(classId)
        
        return (
        //     this.state.loading ? (
        // <View style={[styles.loadingContainer, styles.horizontal]}>
        //         <ActivityIndicator size="small" color="#0000ff" />
        //     </View>
        //     ) : (
                 <ScrollView
                    style={styles.container}
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />}
                >
                <StudentList
                    titleName='name'
                    listIcon='person'
                    items={students}
                    navigation={this.props.navigation}
                    pageModel="StudentItemDetails"
                />
                    <Button
                        icon={{
                        name: "add",
                        size: 15,
                        color: "#4089D6"
                    }}
                    buttonStyle={{
                        marginLeft: 16,
                        marginRight: 16,
                        marginTop: 8,
                        marginBottom: 8,
                        height: 40,
                    }}
                    color="#4089D6"
                    type="clear"
                    title="添加已有学生"
                    classId = {classId}
                    onPress={() => (navigation.navigate("SelectStudents", { classId: classId }))}
                />
                <Button
                        icon={{
                        name: "add",
                        size: 15,
                        color: "#4089D6"
                    }}
                    buttonStyle={{
                        marginLeft: 16,
                        marginRight: 16,
                        marginTop: 0,
                        marginBottom: 8,
                        height: 40,
                    }}
                    color="#4089D6"
                    type="clear"
                    title="增加学生"
                    classId = {classId}
                    onPress={() => (navigation.navigate("AddNewStudents", { classId: classId, className: className, fromWhere: 'ClassItemDetails' }))}
                />
            </ScrollView>
            )
        // )
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
    }
})
