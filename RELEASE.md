1. Bump version on app.json
2. npx expo prebuild

Android:
1. eas build -p android --local
2. upload manually

iOS:
1. eas build -p ios
2. eas submit --platform ios
