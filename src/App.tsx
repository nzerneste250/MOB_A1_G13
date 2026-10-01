import React, { useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

// app logo

const APP_LOGO = require('../assets/musanze-safe-market.png');
const GROUP_CODE = 'MOB-G13-7341';

// navigation

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// app colors

const COLORS = {
  primary: '#2E7D32',
  darkGreen: '#1B5E20',
  leaf: '#81C784',
  background: '#F4F7F2',
  white: '#FFFFFF',
  text: '#263238',
  secondary: '#607D68',
  border: '#D9E4D7',
  lightGreen: '#E8F5E9',
  danger: '#C62828',
  warning: '#EF6C00',
  gray: '#78909C',
};

// market stalls

const MARKET_ITEMS = [
  {
    id: 'A01',
    name: 'Fresh Produce Zone A',
    category: 'Fresh Produce',
    zone: 'Zone A',
    icon: 'leaf-outline',
  },
  {
    id: 'B02',
    name: 'Grains Zone B',
    category: 'Grains',
    zone: 'Zone B',
    icon: 'nutrition-outline',
  },
  {
    id: 'C03',
    name: 'Meat & Poultry Zone C',
    category: 'Meat & Poultry',
    zone: 'Zone C',
    icon: 'restaurant-outline',
  },
  {
    id: 'D04',
    name: 'Dairy Zone D',
    category: 'Dairy',
    zone: 'Zone D',
    icon: 'water-outline',
  },
  {
    id: 'E05',
    name: 'Household Goods Zone E',
    category: 'Household Goods',
    zone: 'Zone E',
    icon: 'basket-outline',
  },
  {
    id: 'F06',
    name: 'Prepared Food Zone F',
    category: 'Prepared Food',
    zone: 'Zone F',
    icon: 'fast-food-outline',
  },
];

// check phone number

function validatePhone(value) {
  const pattern = /^(072|073|078|079)[0-9]{7}$/;

  if (!value) {
    return 'Contact number is required.';
  }

  if (value.length !== 10) {
    return 'Contact number must contain exactly 10 digits.';
  }

  if (!pattern.test(value)) {
    return 'Number must start with 072, 073, 078, or 079.';
  }

  return '';
}

// common components

function AppLogo({ size }) {
  return (
    <Image
      source={APP_LOGO}
      style={{
        width: size || 50,
        height: size || 50,
        resizeMode: 'contain',
      }}
    />
  );
}

function SafeScreen({ children, style }) {
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, style]}
    >
      {children}
    </SafeAreaView>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.sectionSubtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function ErrorText({ children }) {
  if (!children) {
    return null;
  }

  return (
    <Text style={styles.errorText}>
      {children}
    </Text>
  );
}

function RecordCountChip({ count }) {
  let recordText = 'Not recorded';

  if (count === 1) {
    recordText = '1 record';
  }

  if (count > 1) {
    recordText = count + ' records';
  }

  return (
    <View style={styles.recordChip}>
      <View style={styles.recordDot} />

      <Text style={styles.recordChipText}>
        {recordText}
      </Text>
    </View>
  );
}

// market card

function MarketCatalogCard({
  item,
  recordCount,
  selected,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.marketCard,
        selected && styles.marketCardSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.marketCardTop}>
        <View style={styles.marketIconBox}>
          <Ionicons
            name={item.icon}
            size={25}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.marketCardText}>
          <Text style={styles.stallCode}>
            Stall {item.id}
          </Text>

          <Text
            style={styles.marketCardName}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </View>
      </View>

      <RecordCountChip count={recordCount} />

      <View style={styles.marketCardBottom}>
        <Text style={styles.zoneText}>
          {item.zone}
        </Text>

        <Ionicons
          name={selected ? 'chevron-up' : 'chevron-forward'}
          size={20}
          color={COLORS.secondary}
        />
      </View>
    </Pressable>
  );
}

// stall record

function StallVendorRecord({
  record,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.vendorRecord,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.vendorRecordImageBox}>
        {record.photoUri ? (
          <Image
            source={{ uri: record.photoUri }}
            style={styles.vendorThumbnail}
            resizeMethod={
              Platform.OS === 'android'
                ? 'resize'
                : undefined
            }
          />
        ) : (
          <View style={styles.vendorImagePlaceholder}>
            <Ionicons
              name="camera-outline"
              size={28}
              color={COLORS.secondary}
            />
          </View>
        )}
      </View>

      <View style={styles.vendorRecordInfo}>
        <Text style={styles.vendorName}>
          {record.vendorAlias}
        </Text>

        <Text style={styles.vendorMeta}>
          {record.contactNumber}
        </Text>

        <Text style={styles.vendorMeta}>
          {record.date} • {record.time}
        </Text>

        <View style={styles.vendorBottomRow}>
          <View
            style={[
              styles.riskBadge,
              record.riskLevel === 'High' &&
                styles.riskHigh,
              record.riskLevel === 'Medium' &&
                styles.riskMedium,
              record.riskLevel === 'Low' &&
                styles.riskLow,
            ]}
          >
            <Text style={styles.riskBadgeText}>
              {record.riskLevel} Risk
            </Text>
          </View>

          <Text style={styles.photoStatus}>
            {record.photoUri
              ? 'Photo added'
              : 'No photo'}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={COLORS.secondary}
      />
    </Pressable>
  );
}

// stall records

