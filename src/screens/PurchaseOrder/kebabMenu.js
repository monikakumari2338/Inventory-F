import DocumentPicker from 'react-native-document-picker';
import React from 'react';
import {View, Button, Text} from 'react-native';
/* toggle includeExtra */
const includeExtra = true;

export default function KebabMenu() {
  // Function to handle file picking
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res);
      // Handle the picked file (e.g., upload it)
      console.log(
        'URI : ' + res[0].uri,
        'Type : ' + res.type, // mime type
        'File Name : ' + res.name,
        'File Size : ' + res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled the picker');
      } else {
        // Error occurred
        console.log('Error occurred:', err);
      }
    }
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Click the button to pick a file from your device</Text>
      <Button title="Pick File" onPress={pickFile} />
    </View>
  );
}
