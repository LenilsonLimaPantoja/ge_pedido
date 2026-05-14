import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Button } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';

const logFilePath = FileSystem.documentDirectory + 'log.json';

// Função para salvar o log em um arquivo
export const saveLog = async (jsonLog) => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(logFilePath);

        if (fileInfo.exists) {
            const existingContent = await FileSystem.readAsStringAsync(logFilePath);
            const existingLogs = JSON.parse(existingContent);
            existingLogs.push(JSON.parse(jsonLog));
            await FileSystem.writeAsStringAsync(logFilePath, JSON.stringify(existingLogs, null, 2));
        } else {
            await FileSystem.writeAsStringAsync(logFilePath, JSON.stringify([JSON.parse(jsonLog)], null, 2));
        }
    } catch (error) {
        console.error('Erro ao salvar o log:', error);
    }
};

// Função para compartilhar o arquivo
export const shareLogFile = async () => {
    try {
        if (!(await Sharing.isAvailableAsync())) {
            console.log('Sharing is not available on this platform');
            return;
        }

        const fileInfo = await FileSystem.getInfoAsync(logFilePath);
        if (fileInfo.exists) {
            await Sharing.shareAsync(logFilePath);
        } else {
            console.log('File does not exist');
        }
    } catch (error) {
        console.error('Erro ao compartilhar o arquivo:', error);
    }
};

const exemploPedido = {
    timestamp: new Date().toISOString(),
    event: "Pedido Criado",
    forma_pagamento_id: 25,
    vendedor_id: 89,
    qt_parcelas: 1,
    total: 56,
    total_desconto: 12,
    liquido: 44,
    data: "24/05/1997",
    obs: "teste",
    num_pedido_cli: 1234,
    cliente_id: 1,
    produtos: [
        {
            id: 2,
            valor: 15,
            quantidade: 15,
            descricao: "teste",
            desconto: 2
        }
    ]
};

const Log = () => {
    const logPedido = async () => {
        await saveLog(JSON.stringify(exemploPedido, null, 2));
    };
    return (
        <View>
            <Text>Check your logs!</Text>
            <Button title="Share Log" onPress={shareLogFile} />
            <Button title="add" onPress={logPedido} />
        </View>
    )
}
export default Log;