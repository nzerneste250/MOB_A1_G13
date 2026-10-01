# MUSANZE SAFE MARKET
## TEST LOG

Course:
SWE 3409 - Mobile Application Development

Assignment:
Assignment 1 - Musanze Safe Market Field Inspection Prototype

Group:
Group 13

Group Verification Code:
MOB-G13-7341

Tested Application:
MOB_A1_G13

## Group Information

| Item | Information |
|---|---|
| Group | Group 13 |
| Verification Code | MOB-G13-7341 |
| Member 1 | NZAYISENGA Erneste - 25/27341 |
| Member 2 | MANZI Cedrick - 25/27196 |
| Member 3 | INEZA Benitha - 25/27123 |
| Member 4 | KIRENGA Alain Thierry - 25/27792 |

Test Environment:
- React Native with Expo
- Expo Go
- Android device
- Expo Snack / local Expo project

Testers:
All Group 13 members

Testing Team:
- NZAYISENGA Erneste - 25/27341
- MANZI Cedrick - 25/27196
- INEZA Benitha - 25/27123
- KIRENGA Alain Thierry - 25/27792

Test Date:
01 October 2026

Device Used:
Android phone using Expo Go

## Test Cases

| Test No. | Test Area | Test Procedure | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| Test 1 | App Launch | Open the application using Expo Go. | The application opens without a red error screen and the Group 13 verification code is visible. | The application opened successfully on the Android phone using Expo Go without a red error screen. The Group 13 verification code MOB-G13-7341 was visible in the application header. | PASS |
| Test 2 | Market Catalog | Open the Home screen and view the market catalog. | At least six fictional market stalls are shown. Each stall shows its name, category, status, inspection priority and image placeholder. | The Home screen displayed all six fictional market stalls from A01 to F06. The market catalog loaded correctly and the stall cards were visible with their market information and status. | PASS |
| Test 3 | Search and Empty State | Search for a market stall that does not exist. | The application shows a clear empty-state message and allows the search to be cleared. | The search was tested in Expo Snack web preview and on an Android phone using Expo Go. When a non-existing stall was searched, the application displayed the "No stalls found" empty-state message. After clearing the search, all six market stalls appeared again correctly. | PASS |
| Test 4 | Blank Form Validation | Open New Inspection and press Review Inspection without filling the required fields. | The application blocks the action and shows field-level validation messages. | The empty form was submitted for review. The application displayed field-level validation messages and blocked the review step. | PASS |
| Test 5 | Invalid Stall Selection | Open New Inspection and try to continue without selecting a valid market stall. | The application does not allow review without a valid stall selection and shows the stall validation message. | The New Inspection form was tested without selecting a valid stall. The application blocked the review step and displayed the stall validation message. | PASS |
| Test 6 | Invalid Phone Number | Enter an invalid fictional contact number. | The application shows a phone-number validation message and blocks the review step. | An invalid fictional phone number was entered. The application displayed a phone-number validation message and did not allow the inspection to continue to the review screen. | PASS |
| Test 7 | Missing Consent | Complete the form but leave consent unchecked. | The application shows a consent error and does not continue. | The required inspection information was completed while consent was left unchecked. The application displayed a consent validation message and blocked the review step. | PASS |
| Test 8 | Valid Form | Enter valid fictional vendor information, select a valid stall, enter a valid fictional Rwanda-style phone number, select risk level, priority, and confirm consent. | The application opens the Review Inspection screen and displays the entered information correctly. | Valid fictional vendor information was entered, including a valid stall, Rwanda-style fictional phone number, risk level, priority and consent. The application successfully opened the Review Inspection screen and displayed the entered information correctly. | PASS |
| Test 9 | Bottom Tab Navigation | Open Home, New Inspection and Records tabs. | All three bottom tabs open correctly. | The Home, New Inspection and Records tabs were opened on the Android phone. All three tabs opened correctly and navigation between them worked without errors. | PASS |
| Test 10 | Records Stack Navigation | Save an inspection, open Records and select one saved inspection. | Inspection Details opens. Pressing Back returns to Records and the session data remains available. | A valid inspection was saved and opened from the Records screen. Inspection Details opened correctly. Pressing Back returned to Records and the saved session data remained available. | PASS |
| Test 11 | Camera Permission | Use the Camera option when camera permission is not already granted. | The application requests permission. If permission is denied, a useful message and recovery option are shown. | The Camera option was tested on the Android phone. The application requested camera permission when required. When permission was not available, the application displayed a useful permission message and remained usable so the camera action could be tried again. | PASS |
| Test 12 | Gallery Permission | Use the Gallery option when gallery permission is not already granted. | The application requests gallery permission. If permission is denied, a useful message is shown. | The Gallery option was tested on the Android phone. The application requested media-library permission when required and displayed a useful message when permission was not available. | PASS |
| Test 13 | Camera Cancellation | Open the camera and cancel without taking a photo. | The application returns safely to the inspection form without adding or changing the inspection photo. | The camera was opened and cancelled without taking a photo. The application returned safely to the inspection form without adding or changing the inspection photo. | PASS |
| Test 14 | Gallery Cancellation | Open the gallery and cancel without selecting an image. | The application returns safely to the inspection form without adding or changing the inspection photo. | The gallery was opened and cancelled without selecting an image. The application returned safely to the inspection form without adding or changing the inspection photo. | PASS |
| Test 15 | Image Preview | Capture or select an image. | The selected image is displayed as a preview. | An inspection image was captured or selected on the Android phone. The selected image appeared correctly in the inspection form preview. | PASS |
| Test 16 | Replace Image | After selecting an image, use the Replace option. | The previous image can be replaced by another image. | After selecting an inspection image, the Replace option was tested. The existing image was successfully replaced with another image and the new image appeared in the preview. | PASS |
| Test 17 | Remove Image | After selecting an image, use the Remove option. | The selected image is removed from the form. | After selecting an inspection image, the Remove option was tested. The selected image was successfully removed from the inspection form. | PASS |
| Test 18 | Review Screen | Complete a valid inspection and open Review Inspection. | The review page displays vendor alias, stall code, category, contact number, risk level, consent, image if selected, date/time, and group verification code MOB-G13-7341. | A valid inspection was completed and Review Inspection was opened. The review screen correctly displayed the vendor alias, stall information, category, contact number, risk level, priority, consent, selected image, date, time and Group Verification Code MOB-G13-7341. | PASS |
| Test 19 | Save Record | Confirm and save a valid inspection. | The new inspection appears in the Records screen. | A valid inspection was confirmed and saved. The new inspection appeared correctly in the Records screen and could be opened to view its details. | PASS |
| Test 20 | Responsive Check | Test the application on a narrow Android screen and, if possible, increase the device font size. | Important content remains readable and usable without horizontal scrolling. | The application was tested on the Android phone using Expo Go. The main screens, forms, buttons, text and navigation remained readable and usable on the mobile screen without horizontal scrolling. | PASS |

## Final Test Summary

Total Tests:
20

Passed:
20

Failed:
0

To Confirm:
0

Known Problems:
No critical problems were found during the final manual testing on the Android phone.

## Group Confirmation

We confirm that the results written in this test log are based on tests performed by all Group 13 members on the submitted application.

Member 1:
NZAYISENGA Erneste - 25/27341

Member 2:
MANZI Cedrick - 25/27196

Member 3:
INEZA Benitha - 25/27123

Member 4:
KIRENGA Alain Thierry - 25/27792