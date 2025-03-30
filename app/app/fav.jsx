import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "@/components/MovieCard";

export default function FavoritesScreen() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const existingFavorites = await AsyncStorage.getItem("favoriteMovies");
        const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];

        const movieData = await Promise.all(
          favorites.map(async (movie) => {
            const response = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=1bf5ead9bb0ad708a1b4daa0e93f9b33`
            );
            return response.data;
          })
        );
        setMovies(movieData);
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);

  // Callback to remove a movie from the list
  const removeMovieFromState = (movieId) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRemove={removeMovieFromState}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 20,
  },
});
