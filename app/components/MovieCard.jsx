import React, { useEffect } from "react";
import { View, ImageBackground, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export default function MovieCard({ movie, onRemove }) {
  const ratingColour = movie.vote_average >= 7 ? "green" : movie.vote_average >= 5 ? "orange" : "red";
  const [favoriteButtonColor, setFavoriteButtonColor] = React.useState("white");

  useEffect(() => { 
    const checkIfFavorite = async () => {
      try {
        const existingFavorites = await AsyncStorage.getItem("favoriteMovies");
        const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
        const isFavorite = favorites.some((favMovie) => favMovie.id === movie.id);
        setFavoriteButtonColor(isFavorite ? "red" : "white");
      } catch (e) {
        console.log(e);
      }
    };

    checkIfFavorite();
  }, [movie.id]);
  
  const onFavoritePress = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem("favoriteMovies");
      const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
      const isFavorite = favorites.some((favMovie) => favMovie.id === movie.id);

      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter((favMovie) => favMovie.id !== movie.id);
        await AsyncStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
        setFavoriteButtonColor("white");
        // Notify parent to remove this movie from the favorites list
        onRemove && onRemove(movie.id);
        Alert.alert("Removed from favorites", `${movie.title} has been removed from your favorites.`);
      } else {
        // Add to favorites
        favorites.push(movie);
        await AsyncStorage.setItem("favoriteMovies", JSON.stringify(favorites));
        setFavoriteButtonColor("red");
        Alert.alert("Added to favorites", `${movie.title} has been added to your favorites.`);
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <View style={styles.card}> 
      <ImageBackground
        source={{
          uri: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/200",
        }}
        style={styles.poster}
        imageStyle={{ borderRadius: 8 }}
      >
        <View style={styles.topOverlay}>
          <View style={[styles.ratingContainer, { backgroundColor: ratingColour }]}> 
            <Text style={styles.ratingText}>{parseFloat(movie.vote_average).toFixed(2) || "N/A"}</Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
            <Text style={[styles.favoriteText, { color: favoriteButtonColor }]}>❤</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{movie.title}</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  poster: {
    flex: 1,
    justifyContent: "flex-end",
  },
  topOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  ratingContainer: {
    padding: 5,
    borderRadius: 5,
  },
  ratingText: {
    color: "white",
    fontSize: 14,
  },
  favoriteButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 5,
  },
  favoriteText: {
    fontSize: 16,
  },
  title: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(71, 71, 71, 0.5)",
    padding: 10,
  },
});
