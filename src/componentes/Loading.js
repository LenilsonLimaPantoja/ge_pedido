import React from "react";
import {
  View,
  StyleSheet,
  Image,
} from "react-native";
import carrinho from '../../assets/carrinho.gif';
const Loading = () => {
  return (
    <View style={styles.container}>
      <Image source={carrinho} style={{width: 50, height: 40}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default Loading;
