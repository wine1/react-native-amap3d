import * as React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MapView } from "react-native-amap3d";

export default class extends React.Component {
  state = { logs: [] };

  async componentDidMount() {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  }

  log(event: string, data: any) {
    console.log(data);
    this.setState({
      logs: [
        {
          key: Date.now().toString(),
          time: new Date().toLocaleString(),
          event,
          data: JSON.stringify(data, null, 2),
        },
        ...this.state.logs,
      ],
    });
  }

  logger(name: string) {
    return ({ nativeEvent }: NativeSyntheticEvent<any>) => this.log(name, nativeEvent);
  }

  renderItem = ({ item }: ListRenderItemInfo<any>) => (
    <Text style={style.logText}>
      {item.time} {item.event}: {item.data}
    </Text>
  );

  render() {
    const events = ["onLoad", "onPress", "onPressPoi", "onLongPress", "onCameraIdle"];
    return (
      <View style={style.body}>
        <MapView
          {...Object.fromEntries(events.map((i) => [i, this.logger(i)]))}
          myLocationEnabled
          style={style.body}
        />
        <FlatList style={style.logs} data={this.state.logs} renderItem={this.renderItem} />
      </View>
    );
  }
}

const style = StyleSheet.create({
  body: { flex: 1 },
  logs: {
    elevation: 8,
    flex: 1,
    backgroundColor: "#fff",
  },
  logText: {
    fontFamily: Platform.OS === "ios" ? "menlo" : "monospace",
    fontSize: 12,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
});