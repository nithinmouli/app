import { Text, View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import popular from "@/api/popular";
import upcoming from "@/api/upcoming";
import toprated from "@/api/toprated";

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Popular" component={popular} />
            <Tab.Screen name="Upcoming" component={upcoming} />
            <Tab.Screen name="TopRated" component={toprated} />
        </Tab.Navigator>
    );
}