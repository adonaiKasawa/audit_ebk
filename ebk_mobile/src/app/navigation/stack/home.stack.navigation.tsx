import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeVideosScreen from '../../screen/home/videos/home.videos.screen';
import HomeImagesScreen from '../../screen/home/images/home.images.screen';
import HomeAudiosScreen from '../../screen/home/audios/home.audios.screen';
import HomeBooksScreen from '../../screen/home/books/home.books.screen';

const Stack = createNativeStackNavigator();

function HomeStackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="VideosHome"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="VideosHome"
        component={HomeVideosScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AudiosHome"
        component={HomeAudiosScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BooksHome"
        component={HomeBooksScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ImagesHome"
        component={HomeImagesScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStackNavigation;
