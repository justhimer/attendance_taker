import { patchAttendance } from '@/apis/attendanceAPI';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QRCodeData } from './show_qr';
import { getAttendEvent } from '@/apis/eventAPI';

export default function ScanQR() {
  const { event_id, myAttendanceId }: any = useLocalSearchParams();
  // const [latestQRUUID, setLatestQRUUID] = useState('none');
  
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  async function checkIfQRCodeValid(qrCodeData: QRCodeData) {
    const eventData = await getAttendEvent(event_id);
    const uuid = eventData.qr_uuid;
    // console.log('uuid', uuid);
    // console.log('qrCodeData.uuid', qrCodeData.uuid);
    return qrCodeData.uuid === uuid;
  }

  async function patchMyAttendance() {
    await patchAttendance(myAttendanceId, { attend_time: new Date() });
  }

  async function onQRCodeReceived(data: QRCodeData) {
    const isValid = await checkIfQRCodeValid(data);
    if (isValid) {
      await patchMyAttendance();
      Alert.alert('Attendance Success', 'You have successfully attended the event');
      router.replace('(tabs)/events/event_list');
    }
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera}
        barcodeScannerSettings={{
            barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={async (scannedData: BarcodeScanningResult) => {
            const { type, data } = scannedData;
            const qrCodeData: QRCodeData = JSON.parse(data);
            await onQRCodeReceived(qrCodeData);
        }}
      >
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity> */}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});