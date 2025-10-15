import {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TouchableOpacity, useColorScheme} from 'react-native';
import BottomTabNavigation from '../bottom/bottom.navigation';
import VideosPlayerScreen from '../../screen/player/player.videos.screen';
import AudiosPlayerScreen from '../../screen/player/player.audios.screen';
import BooksPlayerScreen from '../../screen/player/player.books.screen';
import ImagesPlayerScreen from '../../screen/player/player.images.screen';
import ChurchListScreen from '../../screen/church/church.list.screen';
import ChurchDetailScreen from '../../screen/church/church.detail.screen';
import ProgrammesScreen from '../../screen/programmes/programmes.screen';
import CommuniquesScreen from '../../screen/communiques/communiques.screen';
import PostPonneCreateScreen from '../../screen/postponne/postponne.create.screen';
import PostPonneScreen from '../../screen/postponne/postponne.screen';
import TestimonialsHandlerScreen from '../../screen/testimonials/testimonials.handeler.screen';
import TestimonialsUploadScreen from '../../screen/testimonials/testimonials.upload.screen';
import SettingsScreen from '../../screen/setting/settings.screen';
import colors from '../../../components/style/colors';
import Feather from 'react-native-vector-icons/Feather';
import HeaderBottomNavigation from '../bottom/header/header.bottom.navigation';
import ForumSubjectScreen from '../../screen/forum/forum.subject.screen';
import ForumParticipationScreen from '../../screen/forum/forum.participation';
import AccountStackNavigation from './account.stack.navigation';
import {MediaPage} from '../../../components/camera/MediaPage';
import BibleStudyContentScreen from '../../screen/bibleStudys/bibleStudy.content.screen';
import BibleStudyVideosPlayerScreen from '../../screen/player/player.biblistudy.screen';
import SearchScreen from '../../screen/search/Search.screen';
import NotificationsScreen from '../../screen/notification/notification.screen';
import PrivacyAppScreen from '../../screen/setting/privacy.app.screen';
import {ListenNotification} from '../../natification/config';
import ImagesGalleryPlayerScreen from '../../screen/player/player.images.gallery.screen';
import TestimonialsMontangeVideoScreen from '../../screen/testimonials/testimonials.montange.video.screen';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  selectFirstOpen,
  setFirstOpen,
} from '../../store/firstOpen/first.open.slice';
import DataDisclosureModal from '../../../components/modal/data.discloture';
import BibleStudysScreen from '../../screen/bibleStudys/bibleStudys.screen';
import BibleSelectScreen from '../../screen/bible/bible.select.screen';
import VersionSelectorScreen from '../../screen/bible/version.selector.screen';
import ProfileScreen from '../../screen/setting/profile/profil.screen';
import PickerFileScreen from '../../screen/setting/profile/picker.file.screen';
import SondageScreen from '../../screen/sondage/sondage.screen';
import SondageAnwseredScreen from '../../screen/sondage/sondage.answer.screen';
import HomeChurchScreen from '../../screen/HomeChurch/home.chuch.screen';
import AdminChurchDrawerNavigation from '../drawer/admin.drawer.navigation';
import AnnonceEventScreen from '../../screen/home/annonces/annonce.event.screen';
import AnnonceEventPaymentScreen from '../../screen/home/annonces/annonce.event.payement.screen';
import EventScreen from '../../screen/event/event.screen';
import ImageBibleSelectorScreen from '../../screen/bible/bible.image.selector';
import CreateImageVerseBibleScreen from '../../screen/bible/bible.image.creator';
import CreateNoteVerseBibleScreen from '../../screen/bible/bible.note.creator';
import BibleNoteListScreen from '../../screen/bible/bible.note.list';
import ReadingPlansScreen from '../../screen/readingplans/reading.plans.screen';
import React from 'react';
import ReadingPlanDetailScreen from '../../screen/readingplans/reading.plans.detail.screen';
import ReadingPlansBycategoryScreen from '../../screen/readingplans/reading.plans.bycategory.screen';
import {capitalize} from '../../config/func';
import QuestionSuggestionScreen from '../../screen/suggestion/question.suggestion.screen';
import historicalAudiosScreen from '../../screen/historical/historical.audios.screen';
import TestimonialDetailScreen from '../../screen/testimonials/testimonial.detail.screen';
import BibleViewer from '../../screen/bible/bible.viewer';
import BibleHomeScreen from '../../screen/bible/home.bible';
import VersetDayScreen from '../../screen/bible/verset.day';
import BiblePanoramaNewScreen from '../../screen/bible/bible.panorama.new';
import BiblePanoramaLastScreen from '../../screen/bible/bible.panorama.last';
import TestimonialsPublishScreen from '../../screen/testimonials/testimonial.publish.screem';
import QuizScreen from '../../screen/quiz/quiz.screen';
import QuizDetailScreen from '../../screen/quiz/quiz.detail.screen';
import ScoreHistoryScreen from '../../screen/quiz/score.history.screen';

