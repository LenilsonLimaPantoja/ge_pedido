import DateTimePicker from "@react-native-community/datetimepicker";
import { Alert } from "react-native";
export default function DataTableParcela({ setShow, show, objClicado, parcelas, setParcelas }) {
  const handleData = (event, selectedDate) => {
    if (event.type == "dismissed") {
      return setShow(false);
    }
    const currentDate = selectedDate;
    setShow(false);
    const data = `${currentDate?.getFullYear()}-${String(
      currentDate?.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate?.getDate()).padStart(2, "0")}`;
    (data);

    Alert.alert(
      'ATENÇÃO',
      `Deseja alterar o vencimento da parcela ${objClicado?.parcela} para ${data.split('-').reverse().join('/')}`,
      [
        {
          text: 'confirmar',
          onPress: () => {
            const parcelasCopy = parcelas?.map((item) => {
              if (item?.parcela == objClicado?.parcela) {
                item.vencimento = data;
              }
              return item
            })
            setParcelas(parcelasCopy);
          }
        },
        {
          text: 'cancelar',
          onPress: () => null
        }
      ]
    )
  };

  return (
    <>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          mode="date"
          onChange={handleData}
        />
      )}
    </>
  );
}
