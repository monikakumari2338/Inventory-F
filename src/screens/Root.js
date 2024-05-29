import {GestureHandlerRootView} from 'react-native-gesture-handler';
import App from '../../App';
import {AppRegistry} from 'react-native';
const Root = () => (
  <GestureHandlerRootView style={{flex: 1}}>
    <App />
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => Root);
