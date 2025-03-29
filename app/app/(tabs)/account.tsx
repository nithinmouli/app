import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Account() {
    return (
        <View>
            <Text>Hi there from account</Text>
            <Link href="../fav"> 
                <Text>Go to Favorites</Text>
            </Link>
        </View>
    );
}