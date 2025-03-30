import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView, View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import MovieCard from "@/components/MovieCard";
import { useFocusEffect, useRouter } from "expo-router";

export default function PopularMovies() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (pageNumber = 1) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageNumber}`,
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYmY1ZWFkOWJiMGFkNzA4YTFiNGRhYTBlOTNmOWIzMyIsIm5iZiI6MTcyMDkyNDU2NS4zNDIwNCwic3ViIjoiNjY5MjBhZDJhZDc3MjRhOTAzNmUzZTc1Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.fV8rNyhxA_qbY7nMHlMh3ruIhY9UBA86YDBI1WZSFhs",
            accept: "application/json",
          },
        }
      );
      // Append movies for page > 1 else set initial movies
      setMovies(prev => pageNumber === 1 ? response.data.results : [...prev, ...response.data.results]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial movies on focus and component mount
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchMovies(1);
    }, [])
  );

  // Check if user scrolled near bottom
  const handleScroll = ({ nativeEvent }) => {
    const paddingToBottom = 20;
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      // Load next page if not currently loading
      if (!loading) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMovies(nextPage);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        onScroll={handleScroll} 
        scrollEventThrottle={400}
      >
        <View style={styles.container}>
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie}
              onPress={() => router.push(`movie/${movie.id}`)} 
            />
          ))}
        </View>
        {loading && <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 20 }} />}
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
