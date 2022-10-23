import {StyleSheet, Text, Platform, ActivityIndicator} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PERMISSIONS} from 'react-native-permissions';

import useAppPermissions from '../useAppPermissions';
export default function PermissionScreen() {
  const {PermissionRequestDialog, shouldShowPermissionDialog} =
    useAppPermissions({
      permissions:
        Platform.OS === 'ios'
          ? [
              PERMISSIONS.IOS.CAMERA,
              PERMISSIONS.IOS.CONTACTS,
              PERMISSIONS.IOS.MEDIA_LIBRARY,
            ]
          : [
              PERMISSIONS.ANDROID.READ_CONTACTS,
              PERMISSIONS.ANDROID.CAMERA,
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
              PERMISSIONS.ANDROID.READ_PHONE_STATE,
            ],
    });

  return (
    <SafeAreaView style={styles.container}>
      {shouldShowPermissionDialog() ? (
        <PermissionRequestDialog />
      ) : (
        <Text>Permission</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
