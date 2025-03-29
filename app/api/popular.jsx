import { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import axios from "axios";

export default function PopularMovies() {
    const [movies, setMovies] = useState([]);
    const fetchMovies = async () => {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/popular?language=en-US`,
                {
                    headers: {
                        Authorization:
                            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYmY1ZWFkOWJiMGFkNzA4YTFiNGRhYTBlOTNmOWIzMyIsIm5iZiI6MTcyMDkyNDU2NS4zNDIwNCwic3ViIjoiNjY5MjBhZDJhZDc3MjRhOTAzNmUzZTc1Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.fV8rNyhxA_qbY7nMHlMh3ruIhY9UBA86YDBI1WZSFhs",
                        accept: "application/json",
                    },
                }
            );
            // Set movies to be the array of results
            setMovies(response.data.results);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {fetchMovies() }, []);

    return (
        <ScrollView style={styles.container}>
            {movies.map((item) => (
                <View key={item.id.toString()} style={styles.itemContainer}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                        style={styles.poster}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text numberOfLines={3}>{item.overview}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    itemContainer: { flexDirection: "row", marginBottom: 15 },
    poster: { width: 100, height: 150, marginRight: 10 },
    textContainer: { flex: 1 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
});