import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  Code,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {ManagementEvent} from '../../../../config/interface';

export default function EventScannerQrCode({navigation, route}: any) {
  const event: ManagementEvent = route.params?.event;
  const [code, setCode] = useState<string>('');
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'qr'],
    onCodeScanned: codes => {
      handleScannedQrCode(codes);
    },
  });

  const handleScannedQrCode = (codes: Code[]) => {
    console.log(`Scanned ${codes.length} codes!`);
    console.log(`Scanned ${codes[0].value}`);
    console.log(`Scanned type ${codes[0].type}`);
    setCode(codes[0].value || '');
  };

  if (device == null) return <NoCameraErrorView />;
  return (
    <View style={{flex: 1}}>
      <Camera
        style={{flex: 2}}
        codeScanner={codeScanner}
        device={device}
        isActive={true}
      />
      <View style={{flex: 1}}>
        <Text>{code}</Text>
      </View>
    </View>
  );
}

function NoCameraErrorView() {
  return (
    <View>
      <Text>Verifier votre camera</Text>
    </View>
  );
}
