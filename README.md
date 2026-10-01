# MOB_A1_G13 - Musanze Safe Market Field Inspection Prototype

## Course
SWE 3409 - Mobile Application Development

## Assignment
Assignment 1 - Musanze Safe Market Field Inspection Prototype

## Group
Group 13

## Verification Code
MOB-G13-7341

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
- Inspection details include the photo when available, stall, category, zone, contact, risk level, priority, date, time, and consent.

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
├── App.tsx
├── README.md
├── package.json
├── package-lock.json
├── app.json
├── index.js
├── src/
│   └── App.tsx
├── assets/
│   └── musanze-safe-market.png
├── components/
│   └── AssetExample.js
├── evidence/
│   ├── AI_USE.md
│   ├── TEST_LOG.md
│   ├── TEST_LOG.pdf
│   └── MOB_A1_G13_DEMO.mp4
├── screenshots/
│   ├── 01_home_market_catalog.jpeg
│   ├── 02_records_empty_state.jpeg
│   ├── 03_form_validation_errors.jpeg
│   ├── 04_review_inspection.jpeg
│   ├── 05_saved_inspection_records.jpeg
│   └── 06_inspection_details.jpeg
├── MOB_A1_G13_UIUX.pdf
└── MOB_A1_G13_CONTRIBUTIONS.pdf
```

Root `App.tsx` is the Expo entry wrapper. `src/App.tsx` contains the main application implementation.

## How to Run

From the project folder, install dependencies and start Expo:

```sh
npm install
npx expo start
```

Scan the QR code using Expo Go on Android, or use the [Expo Snack version](https://snack.expo.dev/@nzerneste250/4ac0f6). Camera and gallery access require the corresponding device permissions.

## Testing

- Tested on an Android phone using Expo Go.
- Tested in Expo Snack.
- 20 documented tests passed.
- Test evidence is stored in [evidence/TEST_LOG.pdf](evidence/TEST_LOG.pdf).

## Final Team Roles

- NZAYISENGA Erneste - Product and UX Lead
- KIRENGA Alain Thierry - Interface Engineer
- INEZA Benitha - State and Navigation Engineer
- MANZI Cedrick - Device Integration, QA and Release Evidence Lead

## Evidence

- [evidence/MOB_A1_G13_DEMO.mp4](evidence/MOB_A1_G13_DEMO.mp4) - demonstration video.
- [evidence/AI_USE.md](evidence/AI_USE.md) - AI use disclosure.
- [evidence/TEST_LOG.pdf](evidence/TEST_LOG.pdf) - documented test evidence.
- `screenshots/` contains six final application screenshots listed in the project structure.

## Final Submission Documents

- [MOB_A1_G13_UIUX.pdf](MOB_A1_G13_UIUX.pdf)
- [MOB_A1_G13_CONTRIBUTIONS.pdf](MOB_A1_G13_CONTRIBUTIONS.pdf)

## GitHub Repository

[https://github.com/nzerneste250/MOB_A1_G13](https://github.com/nzerneste250/MOB_A1_G13)

## Final Commit Hash

Final Commit Hash:
TO BE UPDATED AFTER FINAL EVIDENCE COMMIT

## Known Limitations

- Records are stored only in memory during the current app session and are lost after a full app restart.
- There is no backend or database.
- Demonstration data is fictional.
- Camera and gallery functions depend on device permissions.
- Inspection status is always Completed.

## AI Disclosure

AI use is disclosed in [evidence/AI_USE.md](evidence/AI_USE.md).

## Final ZIP

Exclude local/generated folders from the final ZIP.
