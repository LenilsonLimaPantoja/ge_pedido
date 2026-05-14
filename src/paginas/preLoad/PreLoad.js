import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../componentes/Loading";
const PreLoad = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      handleVerificaVersao();
    }, [])
  );

  const handleVerificaVersao = async () => {
    var token = await AsyncStorage.getItem("@ge_pedido_online_token");
    if (token) {
      navigation.reset({
        index: 1,
        routes: [{ name: "RotasDrawer" }],
      });
    } else {
      navigation.reset({
        index: 1,
        routes: [{ name: "Login" }],
      });
    }
  };
  return (
    <Loading />
  );
};

export default PreLoad;
