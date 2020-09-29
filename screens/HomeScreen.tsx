import React, { useState } from 'react';
import { StyleSheet, Image, Platform, Text, TouchableOpacity, FlatList, View, ActivityIndicator } from 'react-native';
import MoviePoster from '../components/MoviePoster';
import Tag from "../components/Tag";
import Navigation from '../navigation';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';


// Queries
const FEED_QUERY = gql`
  query Feed($categoryId: ID) {
    feed(categoryId: $categoryId) {
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
`;

const CATEGORY_QUERY = gql`
  query {
    categories {
      id
      title
    }
  }
`;

export default function HomeScreen(props) {
  const { navigation } = props;
  const [categoryId, setCategoryId] = useState(0);
  const { data, refetch, error } = useQuery(
    FEED_QUERY,
    {
      variables: categoryId ? { categoryId } : {},
      fetchPolicy: "cache-and-network"
    }
  );
  
  const { data: genres } = useQuery(CATEGORY_QUERY);

  if (error) {
    console.log(error)
    return <Text>{error.message}</Text>
  }
  if (!data || !data.feed) {
    return <ActivityIndicator color="#161616" style={{ ...StyleSheet.absoluteFillObject }} />
  }

  return (
    <View style={styles.container}>
      {genres ? <FlatList
        data={genres.categories}
        horizontal
        keyExtractor={(item, index) => {
          return `${index}`;
        }}
        extraData={categoryId}
        style={styles.bottomBorder}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          //if categoryId matches item.id  store in selected
          const selected = categoryId == item.id;
          return (
            <Tag 
              key={index} 
              selected={selected} 
              title={item.title}
              onPress={() => {
                if (selected){
                  //set categoryId back to 0
                    setCategoryId(0);
                    //pull a new list of movies, according to catergory id
                    refetch();
                } else {
                  setCategoryId(parseInt(item.id))
                  refetch();
                }
              }}
            />
          )
        }}
      />
        : null}

      <FlatList
        data={data.feed}
        keyExtractor={(item, index) => {
          return `${index}`;
        }}
        numColumns={2}
        decelerationRate="fast"
        renderItem={({ item, index }) => {
          return (
            <MoviePoster 
              movie={item} 
              onPress={() => navigation.navigate("Detail", { movie: item })} 
            />
          )
        }}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around'
  },
  scrollContent: {
    paddingTop: 10
  },
  bottomBorder: {
    borderBottomColor: "#d3d3d3",
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});
