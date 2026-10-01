# MOB_A1_G13 - Musanze Safe Market Field Inspection Prototype

## Course
SWE 3409 - Mobile Application Development

## Assignment
Assignment 1 - Musanze Safe Market Field Inspection Prototype

## Group
Group 13

## Verification Code
MOB-G13-7792

## Group Members
1. NZAYISENGA Erneste - 25/27341
2. MANZI Cedrick - 25/27196
3. INEZA Benitha - 25/27123
4. KIRENGA Alain Thierry - 25/27792

## Project Description
This is a fictional Musanze market field inspection prototype built with React Native and Expo. It is for academic demonstration only. Do not enter real personal or vendor data.

## Main Features
- Home screen with a searchable catalog of six fictional market stalls.
- Reusable market cards show the stall code, category, zone, and number of saved records.
- Selecting a stall displays its records or an empty state and provides a shortcut to a new inspection.
- Inspection form collects a vendor alias, stall, category, fictional contact number, risk level, priority, consent, and optional photo.
- Validated inspections can be reviewed before saving. Saved records show Completed status and are kept in memory for the current app session.
- Records can be viewed in a list and opened as inspection details.
- Inspection details include the photo when available, date, time, consent, and group verification code.

## Navigation
- **Home:** Search and browse the market catalog, view stall records, and begin an inspection for a selected stall.
- **New Inspection:** Enter and validate inspection details, add an optional photo, review the information, and confirm saving.
- **Records:** View saved inspections.
- **Records List -> Inspection Details:** Select a record to open its detail screen. The stack back button returns to the list without clearing the in-memory records.

## Validation
- Vendor alias is required and saved without leading or trailing spaces.
- A stall must be selected from the six-item market catalog. Its category is filled from that selection.
- Contact number is required, contains exactly 10 digits, and starts with 072, 073, 078, or 079. Non-digit input is removed as it is entered.
- Risk level must be selected as Low, Medium, or High.
- Priority must be selected as Low, Medium, or High.
- Vendor consent must be confirmed before review and saving.
- The inspection photo is optional.
- Each saved inspection is assigned the Completed status.

## Camera and Gallery
The form can capture a photo with the camera or select one from the gallery. The selected image is previewed and can be replaced or removed. If permission is denied, the app displays an alert. If the picker is cancelled, the form remains unchanged. Camera and gallery errors also display an alert.

## Review
After validation, a review screen shows the form values, optional image, timestamp, consent confirmation, and group verification code before anything is saved. The user can return to edit or confirm the save.

## Technologies Used
- React Native
- Expo
- React
- JavaScript with JSX (the entry component file uses the `.tsx` extension but contains no TypeScript type annotations)
- React Navigation bottom tabs and native stack
- Expo ImagePicker
- Expo Vector Icons (Ionicons)
- React Native Safe Area Context

## Project Structure
```text
MOB_A1_G13/
|-- .gitignore
|-- App.tsx
|-- README.md
|-- app.json
|-- index.js
|-- package-lock.json
|-- package.json
|-- assets/
|   |-- adaptive-icon.png
|   |-- favicon.png
|   |-- icon.png
|   |-- musanze-safe-market.png
|   `-- splash-icon.png
`-- components/
	`-- AssetExample.js
```

## How to Run
From the project folder, install dependencies and start Expo:

```sh
npm install
npx expo start
```

Scan the Expo QR code with Expo Go on Android to open the app. Camera and gallery access require granting the corresponding device permissions.

Expo Snack: https://snack.expo.dev/@nzerneste250/4ac0f6

## Tested Environment
- React Native with Expo, as configured in the project files.
- Expo Go / Expo Snack is the intended demonstration environment.
- Android testing is intended. A device-level test was not run in this workspace.

## Team Roles

### Member 1: NZAYISENGA Erneste
**Role:** Product and UX Lead

Responsibilities:
- scenario interpretation
- task flow
- wireframes
- visual system
- accessibility decisions
- UI/UX documentation

### Member 2: MANZI Cedrick
**Role:** Interface Engineer

Responsibilities:
- catalog screen
- reusable cards
- Flexbox layout
- empty state
- responsive interface

### Member 3: INEZA Benitha
**Role:** State and Navigation Engineer

Responsibilities:
- validated form
- controlled inputs
- bottom tabs
- stack navigation
- typed route parameters

### Member 4: KIRENGA Alain Thierry
**Role:** Device Integration and QA Lead

Member 4 also owns release evidence because this is a four-member group.

Responsibilities:
- camera
- image picker
- permission and cancellation handling
- end-to-end testing
- README
- demonstration video
- final release evidence

## GitHub Repository
GitHub Repository URL:
https://github.com/nzerneste250/MOB_A1_G13

## Final Commit Hash
Final Commit Hash:
TO_BE_ADDED_AFTER_FINAL_PUSH

## Required Submission Evidence
The following items are required for submission and are not present in this project folder yet:
- `evidence/AI_USE.md`
- `TEST_LOG.pdf`
- screenshots
- demonstration video

## Known Limitations
- Records are stored in memory only and are lost after a full app restart.
- The app has no backend or database.
- The project is an academic prototype and uses fictional data only.
- Inspection status is always Completed.
- Device camera, gallery, and Android behavior still need end-to-end testing on a physical or suitable test device.

## AI Use
Generative AI was used for explanation, debugging and development support. Full disclosure should be provided in `evidence/AI_USE.md`; this required submission file is not present yet.
