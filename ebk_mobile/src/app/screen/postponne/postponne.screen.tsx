import React from 'react';
import {jwtDecode} from 'jwt-decode';
import {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../../components/style/colors';
import {
  PayloadUserInterface,
  CommuniquesPaginated,
  Appointment,
} from '../../config/interface';
import {selectAuth} from '../../store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  cancelAppointmentApi,
  findAppointmentByUserApi,
} from '../../api/appointment/appoint.req';
import moment from 'moment';
import {ConfirmAppointmentEnum} from '../../config/enum';
import {capitalize} from '../../config/func';
import LoadingGif from '../../../components/loading/loadingGif';

export default function PostPonneScreen({navigation}: {navigation: any}) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<PayloadUserInterface | undefined>(
    userDecode,
  );
  const [appointments, setAppointments] = useState<Appointment[]>();
  const [step, setStep] = useState<ConfirmAppointmentEnum>(
    ConfirmAppointmentEnum.AWAITING,
  );
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handelFindAppointementForUser = useCallback(async () => {
    const find = await findAppointmentByUserApi();
    if (find?.status === 200) {
      setAppointments(find.data);
    }
  }, [appointments, findAppointmentByUserApi]);

  useEffect(() => {
    handelFindAppointementForUser();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          borderBottomColor: colors.gris,
          borderBottomWidth: 1,
          paddingBottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            setStep(ConfirmAppointmentEnum.AWAITING);
          }}
          style={{padding: 10}}>
          <Text
            style={{
              color: isDarkMode
                ? step === ConfirmAppointmentEnum.AWAITING
                  ? colors.white
                  : colors.gris
                : step === ConfirmAppointmentEnum.AWAITING
                ? colors.black
                : colors.gris,
            }}>
            En attente
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStep(ConfirmAppointmentEnum.APPROUVED);
          }}
          style={{padding: 10}}>
          <Text
            style={{
              color: isDarkMode
                ? step === ConfirmAppointmentEnum.APPROUVED
                  ? colors.white
                  : colors.gris
                : step === ConfirmAppointmentEnum.APPROUVED
                ? colors.black
                : colors.gris,
            }}>
            Approuver
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStep(ConfirmAppointmentEnum.POSTPONE);
          }}
          style={{padding: 10}}>
          <Text
            style={{
              color: isDarkMode
                ? step === ConfirmAppointmentEnum.POSTPONE
                  ? colors.white
                  : colors.gris
                : step === ConfirmAppointmentEnum.POSTPONE
                ? colors.black
                : colors.gris,
            }}>
            Reporter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStep(ConfirmAppointmentEnum.CANCEL);
          }}
          style={{padding: 10}}>
          <Text
            style={{
              color: isDarkMode
                ? step === ConfirmAppointmentEnum.CANCEL
                  ? colors.white
                  : colors.gris
                : step === ConfirmAppointmentEnum.CANCEL
                ? colors.black
                : colors.gris,
            }}>
            Annuler
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handelFindAppointementForUser}
          />
        }>
        {appointments?.map(item => {
          if (item.confirm == step) {
            return (
              <PostPonneItemScreen
                handelFindAppointementForUser={handelFindAppointementForUser}
                key={item.id}
                appointment={item}
              />
            );
          }
        })}
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('PostPonneCreate');
        }}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          padding: 15,
          backgroundColor: colors.gris,
          borderRadius: 30,
        }}>
        <Ionicons name="calendar-number" size={30} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const PostPonneItemScreen = ({
  appointment,
  handelFindAppointementForUser,
}: {
  appointment: Appointment;
  handelFindAppointementForUser: () => void;
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteAppointment = async () => {
    setLoading(true);
    const req = await cancelAppointmentApi(appointment.id);
    setLoading(false);
    if (req?.status === 200) {
      handelFindAppointementForUser();
    } else {
      if (typeof req?.data === 'string') {
        Alert.alert(req?.data);
      } else {
        let msg = '';
        req?.data.map((item: string) => (msg += `${item} \n`));
        Alert.alert(msg);
      }
    }
  };

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: isDarkMode ? colors.secondary : colors.light,
        margin: 10,
        borderRadius: 12,
        gap: 10,
      }}>
      <Text style={{color: isDarkMode ? colors.white : colors.black}}>
        {capitalize(moment(appointment.requestDate).format('dddd'))}{' '}
        {moment(
          appointment.confirm === ConfirmAppointmentEnum.POSTPONE
            ? appointment.postponeDate
            : appointment.requestDate,
        ).format('DD-MM-YYYY')}
      </Text>
      <Text style={{color: colors.gris}}>{appointment.motif}</Text>
      <View style={{flexDirection: 'row', gap: 15, marginTop: 10}}>
        {appointment.confirm === ConfirmAppointmentEnum.AWAITING ? (
          loading ? (
            <LoadingGif width={30} height={30} />
          ) : (
            <TouchableOpacity
              onPress={handleDeleteAppointment}
              style={{backgroundColor: 'red', padding: 10, borderRadius: 12}}>
              <Text
                style={{fontWeight: '500', fontSize: 15, color: colors.white}}>
                Annuler
              </Text>
            </TouchableOpacity>
          )
        ) : null}

        {/* <TouchableOpacity style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 12 }}>
        <Text style={{ fontWeight: "500", fontSize: 15, color: colors.white }}>Réporter</Text>
      </TouchableOpacity> */}
      </View>
    </View>
  );
};
