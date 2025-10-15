import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeImagesScreen from '../../screen/home/images/home.images.screen';
import HomeAudiosScreen from '../../screen/home/audios/home.audios.screen';
import HomeBooksScreen from '../../screen/home/books/home.books.screen';
import AccountSignInScreen from '../../screen/setting/account/account.signIn.screen';
import AccountSignUpScreen from '../../screen/setting/account/account.signUp.screen';
import AccountForgotPasswordScreen from '../../screen/setting/account/account.forgotPassword.screen';
import AccountForgotPasswordUpdatedScreen from '../../screen/setting/account/account.forgotPasswordUpdated.screen';
import AccountConfirmEmailScreen from '../../screen/setting/account/account.confirmEmail.screen';
import AccountConfirmPhoneNumberScreen from '../../screen/setting/account/account.confirmPhoneNumber.screen';
import {useColorScheme, View} from 'react-native';
import AccountScreen from '../../screen/setting/account/account.screen';
import AccountPhoneScreen from '../../screen/setting/account/account.phone.screen';
import AccountEmailScreen from '../../screen/setting/account/account.email.screen';
import AccountDeletedScreen from '../../screen/setting/account/account.deleted.screen';
import colors from '../../../components/style/colors';

const Stack = createNativeStackNavigator();

function AccountStackNavigation() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  return (
    <Stack.Navigator
      initialRouteName="signUp"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="signUp"
        component={AccountSignUpScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signIn"
        component={AccountSignInScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="forgotPassword"
        component={AccountForgotPasswordScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgotPasswordUpdated"
        component={AccountForgotPasswordUpdatedScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ConfirmPhoneNumber"
        component={AccountConfirmPhoneNumberScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ConfirmEmail"
        component={AccountConfirmEmailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DeletedAccount"
        component={AccountDeletedScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ProfilAccount"
        component={AccountScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AccountPhone"
        component={AccountPhoneScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AccountEmail"
        component={AccountEmailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default AccountStackNavigation;
