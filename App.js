/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import HoneywellScanner from 'react-native-honeywell-scanner-trigger';
import type {Node} from 'react';
import {StyleSheet, Text, View, Pressable, FlatList, Alert} from 'react-native';

const App: () => Node = () => {
  const [apiError, setApiError] = React.useState(false);
  const [apiErrorMessage, setApiErrorMessage] = React.useState('');
  const [scans, setScans] = React.useState([]);
  let isCompatible = HoneywellScanner.isCompatible;
  const defaultLabel = 'Honeywell Compatibility Check Passed: ';
  let deviceClaimed;

  console.log('Starting the App with scan count ', scans.length);

  function setDataAndIgnoreDuplicates(event) {
    console.log('Received data', event.data);
    console.log('Printing Existing Scanned Items');
    scans.forEach(item => console.log(item));
    if (scans.length >= 1) {
      let duplicate = scans.filter(function (item) {
        return item.data === event.data;
      }).length;
      if (duplicate > 0) {
        Alert.alert('Duplicate Code detected ', event.data, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('Ok Pressed')},
        ]);
        setApiError(true);
        setApiErrorMessage('Detected duplicate barcode ' + event.data);
        setTimeout(() => {
          setApiErrorMessage('');
          setApiError(false);
        }, 3000);
        return;
      }
    }
    // eslint-disable-next-line no-shadow
    setScans(scans => [
      {
        data: event.data,
        decoder: event.symbology,
        timeStamp: event.timeStamp,
      },
      ...scans,
    ]);
  }

  useEffect(() => {
    if (isCompatible) {
      HoneywellScanner.startReader().then(claimed => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        deviceClaimed = claimed;
        console.log(
          deviceClaimed
            ? 'Barcode reader is claimed'
            : 'Barcode reader is busy',
        );
        HoneywellScanner.onBarcodeReadSuccess(event => {
          setDataAndIgnoreDuplicates(event);
        });

        HoneywellScanner.onBarcodeReadFail(event => {
          console.log('Barcode read failed');
          setApiErrorMessage('Barcode read failed ' + event.data);
          setApiError(true);
          setTimeout(() => {
            setApiErrorMessage('');
            setApiError(false);
          }, 3000);
        });
      });

      return () => {
        HoneywellScanner.stopReader().then(() => {
          console.log('Stop Reader!!');
          HoneywellScanner.offBarcodeReadSuccess();
          HoneywellScanner.offBarcodeReadFail();
        });
      };
    }
  }, [isCompatible, scans]);

  function _onPressClearScanButton() {
    console.log('Inside Clear Scan Button call');
    setScans([]);
    //scans.splice(0, scans.length);
  }

  function _onPressScanButton() {
    console.log('Inside Scan Button call ', scans.length);
    HoneywellScanner.softwareTriggerStart((error, name) => {
      console.log('Trigger start details ', name, ' ', error);
    });
    setTimeout(() => {
      HoneywellScanner.softwareTriggerStop((error, name) => {
        console.log('Trigger stop details ', name, ' ', error);
      });
    }, 2000);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Scan Single Barcode</Text>
      {apiError && (
        <View
          style={{
            backgroundColor: 'red',
            height: 50,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}>
            {apiErrorMessage}
          </Text>
        </View>
      )}
      <Text style={styles.itemHeading}>Barcodes:</Text>

      <FlatList
        data={scans}
        keyExtractor={item => item.timeStamp}
        ListEmptyComponent={() => (
          <Text style={styles.itemText}>
            {defaultLabel} {isCompatible.toString()}
          </Text>
        )}
        renderItem={({item}) => (
          <View
            style={{
              backgroundColor: '#0077A0',
              //backgroundColor: item.duplicate ? 'red' : '#0077A0',
              margin: 10,
              borderRadius: 5,
              flex: 1,
            }}>
            <Text style={styles.scanDataHead}>{item.decoder}</Text>
            <Text style={styles.scanData}>{item.data}</Text>
            <Text style={styles.scanDataHead}>{item.timeStamp}</Text>
          </View>
        )}
      />
      <View
        style={{
          padding: 10,
        }}>
        <View
          style={{
            marginBottom: 10,
          }}>
          <Pressable
            style={{
              backgroundColor: '#04D4FF',
              height: 50,
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={() => {
              _onPressScanButton();
            }}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}>
              Scan
            </Text>
          </Pressable>
        </View>
        <View
          style={{
            marginBottom: 10,
          }}>
          <Pressable
            style={{
              backgroundColor: '#04D4FF',
              height: 50,
              justifyContent: 'center',
              borderRadius: 5,
            }}
            onPress={() => {
              _onPressClearScanButton();
            }}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}>
              Clear Scan
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //    justifyContent: 'center',
    //    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  h1: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  itemHeading: {
    fontSize: 12,
    textAlign: 'left',
    left: 10,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 12,
    textAlign: 'left',
    margin: 10,
  },
  itemTextAttention: {
    fontSize: 12,
    textAlign: 'left',
    margin: 10,
    backgroundColor: '#ffd200',
  },
  scanDataHead: {
    fontSize: 12,
    margin: 2,
    fontWeight: 'bold',

    //color: 'white',
  },
  scanDataHeadRight: {
    fontSize: 10,
    margin: 2,
    textAlign: 'right',
    fontWeight: 'bold',
    color: 'white',
  },
  scanData: {
    fontSize: 16,
    fontWeight: 'bold',

    margin: 2,
    color: 'black',
  },
  inputLabels: {
    fontSize: 16,
  },
  input: {
    height: 56,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 3,
  },
});

export default App;
