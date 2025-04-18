import React from "react";
import { createStackNavigator } from "@react-navigation/stack"
import MainTabs from "./MainTabs";
import VideoDetailScreen from "../screens/VideoDetailScreen";
import Signup from "../screens/Signup";
import Login from "../screens/Login";

const stack = createStackNavigator()

export default function RootStack() {
    return (
        <stack.Navigator screenOptions={{ headerShown: false }}>
            <stack.Screen name="signup" component={Signup} />
            <stack.Screen name="main" component={MainTabs} />
            <stack.Screen name="login" component={Login} />
            <stack.Screen name="videoDetail" component={VideoDetailScreen} />
        </stack.Navigator>
    )
}