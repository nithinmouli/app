import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet,ScrollView } from "react-native";
import axios from "axios";
import MovieCard from "@/components/MovieCard";
import { useFocusEffect } from "expo-router";

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);

  


  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?language=en-US`,
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYmY1ZWFkOWJiMGFkNzA4YTFiNGRhYTBlOTNmOWIzMyIsIm5iZiI6MTcyMDkyNDU2NS4zNDIwNCwic3ViIjoiNjY5MjBhZDJhZDc3MjRhOTAzNmUzZTc1Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.fV8rNyhxA_qbY7nMHlMh3ruIhY9UBA86YDBI1WZSFhs",
            accept: "application/json",
          },
        }
      );
      setMovies(response.data.results);
    } catch (err) {
      console.log(err);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchMovies();
    }, [])
  );

  useEffect(() => {
    fetchMovies();
  }, []);
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          {movies.map((movie) => (
            <MovieCard 
            key={movie.id} movie={movie} 
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