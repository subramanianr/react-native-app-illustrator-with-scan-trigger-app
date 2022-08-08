# React Native Honeywell Scanner SDK With Soft Trigger

> **This package is using honeywell react native module built from [Source](https://github.com/subramanianr/react-native-honeywell-scanner-soft-trigger)

This package works with Honeywell devices that have an integrated barcode scanner, like the Honeywell Dolphin CT40. This package was fully tested with a CT40, since the SDK is not specific to the CT40 other devices will likely work as well but this is not guaranteed.

## Prerequisites

To install the dependencies:

```
npm install
```

Ensure that the sdk.dir path is set up in the system environment variable or add local.properties inside android directory and add the below

```
sdk.dir=<Path>/Android/sdk
```

## Usage

First you'll want to check whether the device is a Honeywell scanner:

```js
import HoneywellScanner from 'react-native-honeywell-scanner-trigger';

HoneywellScanner.isCompatible // true or false
```

The barcode reader needs to be "claimed" by your application; meanwhile no other application can use it. You can do that like this:

```js
useEffect(() => {
    if (isCompatible) {
      HoneywellScanner.startReader().then(claimed => {
        console.log(
          deviceClaimed
            ? 'Barcode reader is claimed'
            : 'Barcode reader is busy',
        );
        HoneywellScanner.onBarcodeReadSuccess(event => {
          console.log('Received data', event.propogated);
        });

        HoneywellScanner.onBarcodeReadFail(event => {
          console.log('Barcode read failed');
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
  }, [isCompatible]);
```

To free the claim and stop the reader, also freeing up resources:

```js
HoneywellScanner.stopReader().then(() => {
    console.log('Freedom!');
});
```

To get events from the barcode scanner:

```js
HoneywellScanner.onBarcodeReadSuccess(event => {
    console.log('Received data', event);
});

HoneywellScanner.onBarcodeReadFail(event => {
    console.log('Barcode read failed');
});
```

To stop receiving events:

```js
HoneywellScanner.offBarcodeReadSuccess();
HoneywellScanner.offBarcodeReadFail();
```

Soft Trigger handling via Scan button
```js
HoneywellScanner.softwareTriggerStart((error, name) => {
      setApiErrorMessage(error != null ? error : name);
    });
setTimeout(() => {
      HoneywellScanner.softwareTriggerStop((error, name) => {
        setApiErrorMessage(error != null ? error : name);
      });
}, 2000);
```

## Build

### Running with emulator

```
npx react-native start
npx react-native run-android
```

### Building APK

```
cd {rootDir}/android
./gradlew clean assembleRelease (For Release)
./gradlew clean assembleDebug (For Debug)
```

### APK Directory

```
cd {rootDir}/android/app/build/outputs/apk/release (For Release)
cd {rootDir}/android/app/build/outputs/apk/debug (For Debug)
```
