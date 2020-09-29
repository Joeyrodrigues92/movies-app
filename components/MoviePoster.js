import React, { Component, PropTypes } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");
// How many posters we want to have in each row and column
const cols = 2,
  rows = 2;

export default function MoviePoster(props) {

    const {
    movie,
    movie: {
        imageUrl,
        category,
        title
    },
    onPress,
  } = props;

 

  return (
    /*invoke onPress if it not nill*/
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(movie)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.genre} numberOfLines={1}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginBottom: 10,
    height: (height - 20 - 20) / rows - 10,
    width: (width - 10) / cols - 10,
  },
  imageContainer: {
    flex: 1, // take up all available space
  },
  image: {
    borderRadius: 10, // rounded corners
    ...StyleSheet.absoluteFillObject, // fill up all space in a container
  },
  title: {
    fontSize: 14,
    marginTop: 4,
  },
  genre: {
    color: "#BBBBBB",
    fontSize: 12,
    lineHeight: 14,
  },
});
