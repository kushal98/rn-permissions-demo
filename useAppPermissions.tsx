import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AppState, Text, View, Button, StyleSheet} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {
  Permission,
  PermissionStatus,
  RESULTS,
  openSettings,
  requestMultiple,
} from 'react-native-permissions';

interface AppPermissionProps {
  permissions: Array<Permission>;
}

type PermissionStatusObjType = Record<Permission, PermissionStatus>;

interface AppPermissionReturnType {
  permissionStatus: PermissionStatusObjType;
  handlePermissionsCheck: () => void;
  PermissionRequestDialog: any;
  shouldShowPermissionDialog: () => boolean;
  checkingPermission: boolean;
}

// this is for taking permissions mandatorily
const useAppPermissions = (
  props: AppPermissionProps,
): AppPermissionReturnType => {
  const {permissions} = props;
  const askingForPermission = useRef(false);
  const appState = useRef(AppState.currentState);

  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatusObjType>(
      permissions.reduce((prevPermissions, currentPermission) => {
        return {
          ...prevPermissions,
          [currentPermission]: RESULTS.UNAVAILABLE,
        };
      }, {} as PermissionStatusObjType),
    );

  const handlePermissionsCheck = useCallback(async () => {
    // Will remove logs after testing
    if (permissions.length > 0) {
      askingForPermission.current = true;
      const requestStatuses = await requestMultiple(permissions);
      console.log(
        '🚀 ~ file: useAppPermissions.tsx ~ line 50 ~ handlePermissionsCheck ~ requestStatuses',
        requestStatuses,
      );
      setPermissionStatus(requestStatuses);
      askingForPermission.current = false;
    }
  }, [permissions]);

  // for app state change
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // to avoid calling in case the app is already requesting permission
        if (!askingForPermission.current) {
          handlePermissionsCheck();
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [handlePermissionsCheck]);

  // for screen focus
  useFocusEffect(
    useCallback(() => {
      console.log('Screen was focused');
      handlePermissionsCheck();
      return () => {
        console.log('Screen was unfocused');
        askingForPermission.current = false;
        // Useful for cleanup functions
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const openPermissionSetting = async () => {
    openSettings().catch(() => console.warn('cannot open settings'));
  };

  const isAnyPermissionWithStatus = (status: PermissionStatus) => {
    let hasStatusWithPermission: boolean = false;
    permissions.forEach((permission: Permission) => {
      if (permission && permissionStatus[permission] === status) {
        hasStatusWithPermission = true;
      }
    });

    return hasStatusWithPermission;
  };

  const PermissionRequestDialog = () => {
    const styles = useStyles;
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.titleStyle}>
            {'Please Give the required permission'}
          </Text>
        </View>
        <View style={styles.contentView}>
          <Text style={styles.permissionContent}>{getPermissionSubText()}</Text>
        </View>
        <View style={styles.btnView}>
          <Button title={'Give Permission'} onPress={openPermissionSetting} />
        </View>
      </View>
    );
  };

  const shouldShowPermissionDialog = () => {
    return (
      isAnyPermissionWithStatus(RESULTS.BLOCKED) ||
      isAnyPermissionWithStatus(RESULTS.DENIED) ||
      isAnyPermissionWithStatus(RESULTS.UNAVAILABLE)
    );
  };

  const getPermissionSubText = () => {
    let subText = 'Please give ';
    let blockedPermissions = permissions.map((permission: Permission) => {
      if (
        permissionStatus[permission] === RESULTS.BLOCKED ||
        permissionStatus[permission] === RESULTS.DENIED
      ) {
        let permissionText = permission.split('.')[2];
        return permissionText.replace(/_/g, ' ');
      }
      return null;
    });

    blockedPermissions = blockedPermissions.filter(
      permission => permission !== null,
    );
    subText =
      subText + blockedPermissions.join(', ').toLowerCase() + ' permissions ';
    return subText;
  };

  return {
    permissionStatus,
    handlePermissionsCheck,
    PermissionRequestDialog,
    shouldShowPermissionDialog,
  };
};

const useStyles = StyleSheet.create({
  permissionContent: {
    fontSize: 14,
    color: '#000',
  },
  btnView: {
    width: '100%',
  },
  titleStyle: {
    fontSize: 18,
    color: '#000',
  },
  titleView: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  contentView: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  container: {
    flex: 1,
  },
});

export default useAppPermissions;
