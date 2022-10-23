import {Platform, Text, View} from 'react-native';
import React from 'react';
import useAppPermissions from './useAppPermissions';
import {PERMISSIONS} from 'react-native-permissions';

export default function Permission() {
  const {
    permissionStatus,
    // handlePermissionsCheck,
    PermissionRequestDialog,
    shouldShowPermissionDialog,
  } = useAppPermissions({
    permissions:
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.CAMERA]
        : [
            PERMISSIONS.ANDROID.READ_CONTACTS,
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            PERMISSIONS.ANDROID.READ_PHONE_STATE,
          ],
  });

  console.log('permissionStatus ---------> ', permissionStatus);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {shouldShowPermissionDialog() ? (
        <PermissionRequestDialog />
      ) : (
        <Text>Permission</Text>
      )}
    </View>
  );
}
