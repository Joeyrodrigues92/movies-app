import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions
} from 'react-native';
import RoundedButton from '../components/RoundedButton';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

// Queries
const VOTES_QUERY = gql`
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
            title
          }
        }
      }
    }
  }
`;

// Mutations
const ADD_VOTE = gql`
  mutation AddVote($movieId:ID!) {
    addVote(movieId: $movieId)
  }
`;

const REMOVE_VOTE = gql`
  mutation RemoveVote($movieId:ID!) {
    removeVote(movieId: $movieId)
  }
`;

const { width } = Dimensions.get('window');

function MovieDetail({ route, navigation }) {
  const { data, refetch } = useQuery(VOTES_QUERY);
  const [addVote] = useMutation(ADD_VOTE);
  const [removeVote] = useMutation(REMOVE_VOTE);

  const { params } = route;
  const { movie } = params;
  const {
    id,
    title,
    description,
    imageUrl,
    category
  } = movie;
  //conditional rendering / guard operator
  const isFavorite = data && 
  data.currentUser && 
    data.currentUser.votes && 
      data.currentUser.votes.find(vote => vote.movie.id == id);
  console.log("FAV", isFavorite)
  const primaryColor = isFavorite ? "rgba(75, 148, 214, 1)" : "#fff";
  const secondaryColor = isFavorite ? "#fff" : "rgba(75, 148, 214, 1)";
  const saveString = isFavorite ? 'Remove Vote' : 'Add Vote';
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.image} source={{uri: imageUrl}} />
        <Text numberOfLines={2} style={[styles.text, {textAlign: 'center'}]}>{title}</Text>
        <RoundedButton
          text={saveString}
          
          textColor={primaryColor}
          backgroundColor={secondaryColor}
          onPress={() => {
            if (isFavorite) {
              removeVote({ variables: { movieId: parseFloat(id) } })
              .then(() => refetch())
              .catch(err => console.log(err)) 
            } else {
              addVote({ variables: { movieId: parseFloat(id) } })
              .then(() => refetch())
              .catch(err => console.log(err))
            }
          }}
          icon={<Ionicons name="md-checkmark-circle" size={20} color={primaryColor} style={styles.saveIcon} />}
        />
        <View style={styles.statRow}>
          <Text style={styles.stat} numberOfLines={1}>Category</Text>
          <Text style={styles.stat} numberOfLines={1}>{category.title}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.stat}>{description}</Text>
        </View>
      </View>
    </ScrollView>
  );

}

MovieDetail.navigationOptions = screenProps => ({
  title: screenProps.navigation.getParam("movie").title
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: 32,
    color: '#161616',
    paddingBottom: 15,
  },
  image: {
    width: width,
    height: width,
    resizeMode: 'center',
  },
  statRow: {
    width: "100%",
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    color: '#161616',
    fontSize: 16,
    fontWeight: '500',
  },
  saveIcon: {
    position: 'relative',
    left: 20,
    zIndex: 8
  },
  contentContainer: {
    paddingTop: 10
  },
});

export default MovieDetail;