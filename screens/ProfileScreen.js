import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import MoviePoster from '../components/MoviePoster';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'; 
import Profile from '../components/Profile';

//current User Query
const PROFILE_QUERY = gql`
  query {
    currentUser {
      id
      username
      email
      votes {
        movie {
          id
          title
          description
          imageUrl
          category {
            id
            title
          }
        }
      }
    }
  }
`;

export default function ProfileScreen({ route, navigation }) {
  const { data, loading, error } = useQuery(
    PROFILE_QUERY, 
    { fetchPolicy: "network-only" }
  );
    console.log('user data', data)
  if (!data || !data.currentUser) {
  
    return <ActivityIndicator color="#161616" style={{...StyleSheet.absoluteFillObject}} />
  }
  console.log('Profile Screen', data)

  const { currentUser } = data;
  const { username, email, votes } = currentUser;
  return (
    <View style={styles.container}>
       <Profile currentUser={currentUser} />
      {votes && votes.length ? <FlatList
        data={votes}
        keyExtractor={(item, index) => {
          return `${index}`;
        }}
        numColumns={2}
        decelerationRate="fast"
        renderItem={({ item, index }) => {
          const {movie} = item;
          return (
            <MoviePoster movie={movie} onPress={() => navigation.navigate('Detail', {movie: movie})} />
          )}} 
        />
      : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  saveIcon: {
    position: 'relative',
    right: 20,
    zIndex: 8
  },
});