const Stack = createNativeStackNavigator();

function StackNavigationApp({navigation, route}: any) {
  const firstOpenState = useAppSelector(selectFirstOpen);
  const [firstOpen, setFtOpen] = useState<boolean>(firstOpenState.open);
  const dispatch = useAppDispatch();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  const handelSetFirstOpen = () => {
    dispatch(setFirstOpen({open: false, inTesmonials: true}));
    setFtOpen(false);
  };

  return (
    <>
      {firstOpen ? (
        <DataDisclosureModal
          firstOpen={firstOpen}
          handelSetFirstOpen={handelSetFirstOpen}
        />
      ) : (
        <>
          <Stack.Navigator
            initialRouteName="Bottom"
            screenOptions={{
              header: ({navigation, route, options}) => {
                return (
                  <HeaderBottomNavigation
                    navigation={navigation}
                    title={
                      options.headerTitle ? options?.headerTitle : route.name
                    }
                    style={options.headerStyle}
                  />
                );
              },
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.light,
              // headerTitleStyle: {
              //   fontWeight: 'bold',
              // },
              headerRight: () => (
                <TouchableOpacity
                  style={{
                    padding: 5,
                    backgroundColor: colors.blackrgba,
                    borderRadius: 25,
                  }}>
                  <Feather name="user" size={30} color={colors.lighter} />
                </TouchableOpacity>
              ),
            }}>
            <Stack.Screen
              name="Bottom"
              component={BottomTabNavigation}
              options={{
                headerShown: false,
                headerTitle: 'Accueil',
                title: 'Accueil',
              }}
            />
            <Stack.Screen
              name="Account"
              component={AccountStackNavigation}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="AdminChurchDrawerNavigation"
              component={AdminChurchDrawerNavigation}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="HomeChurch"
              component={HomeChurchScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="BibleStudys"
              component={BibleStudysScreen}
              options={{
                headerTitle: 'Études bibliques',
              }}
            />

            <Stack.Screen
              name="QuizScreen"
              component={QuizScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="QuizDetailScreen"
              component={QuizDetailScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ScoreHistoryScreen"
              component={ScoreHistoryScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="VideosPlayer"
              component={VideosPlayerScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AudiosPlayer"
              component={AudiosPlayerScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="BooksPlayer"
              component={BooksPlayerScreen}
              options={{}}
            />
            <Stack.Screen
              name="ImagesViewer"
              component={ImagesPlayerScreen}
              options={({route}: {route: any}) => ({
                // headerShown: false
                headerTitle: route.params?.images.eglise.nom_eglise,
              })}
            />
            <Stack.Screen
              name="ImagesGalleryViewer"
              component={ImagesGalleryPlayerScreen}
              options={({route}: {route: any}) => ({
                headerShown: false,
              })}
            />
            <Stack.Screen
              name="AnnonceEventScreen"
              component={AnnonceEventScreen}
              options={({route}: {route: any}) => ({
                headerShown: false,
              })}
            />
            <Stack.Screen
              name="AnnonceEventPaymentScreen"
              component={AnnonceEventPaymentScreen}
              options={({route}: {route: any}) => ({
                headerShown: false,
              })}
            />

            <Stack.Screen
              name="ForumSubject"
              component={ForumSubjectScreen}
              options={({route}: {route: any}) => ({
                headerTitle: route.params?.forum.title,
              })}
            />
            <Stack.Screen
              name="ForumParticipation"
              component={ForumParticipationScreen}
              options={{
                headerTitle: 'Participation...',
              }}
            />

            <Stack.Screen
              name="BibleStudyContent"
              component={BibleStudyContentScreen}
              options={({route}: {route: any}) => {
                return {
                  headerTitle: route?.params?.bibleStudy.titre,
                };
              }}
            />
            <Stack.Screen
              name="BibleStudyVideosPlayer"
              component={BibleStudyVideosPlayerScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="BiblePanoramaNewScreen"
              component={BiblePanoramaNewScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="BiblePanoramaLastScreen"
              component={BiblePanoramaLastScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ChurchList"
              component={ChurchListScreen}
              options={{
                headerTitle: 'Églises',
                title: 'Églises',
              }}
            />
            <Stack.Screen
              name="ChurchDetail"
              component={ChurchDetailScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Programmes"
              component={ProgrammesScreen}
              options={{
                headerTitle: 'Programmes',
                title: 'Programmes',
              }}
            />
            <Stack.Screen
              name="Communiques"
              component={CommuniquesScreen}
              options={{
                headerTitle: 'Communiques',
                title: 'Communiques',
              }}
            />
            <Stack.Screen
              name="PostPonne"
              component={PostPonneScreen}
              options={{
                headerTitle: 'Rendez-vous',
                title: 'Rendez-vous',
              }}
            />
            <Stack.Screen
              name="PostPonneCreate"
              component={PostPonneCreateScreen}
              options={{
                headerTitle: 'Rendez-vous',
                title: 'Rendez-vous',
              }}
            />
            <Stack.Screen
              name="TestimonialsUpload"
              component={TestimonialsUploadScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Témoignages',
                // title: 'Témoignages'
              }}
            />
            <Stack.Screen
              name="TestimonialsPublish"
              component={TestimonialsPublishScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Témoignages',
                // title: 'Témoignages'
              }}
            />
            <Stack.Screen
              name="TestimonialDetail"
              component={TestimonialDetailScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Témoignages',
                // title: 'Témoignages'
              }}
            />
            <Stack.Screen
              name="MediaPage"
              component={MediaPage}
              options={{
                headerShown: false,
                // headerTitle: 'Témoignages',
                // title: 'Témoignages'
              }}
            />

            <Stack.Screen
              name="TestimonialsHandler"
              component={TestimonialsHandlerScreen}
              options={{
                headerTitle: 'Témoignages',
                title: 'Témoignages',
              }}
            />
            <Stack.Screen
              name="TestimonialsMontangeVideo"
              component={TestimonialsMontangeVideoScreen}
              options={{
                headerTitle: 'Témoignages',
                title: 'Témoignages',
              }}
            />
            <Stack.Screen
              name="Notification"
              component={NotificationsScreen}
              options={{
                headerTitle: 'Notification',
                title: 'Notification',
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerTitle: 'Paramètres',
                title: 'Paramètres',
              }}
            />
            <Stack.Screen
              name="PrivacyAppScreen"
              component={PrivacyAppScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Paramètres',
                // title: 'Paramètres'
              }}
            />

            {/* bible */}
            <Stack.Screen
              name="BibleSelectScreen"
              component={BibleSelectScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Paramètres',
                // title: 'Paramètres'
              }}
            />
            <Stack.Screen
              name="BibleViewer"
              component={BibleViewer}
              options={{
                headerShown: false,
                // headerTitle: 'Paramètres',
                // title: 'Paramètres'
              }}
            />
            <Stack.Screen
              name="HomeBible"
              component={BibleHomeScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Paramètres',
                // title: 'Paramètres'
              }}
            />
            <Stack.Screen
              name="VersetDay"
              component={VersetDayScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Paramètres',
                // title: 'Paramètres'
              }}
            />
            <Stack.Screen
              name="VersionSelectorScreen"
              component={VersionSelectorScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Paramètres',
                // title: 'Paramètres'
              }}
            />

            <Stack.Screen
              name="ImageBibleSelectorScreen"
              component={ImageBibleSelectorScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="CreateImageVerseBibleScreen"
              component={CreateImageVerseBibleScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="CreateNoteVerseBibleScreen"
              component={CreateNoteVerseBibleScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="BibleNoteListScreen"
              component={BibleNoteListScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ReadingPlansScreen"
              component={ReadingPlansScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ReadingPlanDetailScreen"
              component={ReadingPlanDetailScreen}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ReadingPlansBycategoryScreen"
              component={ReadingPlansBycategoryScreen}
              options={({route}) => ({
                headerTitle: capitalize(route?.params?.category),
                header: undefined,
                headerRight: undefined,
                //  ({ navigation, route, options }) => {

                //   return <View
                //     style={{
                //       justifyContent: 'center',
                //       backgroundColor: backgroundStyle.backgroundColor,
                //       height: 70,
                //       paddingHorizontal: 10,
                //       paddingVertical: 10
                //     }}
                //   >
                //     <TouchableOpacity></TouchableOpacity>
                //     <Text>{capitalize(route?.params?.category)}</Text>
                //   </View>
                // },
              })}
            />

            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Paramètres',
                // title: 'Paramètres'
              }}
            />
            <Stack.Screen
              name="PickerFileScreen"
              component={PickerFileScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Paramètres',
                // title: 'Paramètres'
              }}
            />

            <Stack.Screen
              name="SondageScreen"
              component={SondageScreen}
              options={{
                // headerShown: false,
                headerTitle: 'Sondage',
                // title: 'Paramètres'
              }}
            />
            <Stack.Screen
              name="SondageAnwseredScreen"
              component={SondageAnwseredScreen}
              options={{
                // headerShown: false,
                headerTitle: 'Participation au sondage',
                // title: 'Paramètres'
              }}
            />

            <Stack.Screen
              name="EventScreen"
              component={EventScreen}
              options={{
                // headerShown: false,
                headerTitle: 'Événement',
                // title: 'Paramètres'
              }}
            />

            <Stack.Screen
              name="QuestionSuggestionScreen"
              component={QuestionSuggestionScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Événement',
                // title: 'Paramètres'
              }}
            />

            {/* Historique */}
            <Stack.Screen
              name="HistoricalAudiosScreen"
              component={historicalAudiosScreen}
              options={{
                headerShown: false,
                // headerTitle: 'Événement',
                // title: 'Paramètres'
              }}

              //Historique
            />
          </Stack.Navigator>
        </>
      )}
    </>
  );
}

export default StackNavigationApp;
