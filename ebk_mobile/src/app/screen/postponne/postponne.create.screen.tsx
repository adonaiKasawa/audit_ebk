import {jwtDecode} from 'jwt-decode';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Text,
  TextInput,
  View,
  useColorScheme,
  Button,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import colors from '../../../components/style/colors';
import {
  PayloadUserInterface,
  CommuniquesPaginated,
} from '../../config/interface';
import {selectAuth} from '../../store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {capitalize} from '../../config/func';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {
  createAppointmentApi,
  findDayApi,
} from '../../api/appointment/appoint.req';
import LoadingGif from '../../../components/loading/loadingGif';

export default function PostPonneCreateScreen() {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<PayloadUserInterface | undefined>(
    userDecode,
  );
  const [days, setDay] = useState([
    {day: 'Dimanche', activate: false},
    {day: 'Lundi', activate: false},
    {day: 'Mardi', activate: false},
    {day: 'Mercredi', activate: false},
    {day: 'Jeudi', activate: false},
    {day: 'Vendredi', activate: false},
    {day: 'Samedi', activate: false},
  ]);
  const [date, setDate] = useState(new Date());
  const [motif, setMotif] = useState<string>('');

  const [mode, setMode] = useState<any | undefined>('date');
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const handelFindDayForPostPone = useCallback(async () => {
    if (user && user.eglise) {
      const find = await findDayApi();
      if (find?.status === 200) {
        const updatedDays = days.map(dayObj => {
          // Vérifie si le jour est présent dans find.data
          const foundDay = find.data.find(
            (dataDay: any) =>
              dataDay.jour.toLowerCase() === dayObj.day.toLowerCase(),
          );

          // Si le jour est trouvé, activez la propriété activate à true
          if (foundDay) {
            return {...dayObj, activate: true};
          }

          // Sinon, retournez l'objet jour sans modification
          return dayObj;
        });

        // Mettez à jour l'état avec les jours mis à jour
        setDay(updatedDays);
      }
    }
  }, [days, user, findDayApi]);

  const handelCreatePostePone = useCallback(async () => {
    const findDay = days.find(
      dataDay =>
        dataDay.day.toLowerCase() ===
          moment(date).format('dddd').toLowerCase() &&
        dataDay.activate === true,
    );
    if (findDay) {
      if (motif !== '') {
        setLoading(true);
        const create = await createAppointmentApi({
          date: date.toString(),
          motif,
        });
        setLoading(false);
        if (create?.status === 201) {
          Alert.alert(
            'Réservation réussie.',
            "Félicitations! Votre réservation pour le rendez-vous a bien été enregistrée avec succès et est actuellement en attente d'approbation.",
          );
        } else {
          if (typeof create?.data === 'string') {
            Alert.alert(create?.data);
          } else {
            let msg = '';
            create?.data.map((item: string) => (msg += `${item} \n`));
            Alert.alert(msg);
          }
        }
      } else {
        Alert.alert(
          'Motif obligatoire',
          "Veuillez compléter le champ 'Motif' dans le formulaire de réservation",
        );
      }
    } else {
      Alert.alert(
        'Erreur de disponibilité',
        'Vous devriez choisir une date dont le jour correspond aux jours marqués en vert pour assurer la disponibilité.',
      );
    }
  }, [days, date, motif]);

  useEffect(() => {
    handelFindDayForPostPone();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 100}>
      <ScrollView
        style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
        <Text
          style={{
            color: isDarkMode ? colors.white : colors.black,
            textAlign: 'center',
            paddingHorizontal: 10,
          }}>
          Je suis disponible pour un rendez-vous les jours marqués en vert.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: 20,
            gap: 20,
            marginTop: 10,
          }}>
          {days.map(({day, activate}, i) => {
            return (
              <DayOfPostPoneItem
                key={i.toString()}
                day={day}
                activate={activate}
              />
            );
          })}
        </View>

        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            gap: 15,
            paddingHorizontal: 10,
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: isDarkMode ? colors.secondary : colors.light,
              borderRadius: 16,
            }}>
            <TouchableOpacity style={{padding: 20}} onPress={showDatepicker}>
              <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
                {capitalize(moment(date).format('dddd'))} le{' '}
                {moment(date).format('DD/MM/YYYY')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 20}} onPress={showTimepicker}>
              <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
                Heure: {moment(date).format('HH:MM')}
              </Text>
            </TouchableOpacity>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
              minimumDate={new Date()}
            />
          )}

          <TextInput
            multiline={true}
            numberOfLines={6}
            style={{
              padding: 20,
              height: 200,
              backgroundColor: isDarkMode ? colors.secondary : colors.light,
              borderRadius: 16,
              color: isDarkMode ? colors.white : colors.primary,
            }}
            placeholder="Motif"
            placeholderTextColor={colors.gris}
            value={motif}
            onChangeText={setMotif}
          />

          <TouchableOpacity
            disabled={loading}
            onPress={handelCreatePostePone}
            style={{
              backgroundColor: isDarkMode ? colors.white : colors.secondary,
              borderRadius: 16,
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {loading ? (
              <LoadingGif width={30} height={30} />
            ) : (
              <Text
                style={{
                  color: isDarkMode ? colors.primary : colors.white,
                  textAlign: 'center',
                  fontSize: 17,
                  fontWeight: '500',
                }}>
                Réserver
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const DayOfPostPoneItem = ({
  activate,
  day,
}: {
  activate: boolean;
  day: string;
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  return (
    <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 5,
          backgroundColor: activate ? '#26F714' : '#FB0202',
        }}
      />
      <Text style={{color: isDarkMode ? colors.white : colors.black}}>
        {capitalize(day)}
      </Text>
    </View>
  );
};