function StallRecordsPanel({
  stall,
  records,
  onClose,
  onNewInspection,
  onRecordPress,
}) {
  const stallRecords = records.filter(function (record) {
    return record.stallCode === stall.id;
  });

  return (
    <View style={styles.stallPanel}>
      <View style={styles.stallPanelHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.stallPanelTitle}>
            {stall.id} Records
          </Text>

          <Text style={styles.stallPanelSubtitle}>
            {stall.category} • {stall.zone}
          </Text>

          <Text style={styles.stallRecordCount}>
            {stallRecords.length}{' '}
            {stallRecords.length === 1
              ? 'vendor'
              : 'vendors'}{' '}
            recorded
          </Text>
        </View>

        <Pressable
          onPress={onClose}
          style={styles.closeButton}
        >
          <Ionicons
            name="close"
            size={22}
            color={COLORS.text}
          />
        </Pressable>
      </View>

      {stallRecords.length === 0 ? (
        <View style={styles.emptyStallBox}>
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name="folder-open-outline"
              size={34}
              color={COLORS.secondary}
            />
          </View>

          <Text style={styles.emptyStallTitle}>
            No record found
          </Text>

          <Text style={styles.emptyStallText}>
            This stall has not been recorded yet.
          </Text>

          <Pressable
            onPress={onNewInspection}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={COLORS.white}
            />

            <Text style={styles.primaryButtonText}>
              Make New Inspection
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.recordsInsidePanel}>
          {stallRecords.map(function (record) {
            return (
              <StallVendorRecord
                key={record.id}
                record={record}
                onPress={function () {
                  onRecordPress(record.id);
                }}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

// home screen

function HomeScreen({
  navigation,
  records,
}) {
  const [search, setSearch] = useState('');
  const [selectedStall, setSelectedStall] = useState(null);

  const filteredItems = useMemo(function () {
    const term = search.trim().toLowerCase();

    if (!term) {
      return MARKET_ITEMS;
    }

    return MARKET_ITEMS.filter(function (item) {
      return (
        item.id.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.zone.toLowerCase().includes(term)
      );
    });
  }, [search]);

  function openRecordDetails(recordId) {
    navigation.navigate('Records', {
      screen: 'Inspection Details',
      params: {
        recordId: recordId,
      },
    });
  }

  function startInspectionForStall(stall) {
    navigation.navigate('New Inspection', {
      stall: stall,
    });
  }

  return (
    <SafeScreen>
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <AppLogo size={52} />

          <View style={styles.brandTextBox}>
            <Text style={styles.appTitle}>
              Musanze Safe Market
            </Text>

            <Text style={styles.appSubtitle}>
              Field Inspection Pilot
            </Text>
          </View>
        </View>

        <View style={styles.groupBadge}>
          <Text style={styles.groupBadgeLabel}>
            GROUP
          </Text>

          <Text style={styles.groupBadgeCode}>
            {GROUP_CODE}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={30}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.heroTextBox}>
            <Text style={styles.heroTitle}>
              Market Safety Inspection
            </Text>

            <Text style={styles.heroDescription}>
              Select a stall below to view existing records or start a new inspection.
            </Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={21}
            color={COLORS.secondary}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search stall, category or zone"
            placeholderTextColor="#90A4AE"
            style={styles.searchInput}
          />

          {search.length > 0 ? (
            <Pressable
              onPress={function () {
                setSearch('');
              }}
            >
              <Ionicons
                name="close-circle"
                size={21}
                color={COLORS.secondary}
              />
            </Pressable>
          ) : null}
        </View>

        <SectionTitle
          title="Market Catalog"
          subtitle={
            filteredItems.length +
            ' stall' +
            (filteredItems.length === 1
              ? ''
              : 's') +
            ' available'
          }
        />

        {filteredItems.length === 0 ? (
          <View style={styles.noSearchResults}>
            <Ionicons
              name="search-outline"
              size={40}
              color={COLORS.secondary}
            />

            <Text style={styles.noSearchTitle}>
              No stalls found
            </Text>

            <Text style={styles.noSearchText}>
              Try a different stall name, code, category or zone.
            </Text>
          </View>
        ) : (
          <View style={styles.catalogGrid}>
            {filteredItems.map(function (item) {
              const recordCount = records.filter(
                function (record) {
                  return record.stallCode === item.id;
                }
              ).length;

              return (
                <MarketCatalogCard
                  key={item.id}
                  item={item}
                  recordCount={recordCount}
                  selected={
                    selectedStall &&
                    selectedStall.id === item.id
                  }
                  onPress={function () {
                    if (
                      selectedStall &&
                      selectedStall.id === item.id
                    ) {
                      setSelectedStall(null);
                    } else {
                      setSelectedStall(item);
                    }
                  }}
                />
              );
            })}
          </View>
        )}

        {selectedStall ? (
          <StallRecordsPanel
            stall={selectedStall}
            records={records}
            onClose={function () {
              setSelectedStall(null);
            }}
            onNewInspection={function () {
              startInspectionForStall(selectedStall);
            }}
            onRecordPress={openRecordDetails}
          />
        ) : (
          <View style={styles.homeHint}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={COLORS.primary}
            />

            <Text style={styles.homeHintText}>
              Tap a stall to see its records.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

// new inspection screen

function NewInspectionScreen({
  navigation,
  route,
  addRecord,
}) {
  const [vendorAlias, setVendorAlias] = useState('');
  const [selectedStall, setSelectedStall] = useState(null);
  const [stallCode, setStallCode] = useState('');
  const [category, setCategory] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [priority, setPriority] = useState('');
  const [consent, setConsent] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);

  const [showStallSelector, setShowStallSelector] =
    useState(false);

  const [errors, setErrors] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [reviewTimestamp, setReviewTimestamp] = useState(null);

  const [imagePickerBusy, setImagePickerBusy] =
    useState(false);

  // clear form

  function clearForm() {
    setVendorAlias('');
    setSelectedStall(null);
    setStallCode('');
    setCategory('');
    setContactNumber('');
    setRiskLevel('');
    setPriority('');
    setConsent(false);
    setPhotoUri(null);
    setShowStallSelector(false);
    setErrors({});
    setShowReview(false);
    setReviewTimestamp(null);
  }

  // get stall from home

  useEffect(
    function () {
      const incomingStall =
        route && route.params
          ? route.params.stall
          : undefined;

      if (!incomingStall) {
        return;
      }

      const validStall = MARKET_ITEMS.find(
        function (item) {
          return item.id === incomingStall.id;
        }
      );

      if (validStall) {
        setSelectedStall(validStall);
        setStallCode(validStall.id);
        setCategory(validStall.category);

        setVendorAlias('');
        setContactNumber('');
        setRiskLevel('');
        setPriority('');
        setConsent(false);
        setPhotoUri(null);
        setErrors({});
        setShowStallSelector(false);
      }
    },
    [route ? route.params?.stall : undefined]
  );

  // clear error

  function clearError(field) {
    setErrors(function (previous) {
      return {
        ...previous,
        [field]: '',
      };
    });
  }

  // select stall

  function chooseStall(stall) {
    setSelectedStall(stall);
    setStallCode(stall.id);
    setCategory(stall.category);
    setShowStallSelector(false);

    clearError('stallCode');
    clearError('category');
  }

  // open camera

  async function takePhoto() {
    if (imagePickerBusy) {
      return;
    }

    setImagePickerBusy(true);

    try {
      let permission =
        await ImagePicker.getCameraPermissionsAsync();

      if (!permission.granted) {
        permission =
          await ImagePicker.requestCameraPermissionsAsync();
      }

      if (!permission.granted) {
        Alert.alert(
          'Camera Permission',
          'Camera permission is required to take an inspection photo.'
        );

        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: false,

          // use smaller image quality
          quality: 0.45,

          exif: false,
          base64: false,
        });

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Camera Error',
        'Unable to open the camera. Please try again.'
      );
    } finally {
      setImagePickerBusy(false);
    }
  }

  // open gallery

  async function chooseFromGallery() {
    if (imagePickerBusy) {
      return;
    }

    setImagePickerBusy(true);

    try {
      let permission =
        await ImagePicker.getMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permission.granted) {
        Alert.alert(
          'Gallery Permission',
          'Gallery permission is required to select an inspection photo.'
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,

          // use smaller image quality
          quality: 0.45,

          selectionLimit: 1,
          exif: false,
          base64: false,
        });

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Gallery Error',
        'Unable to open the gallery. Please try again.'
      );
    } finally {
      setImagePickerBusy(false);
    }
  }

  // check form

  function validateForm() {
    const newErrors = {};

    if (!vendorAlias.trim()) {
      newErrors.vendorAlias =
        'Vendor alias is required.';
    }

    if (!stallCode) {
      newErrors.stallCode =
        'Please select a stall.';
    }

    if (!category) {
      newErrors.category =
        'Category is required.';
    }

    const phoneError =
      validatePhone(contactNumber);

    if (phoneError) {
      newErrors.contactNumber =
        phoneError;
    }

    if (!riskLevel) {
      newErrors.riskLevel =
        'Please select a risk level.';
    }

    if (!priority) {
      newErrors.priority =
        'Please select a priority.';
    }

    if (!consent) {
      newErrors.consent =
        'Consent must be confirmed before submitting.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // review and save inspection

  function handleSubmit() {
    if (!validateForm()) {
      Alert.alert(
        'Check Your Form',
        'Please correct the highlighted fields before submitting.'
      );

      return;
    }

    const now = new Date();

    setReviewTimestamp({
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
    setShowReview(true);
  }

  function confirmSave() {
    if (!reviewTimestamp) {
      return;
    }

    const newRecord = {
      id: String(Date.now()),
      vendorAlias: vendorAlias.trim(),
      stallCode: stallCode,
      stallName:
        selectedStall &&
        selectedStall.name
          ? selectedStall.name
          : 'Stall ' + stallCode,
      category: category,
      zone:
        selectedStall &&
        selectedStall.zone
          ? selectedStall.zone
          : '',
      contactNumber: contactNumber,
      riskLevel: riskLevel,
      priority: priority,
      consent: true,
      photoUri: photoUri || null,
      date: reviewTimestamp.date,
      time: reviewTimestamp.time,
      groupCode: GROUP_CODE,
      status: 'Completed',
    };

    setShowReview(false);
    addRecord(newRecord);

    // clear form after saving
    clearForm();

    // remove selected stall from navigation
    navigation.setParams({
      stall: undefined,
    });

    Alert.alert(
      'Inspection Saved',
      'The inspection has been recorded successfully.',
      [
        {
          text: 'View Records',
          onPress: function () {
            navigation.navigate('Records', {
              screen: 'Records List',
            });
          },
        },
        {
          text: 'New Inspection',
          onPress: function () {
            clearForm();

            navigation.setParams({
              stall: undefined,
            });
          },
        },
      ]
    );
  }

  // inspection form

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.formScrollContent
          }
        >
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderIcon}>
              <Ionicons
                name="create-outline"
                size={28}
                color={COLORS.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.pageTitle}>
                New Inspection
              </Text>

              <Text style={styles.pageSubtitle}>
                Record market vendor inspection details.
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>

            {/* vendor alias */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Vendor Alias
              </Text>

              <View
                style={[
                  styles.inputContainer,
                  errors.vendorAlias &&
                    styles.inputError,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.secondary}
                />

                <TextInput
                  value={vendorAlias}
                  onChangeText={function (text) {
                    setVendorAlias(text);

                    if (text.trim()) {
                      clearError(
                        'vendorAlias'
                      );
                    }
                  }}
                  placeholder="Enter vendor alias"
                  placeholderTextColor="#90A4AE"
                  style={styles.textInput}
                />
              </View>

              <ErrorText>
                {errors.vendorAlias}
              </ErrorText>
            </View>

            {/* stall */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Stall
              </Text>

              <Pressable
                onPress={function () {
                  setShowStallSelector(
                    !showStallSelector
                  );
                }}
                style={[
                  styles.inputContainer,
                  errors.stallCode &&
                    styles.inputError,
                ]}
              >
                <Ionicons
                  name="storefront-outline"
                  size={20}
                  color={COLORS.secondary}
                />

                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.selectText,
                      !selectedStall &&
                        styles.placeholderText,
                    ]}
                  >
                    {selectedStall
                      ? selectedStall.id +
                        ' • ' +
                        selectedStall.name
                      : 'Select stall'}
                  </Text>
                </View>

                <Ionicons
                  name={
                    showStallSelector
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={20}
                  color={COLORS.secondary}
                />
              </Pressable>

              <ErrorText>
                {errors.stallCode}
              </ErrorText>

              {showStallSelector ? (
                <View style={styles.stallSelectorBox}>
                  <Text style={styles.selectorTitle}>
                    Select Stall
                  </Text>

                  <View style={styles.selectorGrid}>
                    {MARKET_ITEMS.map(
                      function (stall) {
                        const isSelected =
                          selectedStall &&
                          selectedStall.id ===
                            stall.id;

                        return (
                          <Pressable
                            key={stall.id}
                            onPress={function () {
                              chooseStall(
                                stall
                              );
                            }}
                            style={[
                              styles.selectorItem,
                              isSelected &&
                                styles.selectorItemSelected,
                            ]}
                          >
                            <View
                              style={
                                styles.selectorCodeCircle
                              }
                            >
                              <Text
                                style={[
                                  styles.selectorCode,
                                  isSelected &&
                                    styles.selectorCodeSelected,
                                ]}
                              >
                                {stall.id}
                              </Text>
                            </View>

                            <Text
                              style={[
                                styles.selectorName,
                                isSelected &&
                                  styles.selectorNameSelected,
                              ]}
                              numberOfLines={2}
                            >
                              {stall.name}
                            </Text>

                            <Text
                              style={[
                                styles.selectorCategory,
                                isSelected &&
                                  styles.selectorCategorySelected,
                              ]}
                            >
                              {stall.category}
                            </Text>
                          </Pressable>
                        );
                      }
                    )}
                  </View>
                </View>
              ) : null}
            </View>

            {/* category */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Category
              </Text>

              <View
                style={
                  styles.inputContainerDisabled
                }
              >
                <Ionicons
                  name="layers-outline"
                  size={20}
                  color={COLORS.secondary}
                />

                <TextInput
                  value={category}
                  editable={false}
                  placeholder="Auto-filled from stall"
                  placeholderTextColor="#90A4AE"
                  style={styles.textInput}
                />
              </View>

              <ErrorText>
                {errors.category}
              </ErrorText>
            </View>

            {/* contact number */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Contact Number
              </Text>

              <View
                style={[
                  styles.inputContainer,
                  errors.contactNumber &&
                    styles.inputError,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={COLORS.secondary}
                />

                <TextInput
                  value={contactNumber}
                  onChangeText={function (text) {
                    const cleaned =
                      text
                        .replace(
                          /[^0-9]/g,
                          ''
                        )
                        .slice(0, 10);

                    setContactNumber(
                      cleaned
                    );

                    const phoneError =
                      validatePhone(
                        cleaned
                      );

                    if (
                      cleaned.length === 10
                    ) {
                      if (phoneError) {
                        setErrors(
                          function (previous) {
                            return {
                              ...previous,
                              contactNumber:
                                phoneError,
                            };
                          }
                        );
                      } else {
                        clearError(
                          'contactNumber'
                        );
                      }
                    } else {
                      clearError(
                        'contactNumber'
                      );
                    }
                  }}
                  placeholder="07XXXXXXXX"
                  placeholderTextColor="#90A4AE"
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={styles.textInput}
                />
              </View>

              <Text style={styles.helperText}>
                Exactly 10 digits • must start with 072, 073, 078, or 079
              </Text>

              <ErrorText>
                {errors.contactNumber}
              </ErrorText>
            </View>

            {/* risk level */}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Risk Level
              </Text>

              <View style={styles.riskOptions}>
                {['Low', 'Medium', 'High'].map(
                  function (risk) {
                    const selected =
                      riskLevel === risk;

                    return (
                      <Pressable
                        key={risk}
                        onPress={function () {
                          setRiskLevel(
                            risk
                          );

                          clearError(
                            'riskLevel'
                          );
                        }}
                        style={[
                          styles.riskOption,
                          selected &&
                            styles.riskOptionSelected,
                        ]}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            selected &&
                              styles.radioOuterSelected,
                          ]}
                        >
                          {selected ? (
                            <View
                              style={
                                styles.radioInner
                              }
                            />
                          ) : null}
                        </View>

                        <Text
                          style={[
                            styles.riskOptionText,
                            selected &&
                              styles.riskOptionTextSelected,
                          ]}
                        >
                          {risk}
                        </Text>
                      </Pressable>
                    );
                  }
                )}
              </View>

              <ErrorText>
                {errors.riskLevel}
              </ErrorText>
            </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Priority
                </Text>

                <View style={styles.riskOptions}>
                  {['Low', 'Medium', 'High'].map(
                    function (level) {
                      const selected =
                        priority === level;

                      return (
                        <Pressable
                          key={level}
                          onPress={function () {
                            setPriority(level);
                            clearError('priority');
                          }}
                          style={[
                            styles.riskOption,
                            selected && styles.riskOptionSelected,
                          ]}
                        >
                          <View
                            style={[
                              styles.radioOuter,
                              selected && styles.radioOuterSelected,
                            ]}
                          >
                            {selected ? (
                              <View style={styles.radioInner} />
                            ) : null}
                          </View>

                          <Text
                            style={[
                              styles.riskOptionText,
                              selected && styles.riskOptionTextSelected,
                            ]}
                          >
                            {level}
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>

                <ErrorText>
                  {errors.priority}
                </ErrorText>
              </View>

            {/* inspection photo */}

            <View style={styles.fieldGroup}>
              <View style={styles.photoLabelRow}>
                <Text style={styles.fieldLabel}>
                  Inspection Photo
                </Text>

                {imagePickerBusy ? (
                  <Text
                    style={
                      styles.photoLoadingText
                    }
                  >
                    Opening...
                  </Text>
                ) : null}
              </View>

              {photoUri ? (
                <View style={styles.photoPreviewBox}>
                  <Image
                    source={{
                      uri: photoUri,
                    }}
                    style={styles.photoPreview}
                    resizeMethod={
                      Platform.OS ===
                      'android'
                        ? 'resize'
                        : undefined
                    }
                  />

                  <View style={styles.photoActions}>
                    <Pressable
                      onPress={takePhoto}
                      disabled={
                        imagePickerBusy
                      }
                      style={[
                        styles.secondaryButton,
                        imagePickerBusy &&
                          styles.buttonDisabled,
                      ]}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={19}
                        color={
                          COLORS.primary
                        }
                      />

                      <Text
                        style={
                          styles.secondaryButtonText
                        }
                      >
                        Replace
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={function () {
                        setPhotoUri(null);
                      }}
                      style={
                        styles.deleteButton
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={19}
                        color={
                          COLORS.danger
                        }
                      />

                      <Text
                        style={
                          styles.deleteButtonText
                        }
                      >
                        Remove
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.photoBox}>
                  <View style={styles.photoIconCircle}>
                    <Ionicons
                      name="camera-outline"
                      size={32}
                      color={
                        COLORS.primary
                      }
                    />
                  </View>

                  <Text style={styles.photoTitle}>
                    Add Inspection Photo
                  </Text>

                  <Text
                    style={
                      styles.photoDescription
                    }
                  >
                    Use the camera or choose an existing photo.
                  </Text>

                  <View
                    style={
                      styles.photoButtonRow
                    }
                  >
                    <Pressable
                      onPress={
                        takePhoto
                      }
                      disabled={
                        imagePickerBusy
                      }
                      style={[
                        styles.photoButton,
                        imagePickerBusy &&
                          styles.buttonDisabled,
                      ]}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={20}
                        color={
                          COLORS.white
                        }
                      />

                      <Text
                        style={
                          styles.photoButtonText
                        }
                      >
                        Camera
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={
                        chooseFromGallery
                      }
                      disabled={
                        imagePickerBusy
                      }
                      style={[
                        styles.galleryButton,
                        imagePickerBusy &&
                          styles.buttonDisabled,
                      ]}
                    >
                      <Ionicons
                        name="images-outline"
                        size={20}
                        color={
                          COLORS.primary
                        }
                      />

                      <Text
                        style={
                          styles.galleryButtonText
                        }
                      >
                        Gallery
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            {/* consent */}

            <Pressable
              onPress={function () {
                setConsent(!consent);
                clearError('consent');
              }}
              style={styles.consentRow}
            >
              <View
                style={[
                  styles.checkbox,
                  consent &&
                    styles.checkboxChecked,
                ]}
              >
                {consent ? (
                  <Ionicons
                    name="checkmark"
                    size={17}
                    color={COLORS.white}
                  />
                ) : null}
              </View>

              <Text style={styles.consentText}>
                I confirm that the vendor consent has been obtained for this inspection record.
              </Text>
            </Pressable>

            <ErrorText>
              {errors.consent}
            </ErrorText>

            {/* review button */}

            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                pressed &&
                  styles.pressed,
              ]}
            >
              <Ionicons
                name="save-outline"
                size={21}
                color={COLORS.white}
              />

              <Text
                style={
                  styles.submitButtonText
                }
              >
                Review Inspection
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showReview}
        transparent
        animationType="slide"
        onRequestClose={function () {
          setShowReview(false);
        }}
      >
        <View style={styles.reviewOverlay}>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>
              Review Inspection
            </Text>

            <ScrollView
              style={styles.reviewContent}
              showsVerticalScrollIndicator={false}
            >
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  style={styles.reviewPhoto}
                />
              ) : null}

              <DetailRow
                icon="person-outline"
                label="Vendor Alias"
                value={vendorAlias.trim()}
              />
              <DetailRow
                icon="storefront-outline"
                label="Stall"
                value={stallCode + ' • ' + (selectedStall ? selectedStall.name : '')}
              />
              <DetailRow
                icon="layers-outline"
                label="Category"
                value={category}
              />
              <DetailRow
                icon="call-outline"
                label="Contact Number"
                value={contactNumber}
              />
              <DetailRow
                icon="warning-outline"
                label="Risk Level"
                value={riskLevel}
              />
              <DetailRow
                icon="flag-outline"
                label="Priority"
                value={priority}
              />
              <DetailRow
                icon="checkmark-circle-outline"
                label="Consent"
                value="Confirmed"
              />
              <DetailRow
                icon="calendar-outline"
                label="Date"
                value={reviewTimestamp ? reviewTimestamp.date : ''}
              />
              <DetailRow
                icon="time-outline"
                label="Time"
                value={reviewTimestamp ? reviewTimestamp.time : ''}
              />
              <DetailRow
                icon="people-outline"
                label="Group Verification Code"
                value={GROUP_CODE}
              />
              {!photoUri ? (
                <Text style={styles.reviewNoPhoto}>
                  No inspection photo selected.
                </Text>
              ) : null}
            </ScrollView>

            <View style={styles.reviewActions}>
              <Pressable
                onPress={function () {
                  setShowReview(false);
                }}
                style={styles.reviewBackButton}
              >
                <Text style={styles.reviewBackText}>
                  Back to Edit
                </Text>
              </Pressable>
              <Pressable
                onPress={confirmSave}
                style={styles.reviewSaveButton}
              >
                <Text style={styles.reviewSaveText}>
                  Confirm & Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}

// records screen

function RecordsScreen({
  navigation,
  records,
}) {
  return (
    <SafeScreen>
      <View style={styles.recordsHeader}>
        <View style={styles.brandRow}>
          <AppLogo size={48} />

          <View style={styles.brandTextBox}>
            <Text style={styles.appTitle}>
              Inspection Records
            </Text>

            <Text style={styles.appSubtitle}>
              Saved in this session
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.totalRecordsCard}>
          <View style={styles.totalRecordsIcon}>
            <Ionicons
              name="document-text-outline"
              size={30}
              color={COLORS.primary}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={
                styles.totalRecordsTitle
              }
            >
              Total Records
            </Text>

            <Text
              style={
                styles.totalRecordsNumber
              }
            >
              {records.length}
            </Text>
          </View>
        </View>

        {records.length === 0 ? (
          <View style={styles.emptyRecords}>
            <View style={styles.emptyRecordsIcon}>
              <Ionicons
                name="document-outline"
                size={46}
                color={
                  COLORS.secondary
                }
              />
            </View>

            <Text
              style={
                styles.emptyRecordsTitle
              }
            >
              No inspection records
            </Text>

            <Text
              style={
                styles.emptyRecordsText
              }
            >
              Create a new inspection to see it here.
            </Text>

            <Pressable
              onPress={function () {
                navigation.navigate(
                  'New Inspection'
                );
              }}
              style={
                styles.primaryButton
              }
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={
                  COLORS.white
                }
              />

              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Create Inspection
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.recordList}>
            <SectionTitle
              title="All Inspections"
              subtitle={
                records.length +
                ' saved record' +
                (records.length === 1
                  ? ''
                  : 's')
              }
            />

            {records.map(function (record) {
              return (
                <Pressable
                  key={record.id}
                  onPress={function () {
                    navigation.navigate(
                      'Inspection Details',
                      {
                        recordId:
                          record.id,
                      }
                    );
                  }}
                  style={function ({
                    pressed,
                  }) {
                    return [
                      styles.recordCard,
                      pressed &&
                        styles.pressed,
                    ];
                  }}
                >
                  {record.photoUri ? (
                    <Image
                      source={{
                        uri: record.photoUri,
                      }}
                      style={
                        styles.recordListImage
                      }
                      resizeMethod={
                        Platform.OS ===
                        'android'
                          ? 'resize'
                          : undefined
                      }
                    />
                  ) : (
                    <View
                      style={
                        styles.recordListPlaceholder
                      }
                    >
                      <Ionicons
                        name="camera-outline"
                        size={25}
                        color={
                          COLORS.secondary
                        }
                      />
                    </View>
                  )}

                  <View
                    style={
                      styles.recordCardText
                    }
                  >
                    <Text
                      style={
                        styles.recordVendorName
                      }
                    >
                      {record.vendorAlias}
                    </Text>

                    <Text
                      style={
                        styles.recordSmallText
                      }
                    >
                      Stall {record.stallCode} •{' '}
                      {record.category}
                    </Text>

                    <Text
                      style={
                        styles.recordSmallText
                      }
                    >
                      {record.contactNumber}
                    </Text>

                    <Text
                      style={styles.recordSmallText}
                    >
                      Priority: {record.priority}
                    </Text>

                    <View
                      style={
                        styles.recordCardBottom
                      }
                    >
                      <View
                        style={[
                          styles.riskBadge,
                          record.riskLevel ===
                            'High' &&
                            styles.riskHigh,
                          record.riskLevel ===
                            'Medium' &&
                            styles.riskMedium,
                          record.riskLevel ===
                            'Low' &&
                            styles.riskLow,
                        ]}
                      >
                        <Text
                          style={
                            styles.riskBadgeText
                          }
                        >
                          {record.riskLevel}
                        </Text>
                      </View>

                      <Text
                        style={
                          styles.recordDateText
                        }
                      >
                        {record.date}
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={21}
                    color={
                      COLORS.secondary
                    }
                  />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

// detail row

function DetailRow({
  icon,
  label,
  value,
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIconBox}>
        <Ionicons
          name={icon}
          size={20}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.detailTextBox}>
        <Text style={styles.detailLabel}>
          {label}
        </Text>

        <Text style={styles.detailValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

// inspection details

function InspectionDetailsScreen({
  route,
  records,
}) {
  const record = records.find(
    function (item) {
      return (
        item.id ===
        route.params?.recordId
      );
    }
  );

  if (!record) {
    return (
      <SafeScreen
        style={
          styles.detailsSafeArea
        }
      >
        <View
          style={
            styles.detailsMissing
          }
        >
          <Ionicons
            name="alert-circle-outline"
            size={50}
            color={
              COLORS.secondary
            }
          />

          <Text
            style={
              styles.detailsMissingTitle
            }
          >
            Record not found
          </Text>

          <Text
            style={
              styles.detailsMissingText
            }
          >
            The selected inspection record is unavailable.
          </Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen
      style={
        styles.detailsSafeArea
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.detailsScrollContent
        }
      >
        {record.photoUri ? (
          <Image
            source={{
              uri: record.photoUri,
            }}
            style={
              styles.detailsPhoto
            }
            resizeMethod={
              Platform.OS === 'android'
                ? 'resize'
                : undefined
            }
          />
        ) : (
          <View
            style={
              styles.detailsPhotoPlaceholder
            }
          >
            <Ionicons
              name="camera-outline"
              size={55}
              color={
                COLORS.secondary
              }
            />

            <Text
              style={
                styles.detailsNoPhotoText
              }
            >
              No inspection photo
            </Text>
          </View>
        )}

        <View
          style={
            styles.detailsCard
          }
        >
          <View
            style={
              styles.detailsTitleRow
            }
          >
            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.detailsVendor
                }
              >
                {record.vendorAlias}
              </Text>

              <Text
                style={
                  styles.detailsSubTitle
                }
              >
                Inspection Record
              </Text>
            </View>

            <View
              style={
                styles.completedBadge
              }
            >
              <Ionicons
                name="checkmark-circle"
                size={17}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.completedText
                }
              >
                Completed
              </Text>
            </View>
          </View>

          <View
            style={
              styles.detailsDivider
            }
          />

          <DetailRow
            icon="storefront-outline"
            label="Stall"
            value={
              record.stallCode +
              ' • ' +
              record.stallName
            }
          />

          <DetailRow
            icon="layers-outline"
            label="Category"
            value={record.category}
          />

          <DetailRow
            icon="location-outline"
            label="Zone"
            value={record.zone}
          />

          <DetailRow
            icon="call-outline"
            label="Contact"
            value={record.contactNumber}
          />

          <DetailRow
            icon="warning-outline"
            label="Risk Level"
            value={record.riskLevel}
          />

          <DetailRow
            icon="flag-outline"
            label="Priority"
            value={record.priority}
          />

          <DetailRow
            icon="checkmark-circle-outline"
            label="Consent"
            value={
              record.consent
                ? 'Confirmed'
                : 'Not confirmed'
            }
          />

          <DetailRow
            icon="calendar-outline"
            label="Date"
            value={record.date}
          />

          <DetailRow
            icon="time-outline"
            label="Time"
            value={record.time}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

// records navigation

function RecordsStackScreen({
  records,
}) {
  return (
    <Stack.Navigator
      initialRouteName="Records List"
      screenOptions={{
        headerStyle: {
          backgroundColor:
            COLORS.darkGreen,
        },

        headerTintColor:
          COLORS.white,

        headerTitleStyle: {
          fontWeight: '700',
        },

        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="Records List"
        options={{
          headerShown: false,
        }}
      >
        {function (props) {
          return (
            <RecordsScreen
              {...props}
              records={records}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen
        name="Inspection Details"
        options={{
          title:
            'Inspection Details',
        }}
      >
        {function (props) {
          return (
            <InspectionDetailsScreen
              {...props}
              records={records}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// main tabs

function MainTabs({
  records,
  addRecord,
}) {
  return (
    <Tab.Navigator
      screenOptions={function ({
        route,
      }) {
        return {
          headerShown: false,

          tabBarActiveTintColor:
            COLORS.primary,

          tabBarInactiveTintColor:
            '#78909C',

          tabBarStyle: {
            height:
              Platform.OS === 'ios'
                ? 82
                : 64,

            paddingTop: 7,

            paddingBottom:
              Platform.OS === 'ios'
                ? 22
                : 8,

            backgroundColor:
              COLORS.white,

            borderTopColor:
              COLORS.border,

            borderTopWidth: 1,
          },

          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
          },

          tabBarIcon:
            function ({
              color,
              size,
              focused,
            }) {
              let iconName =
                'home-outline';

              if (
                route.name === 'Home'
              ) {
                iconName = focused
                  ? 'home'
                  : 'home-outline';
              }

              if (
                route.name ===
                'New Inspection'
              ) {
                iconName = focused
                  ? 'add-circle'
                  : 'add-circle-outline';
              }

              if (
                route.name ===
                'Records'
              ) {
                iconName = focused
                  ? 'document-text'
                  : 'document-text-outline';
              }

              return (
                <Ionicons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            },
        };
      }}
    >
      <Tab.Screen name="Home">
        {function (props) {
          return (
            <HomeScreen
              {...props}
              records={records}
            />
          );
        }}
      </Tab.Screen>

      <Tab.Screen
        name="New Inspection"
        listeners={function ({
          navigation,
        }) {
          return {
            tabPress: function () {
              navigation.setParams({
                stall: undefined,
              });
            },
          };
        }}
      >
        {function (props) {
          return (
            <NewInspectionScreen
              {...props}
              addRecord={addRecord}
            />
          );
        }}
      </Tab.Screen>

      <Tab.Screen name="Records">
        {function () {
          return (
            <RecordsStackScreen
              records={records}
            />
          );
        }}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// app

export default function App() {
  const [records, setRecords] =
    useState([]);

  function addRecord(record) {
    setRecords(function (previous) {
      return [
        record,
        ...previous,
      ];
    });
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainTabs
          records={records}
          addRecord={addRecord}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// app styles

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor:
      COLORS.darkGreen,
  },

  detailsSafeArea: {
    backgroundColor:
      COLORS.background,
  },

  pressed: {
    opacity: 0.85,
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  // scroll styles

  scrollContent: {
    backgroundColor:
      COLORS.background,
    padding: 16,
    paddingBottom: 30,
  },

  formScrollContent: {
    backgroundColor:
      COLORS.background,
    padding: 16,
    paddingBottom: 40,
  },

  detailsScrollContent: {
    backgroundColor:
      COLORS.background,
    paddingBottom: 30,
  },

  // header styles

  topHeader: {
    backgroundColor:
      COLORS.darkGreen,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },

  recordsHeader: {
    backgroundColor:
      COLORS.darkGreen,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandTextBox: {
    flex: 1,
    marginLeft: 11,
  },

  appTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '800',
  },

  appSubtitle: {
    color: '#C8E6C9',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },

  groupBadge: {
    marginTop: 14,
    alignSelf:
      'flex-start',
    backgroundColor:
      'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.20)',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  groupBadgeLabel: {
    color: '#A5D6A7',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  groupBadgeCode: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },

  // hero styles

  heroCard: {
    flexDirection: 'row',
    backgroundColor:
      COLORS.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      COLORS.lightGreen,
  },

  heroTextBox: {
    flex: 1,
    marginLeft: 12,
  },

  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },

  heroDescription: {
    fontSize: 12,
    lineHeight: 18,
    color:
      COLORS.secondary,
    marginTop: 5,
  },

  // search styles

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.white,
    borderRadius: 13,
    paddingHorizontal: 13,
    minHeight: 50,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 9,
    paddingVertical: 0,
  },

  // section styles

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 11,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },

  sectionSubtitle: {
    fontSize: 12,
    color:
      COLORS.secondary,
    marginTop: 3,
  },

  // catalog styles

  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
  },

  marketCard: {
    width: '48.5%',
    backgroundColor:
      COLORS.white,
    borderRadius: 15,
    padding: 13,
    marginBottom: 12,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    minHeight: 190,
  },

  marketCardSelected: {
    borderWidth: 2,
    borderColor:
      COLORS.primary,
    backgroundColor:
      '#FAFFFA',
  },

  marketCardTop: {
    flexDirection: 'row',
    alignItems:
      'flex-start',
  },

  marketIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent:
      'center',
    backgroundColor:
      COLORS.lightGreen,
  },

  marketCardText: {
    flex: 1,
    marginLeft: 9,
  },

  stallCode: {
    fontSize: 10,
    fontWeight: '800',
    color:
      COLORS.primary,
    marginBottom: 3,
  },

  marketCardName: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    color:
      COLORS.text,
  },

  recordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:
      'flex-start',
    backgroundColor:
      '#F1F8F2',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 14,
  },

  recordDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      COLORS.primary,
    marginRight: 5,
  },

  recordChipText: {
    fontSize: 10,
    color:
      COLORS.primary,
    fontWeight: '700',
  },

  marketCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginTop: 20,
    paddingTop: 4,
  },

  zoneText: {
    fontSize: 11,
    color:
      COLORS.secondary,
    fontWeight: '700',
  },

  // hint styles

  homeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      '#EAF6EB',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    marginTop: 6,
  },

  homeHintText: {
    flex: 1,
    color:
      COLORS.secondary,
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '600',
  },

  noSearchResults: {
    alignItems: 'center',
    backgroundColor:
      COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 30,
  },

  noSearchTitle: {
    color:
      COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },

  noSearchText: {
    color:
      COLORS.secondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },

  // stall panel styles

  stallPanel: {
    backgroundColor:
      COLORS.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    marginTop: 18,
    padding: 15,
  },

  stallPanelHeader: {
    flexDirection: 'row',
    alignItems:
      'flex-start',
  },

  stallPanelTitle: {
    fontSize: 18,
    color:
      COLORS.text,
    fontWeight: '800',
  },

  stallPanelSubtitle: {
    color:
      COLORS.secondary,
    fontSize: 12,
    marginTop: 2,
  },

  stallRecordCount: {
    color:
      COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent:
      'center',
    backgroundColor:
      COLORS.background,
  },

  emptyStallBox: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 8,
  },

  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor:
      COLORS.background,
    alignItems: 'center',
    justifyContent:
      'center',
    marginBottom: 12,
  },

  emptyStallTitle: {
    color:
      COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },

  emptyStallText: {
    color:
      COLORS.secondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
  },

  recordsInsidePanel: {
    marginTop: 15,
  },

  // vendor record styles

  vendorRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      '#FAFCF9',
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 13,
    padding: 10,
    marginBottom: 9,
  },

  vendorRecordImageBox: {
    width: 70,
    height: 70,
    borderRadius: 11,
    overflow: 'hidden',
  },

  vendorThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  vendorImagePlaceholder: {
    flex: 1,
    backgroundColor:
      COLORS.background,
    alignItems: 'center',
    justifyContent:
      'center',
  },

  vendorRecordInfo: {
    flex: 1,
    marginHorizontal: 10,
  },

  vendorName: {
    color:
      COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },

  vendorMeta: {
    color:
      COLORS.secondary,
    fontSize: 11,
    marginTop: 3,
  },

  vendorBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },

  photoStatus: {
    color:
      COLORS.secondary,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 8,
  },

  riskBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor:
      '#ECEFF1',
  },

  riskLow: {
    backgroundColor:
      '#E8F5E9',
  },

  riskMedium: {
    backgroundColor:
      '#FFF3E0',
  },

  riskHigh: {
    backgroundColor:
      '#FFEBEE',
  },

  riskBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color:
      COLORS.text,
  },

  // button styles

  primaryButton: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor:
      COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'center',
  },

  primaryButtonText: {
    color:
      COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 7,
  },

  // page header styles

  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  pageHeaderIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor:
      COLORS.lightGreen,
    alignItems: 'center',
    justifyContent:
      'center',
    marginRight: 11,
  },

  pageTitle: {
    color:
      COLORS.text,
    fontSize: 21,
    fontWeight: '800',
  },

  pageSubtitle: {
    color:
      COLORS.secondary,
    fontSize: 12,
    marginTop: 3,
  },

  // form styles

  formCard: {
    backgroundColor:
      COLORS.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 15,
  },

  fieldGroup: {
    marginBottom: 18,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '800',
    color:
      COLORS.text,
    marginBottom: 7,
  },

  inputContainer: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    backgroundColor:
      '#FBFDFB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },

  inputContainerDisabled: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    backgroundColor:
      '#EEF2EE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },

  inputError: {
    borderColor:
      COLORS.danger,
    backgroundColor:
      '#FFF8F8',
  },

  textInput: {
    flex: 1,
    color:
      COLORS.text,
    fontSize: 14,
    marginLeft: 9,
    paddingVertical: 0,
  },

  selectText: {
    fontSize: 14,
    color:
      COLORS.text,
    marginLeft: 9,
  },

  placeholderText: {
    color:
      '#90A4AE',
  },

  helperText: {
    color:
      COLORS.secondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 6,
  },

  errorText: {
    color:
      COLORS.danger,
    fontSize: 11,
    marginTop: 5,
    lineHeight: 15,
  },

  // stall selector styles

  stallSelectorBox: {
    marginTop: 9,
    borderRadius: 13,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 10,
    backgroundColor:
      '#FAFCF9',
  },

  selectorTitle: {
    color:
      COLORS.text,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 9,
  },

  selectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
  },

  selectorItem: {
    width: '48.5%',
    borderRadius: 11,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    backgroundColor:
      COLORS.white,
    padding: 10,
    marginBottom: 9,
  },

  selectorItemSelected: {
    borderColor:
      COLORS.primary,
    backgroundColor:
      COLORS.lightGreen,
  },

  selectorCodeCircle: {
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor:
      COLORS.background,
    alignItems: 'center',
    justifyContent:
      'center',
    marginBottom: 7,
  },

  selectorCode: {
    fontSize: 10,
    fontWeight: '800',
    color:
      COLORS.primary,
  },

  selectorCodeSelected: {
    color:
      COLORS.darkGreen,
  },

  selectorName: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    color:
      COLORS.text,
  },

  selectorNameSelected: {
    color:
      COLORS.darkGreen,
  },

  selectorCategory: {
    fontSize: 10,
    color:
      COLORS.secondary,
    marginTop: 3,
  },

  selectorCategorySelected: {
    color:
      COLORS.primary,
  },

  // risk styles

  riskOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
  },

  riskOption: {
    width: '31.5%',
    minHeight: 47,
    borderRadius: 11,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    backgroundColor:
      COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'center',
    paddingHorizontal: 6,
  },

  riskOptionSelected: {
    borderColor:
      COLORS.primary,
    backgroundColor:
      COLORS.lightGreen,
  },

  radioOuter: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 2,
    borderColor:
      COLORS.gray,
    alignItems: 'center',
    justifyContent:
      'center',
    marginRight: 5,
  },

  radioOuterSelected: {
    borderColor:
      COLORS.primary,
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor:
      COLORS.primary,
  },

  riskOptionText: {
    color:
      COLORS.secondary,
    fontSize: 11,
    fontWeight: '700',
  },

  riskOptionTextSelected: {
    color:
      COLORS.primary,
  },

  // photo styles

  photoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  photoLoadingText: {
    color:
      COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 7,
  },

  photoBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor:
      '#B7CBB8',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    backgroundColor:
      '#FAFCF9',
  },

  photoIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor:
      COLORS.lightGreen,
    alignItems: 'center',
    justifyContent:
      'center',
    marginBottom: 11,
  },

  photoTitle: {
    color:
      COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },

  photoDescription: {
    color:
      COLORS.secondary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },

  photoButtonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginTop: 14,
  },

  photoButton: {
    width: '48%',
    minHeight: 45,
    borderRadius: 11,
    backgroundColor:
      COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'center',
  },

  photoButtonText: {
    color:
      COLORS.white,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },

  galleryButton: {
    width: '48%',
    minHeight: 45,
    borderRadius: 11,
    backgroundColor:
      COLORS.white,
    borderWidth: 1,
    borderColor:
      COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'center',
  },

  galleryButtonText: {
    color:
      COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },

  photoPreviewBox: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor:
      COLORS.background,
    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  photoPreview: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },

  reviewOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 20,
  },

  reviewCard: {
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
  },

  reviewTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },

  reviewContent: {
    flexGrow: 0,
  },

  reviewPhoto: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 14,
  },

  reviewNoPhoto: {
    color: COLORS.secondary,
    fontSize: 12,
    marginBottom: 12,
  },

  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  reviewBackButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    marginRight: 8,
  },

  reviewBackText: {
    color: COLORS.text,
    fontWeight: '700',
  },

  reviewSaveButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 9,
    marginLeft: 8,
  },

  reviewSaveText: {
    color: COLORS.white,
    fontWeight: '700',
  },

  photoActions: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    padding: 10,
  },

  secondaryButton: {
    width: '48%',
    minHeight: 43,
    borderRadius: 10,
    borderWidth: 1,
    borderColor:
      COLORS.primary,
    backgroundColor:
      COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'center',
  },

  secondaryButtonText: {
    color:
      COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 5,
  },

  deleteButton: {
    width: '48%',
    minHeight: 43,
    borderRadius: 10,
    borderWidth: 1,
    borderColor:
      '#F3B8B8',
    backgroundColor:
      '#FFF7F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'center',
  },

  deleteButtonText: {
    color:
      COLORS.danger,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 5,
  },

  // consent styles

  consentRow: {
    flexDirection: 'row',
    alignItems:
      'flex-start',
    marginBottom: 5,
    paddingTop: 2,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor:
      '#94A794',
    backgroundColor:
      COLORS.white,
    alignItems: 'center',
    justifyContent:
      'center',
    marginRight: 9,
  },

  checkboxChecked: {
    backgroundColor:
      COLORS.primary,
    borderColor:
      COLORS.primary,
  },

  consentText: {
    flex: 1,
    color:
      COLORS.text,
    fontSize: 11,
    lineHeight: 17,
  },

  // submit styles

  submitButton: {
    minHeight: 53,
    borderRadius: 13,
    backgroundColor:
      COLORS.darkGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'center',
    marginTop: 15,
  },

  submitButtonText: {
    color:
      COLORS.white,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 7,
  },

  // records styles

  totalRecordsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 15,
    marginBottom: 18,
  },

  totalRecordsIcon: {
    width: 58,
    height: 58,
    borderRadius: 15,
    backgroundColor:
      COLORS.lightGreen,
    alignItems: 'center',
    justifyContent:
      'center',
    marginRight: 12,
  },

  totalRecordsTitle: {
    color:
      COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },

  totalRecordsNumber: {
    color:
      COLORS.darkGreen,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 3,
  },

  recordList: {
    marginBottom: 30,
  },

  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 10,
    marginBottom: 10,
  },

  recordListImage: {
    width: 70,
    height: 70,
    borderRadius: 11,
    resizeMode: 'cover',
  },

  recordListPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 11,
    backgroundColor:
      COLORS.background,
    alignItems: 'center',
    justifyContent:
      'center',
  },

  recordCardText: {
    flex: 1,
    marginHorizontal: 10,
  },

  recordVendorName: {
    color:
      COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },

  recordSmallText: {
    color:
      COLORS.secondary,
    fontSize: 10,
    marginTop: 3,
  },

  recordCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  recordDateText: {
    color:
      COLORS.secondary,
    fontSize: 9,
    marginLeft: 7,
    fontWeight: '600',
  },

  emptyRecords: {
    alignItems: 'center',
    backgroundColor:
      COLORS.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 30,
  },

  emptyRecordsIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor:
      COLORS.background,
    alignItems: 'center',
    justifyContent:
      'center',
    marginBottom: 13,
  },

  emptyRecordsTitle: {
    color:
      COLORS.text,
    fontSize: 17,
    fontWeight: '800',
  },

  emptyRecordsText: {
    color:
      COLORS.secondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 16,
  },

  // details styles

  detailsPhoto: {
    width: '100%',
    height: 270,
    resizeMode: 'cover',
    backgroundColor:
      '#DDE6DE',
  },

  detailsPhotoPlaceholder: {
    width: '100%',
    height: 270,
    backgroundColor:
      '#E8EEE8',
    alignItems: 'center',
    justifyContent:
      'center',
  },

  detailsNoPhotoText: {
    marginTop: 9,
    color:
      COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },

  detailsCard: {
    margin: 16,
    backgroundColor:
      COLORS.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 16,
  },

  detailsTitleRow: {
    flexDirection: 'row',
    alignItems:
      'flex-start',
  },

  detailsVendor: {
    color:
      COLORS.text,
    fontSize: 20,
    fontWeight: '900',
  },

  detailsSubTitle: {
    color:
      COLORS.secondary,
    fontSize: 11,
    marginTop: 3,
  },

  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.lightGreen,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginLeft: 8,
  },

  completedText: {
    color:
      COLORS.primary,
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 4,
  },

  detailsDivider: {
    height: 1,
    backgroundColor:
      COLORS.border,
    marginVertical: 15,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems:
      'flex-start',
    marginBottom: 14,
  },

  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor:
      COLORS.lightGreen,
    alignItems: 'center',
    justifyContent:
      'center',
    marginRight: 9,
  },

  detailTextBox: {
    flex: 1,
  },

  detailLabel: {
    color:
      COLORS.secondary,
    fontSize: 10,
    fontWeight: '700',
  },

  detailValue: {
    color:
      COLORS.text,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
    lineHeight: 18,
  },

  detailsMissing: {
    flex: 1,
    alignItems: 'center',
    justifyContent:
      'center',
    backgroundColor:
      COLORS.background,
    padding: 25,
  },

  detailsMissingTitle: {
    color:
      COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },

  detailsMissingText: {
    color:
      COLORS.secondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
});