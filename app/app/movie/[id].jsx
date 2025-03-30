import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MovieCard from '../../components/MovieCard';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const Movie = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movieDetails, setMovieDetails] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(2);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const apiKey = '1bf5ead9bb0ad708a1b4daa0e93f9b33';
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: apiKey,
            append_to_response: 'credits,videos,watch/providers',
          },
        });
        setMovieDetails(response.data);

        // Fetch recommendations
        const recommendationsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations`, {
          params: { api_key: apiKey },
        });
        setRecommendations(recommendationsResponse.data.results);

        // Fetch reviews
        const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/reviews`, {
          params: { api_key: apiKey },
        });
        setReviews(reviewsResponse.data.results);
      } catch (err) {
        console.error('Error fetching movie details:', err);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (!movieDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const director = movieDetails.credits.crew.find(person => person.job === 'Director');
  const cast = movieDetails.credits.cast;
  const trailer = movieDetails.videos.results.find(video => video.type === 'Trailer');
  const rating = movieDetails.vote_average;
  const stars = Math.round(rating / 2);

  const getWikipediaLink = (name) => {
    const formattedName = name.split(' ').join('_');
    return `https://en.wikipedia.org/wiki/${formattedName}`;
  };

  const fallbackImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return fallbackImage;
    if (avatarPath.startsWith('/https')) {
      return avatarPath.replace('/https', 'https');
    }
    return `https://image.tmdb.org/t/p/w500${avatarPath}`;
  };

  const openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Image with Title Overlay */}
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` }} 
          style={styles.headerImage} 
          resizeMode="cover" 
        />
        <View style={styles.overlay} />
        <Text style={styles.title}>{movieDetails.title}</Text>
      </View>

      {/* Movie Rating */}
      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Text key={index} style={ index < stars ? styles.filledStar : styles.emptyStar}>
              ★
            </Text>
          ))}
          <Text style={styles.ratingText}>{rating.toFixed(1)}/10</Text>
        </View>
      </View>

      {/* Movie Overview */}
      <View style={styles.section}>
        <Text style={styles.overview}>{movieDetails.overview}</Text>
      </View>

      {/* Release Date */}
      <View style={styles.sectionCenter}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>Release Date: {movieDetails.release_date}</Text>
        </View>
      </View>

      {/* Genres */}
      <View style={styles.genresContainer}>
        {movieDetails.genres.map(genre => (
          <View key={genre.id} style={styles.genreBadge}>
            <Text style={styles.genreText}>{genre.name}</Text>
          </View>
        ))}
      </View>

      {/* Director and Cast */}
      <View style={styles.section}>
        {director && (
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Director</Text>
            <TouchableOpacity 
              style={styles.personContainer}
              onPress={() => openURL(getWikipediaLink(director.name))}
            >
              <Image 
                source={{ uri: `https://image.tmdb.org/t/p/w500${director.profile_path}` }} 
                style={styles.directorImage}
                defaultSource={{ uri: fallbackImage }}
              />
              <Text style={styles.personName}>{director.name}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Cast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castContainer}>
          {cast.map(member => (
            <TouchableOpacity 
              key={member.cast_id}
              style={styles.personContainer}
              onPress={() => openURL(getWikipediaLink(member.name))}
            >
              <Image 
                source={{ uri: `https://image.tmdb.org/t/p/w500${member.profile_path}` }}
                style={styles.personImage}
                defaultSource={{ uri: fallbackImage }}
              />
              <Text style={styles.personName}>{member.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trailer and Watch Movie Buttons */}
      <View style={styles.buttonContainer}>
        {trailer && (
          <TouchableOpacity 
            style={styles.buttonTrailer}
            onPress={() => openURL(`https://www.youtube.com/watch?v=${trailer.key}`)}
          >
            <Text style={styles.buttonText}>Watch Trailer</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.buttonWatch}
          onPress={() => {
            console.log('Navigate to movie player');
          }}
        >
          <Text style={styles.buttonText}>Watch Movie</Text>
        </TouchableOpacity>
      </View>

      {/* Recommended Movies using MovieCard */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Movies</Text>
        {recommendations.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recommendationsContainer}
            contentContainerStyle={{ paddingLeft: 15, paddingRight: 5 }} // for spacing
          >
            {recommendations.map(movie => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                onPress={() => router.push(`/movie/${movie.id}`)}
                cardStyle={{
                  width: 130,
                  height: 195,
                  marginRight: 15,
                }}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noRecommendations}>No recommendations available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#1a1a1a'
  },
  loadingText: {
    color:'#fff',
    marginTop: 10,
    fontSize: 16,
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
    height: deviceHeight * 0.4, // Responsive height based on screen height
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: deviceHeight * 0.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    position: 'absolute',
    bottom: 20,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  ratingContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filledStar: {
    color: '#f1c40f',
    fontSize: 20,
  },
  emptyStar: {
    color: '#555',
    fontSize: 20,
  },
  ratingText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionCenter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overview: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  dateBadge: {
    backgroundColor: 'rgba(29, 161, 242, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1da1f2',
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  genreBadge: {
    backgroundColor: '#333',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  genreText: {
    color: '#fff',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#1da1f2',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  personContainer: {
    alignItems: 'center',
    marginRight: 15,
    width: 100,
  },
  personImage: {
    width: 100,
    height: 140,
    borderRadius: 10,
    marginBottom: 5,
  },
  personName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  castContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  buttonTrailer: {
    backgroundColor: 'rgba(231, 76, 60, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonWatch: {
    backgroundColor: 'rgba(46, 204, 113, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  recommendationsContainer: {
    flexDirection: 'row',
  },
  noRecommendations: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  directorImage: {
    width: 100,
    height: 140,
    borderRadius: 10,
    marginBottom: 5,
    alignSelf: 'center',
  },
});

export default Movie;
