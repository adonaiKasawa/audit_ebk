/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
// import { ImageGallery } from '@georstat/react-native-image-gallery';
import * as React from 'react';
import {Text, View, useWindowDimensions, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import {ItemAnnonces} from '../../../config/interface';
import {findAnnoncePaginated} from '../../../api/annonce/annonce.req';
import colors from '../../../../components/style/colors';
import LoadingGif from '../../../../components/loading/loadingGif';
import {file_url} from '../../../api';
import FastImage from 'react-native-fast-image';

function HomeAnnoncesScreen({navigation}: any) {
  const Dimensions = useWindowDimensions();
  const width = Dimensions.width;
  const [annonce, setAnnonces] = React.useState<ItemAnnonces[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [crtIndex, setCrtIndex] = React.useState<number>(0);
  const handleGetAllAnnonces = async () => {
    setLoading(true);
    const find = await findAnnoncePaginated();
    setLoading(false);
    console.log(find);

    if (find?.data) {
      setAnnonces(find?.data.items);
    }
  };

  const handleGotoPlayer = (annonce: ItemAnnonces): void => {
    navigation.navigate('AnnonceEventScreen', {
      annonce: annonce,
    });
  };

  React.useEffect(() => {
    let isMount = true;
    if (isMount) {
      handleGetAllAnnonces();
    }
    return () => {
      isMount = false;
    };
  }, []);
  return (
    <View>
      {annonce?.length > 0 ? (
        <View>
          <Carousel
            loop
            width={width}
            height={width / 1.5}
            autoPlay={true}
            mode={'parallax'}
            pagingEnabled={true}
            data={annonce}
            scrollAnimationDuration={5000}
            onSnapToItem={index => setCrtIndex(index)}
            // getCurrentIndex={() => {} }
            renderItem={({item, index}) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  handleGotoPlayer(item);
                }}>
                <>
                  <FastImage
                    source={{
                      uri: `${file_url}${annonce[index].contente}`,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable, // ou web selon ton serveur
                    }}
                    // resizeMode={'cover'}
                    resizeMode={FastImage.resizeMode.cover}
                    style={{
                      width: '100%',
                      height: width / 1.5,
                      borderRadius: 25,
                    }}
                  />
                  {/* <ImageGallery close={closeGallery} isOpen={isOpen} images={[{
                  id: index,
                  url: `https://d31uetu06bkcms.cloudfront.net/${annonce[crtIndex].contente}`
                }]} /> */}
                </>
              </TouchableOpacity>
            )}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 50,
              flexDirection: 'row',
            }}>
            {annonce.map((e, i) => {
              return (
                <View
                  style={{
                    backgroundColor:
                      i === crtIndex ? colors.white : colors.primary,
                    width: 5,
                    height: 5,
                    marginHorizontal: 1,
                    borderRadius: 5,
                  }}
                />
              );
            })}
          </View>
        </View>
      ) : loading ? (
        <View
          style={{
            width: '90%',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderRadius: 15,
            marginTop: 2,
          }}>
          <LoadingGif width={50} height={50} />
        </View>
      ) : (
        <LinearGradient
          colors={[colors.light, colors.gris]}
          start={{x: 0.5, y: 0}}
          end={{x: 1, y: 1}}
          style={{
            width: '90%',
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderRadius: 15,
            marginTop: 2,
          }}>
          <Text style={{color: colors.primary, fontSize: 20}}>
            EcclesiaBook
          </Text>
        </LinearGradient>
      )}
    </View>
  );
}

export default HomeAnnoncesScreen;
