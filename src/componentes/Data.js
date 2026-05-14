import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import ButtonInput from "./ButtonInput";
export default function Data({ setValor, valor }) {
  const [datePicker, setDatePicker] = useState(new Date());
  const [show, setShow] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setValor(valor);
    }, [])
  );
  const handleData = (event, selectedDate) => {
    if (event.type == "dismissed") {
      return setShow(false);
    }
    const currentDate = selectedDate;
    setShow(false);
    setDatePicker(currentDate);
    setValor(
      `${currentDate?.getFullYear()}-${String(
        currentDate?.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDate?.getDate()).padStart(2, "0")}`
    );
  };

  return (
    <>
      <ButtonInput borderBottomWidth={true} funcao={() => setShow(true)} texto={valor?.split("-").reverse().join("/")} />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={datePicker}
          mode="date"
          onChange={handleData}
        />
      )}
    </>
  );
}
