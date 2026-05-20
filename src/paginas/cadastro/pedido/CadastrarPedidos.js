import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InputComponent from "../../../componentes/InputComponent";
import ModalAlert from "../../../componentes/ModalAlert"
import { useContext, useEffect, useState } from "react";
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import SelectCliente from "../../select/SelectCliente";
import Loading from "../../../componentes/Loading";
import AreaModalBtnInput from "../../../componentes/AreaModalBtnInput";
import ButtonInput from "../../../componentes/ButtonInput";
import Data from "../../../componentes/Data";
import SelectFormaPagamento from "../../select/SelectFormaPagamento";
import SelectProduto from "../../select/SelectProduto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis from "../../../Apis";
import AppBarModalClose from "../../../componentes/AppBarModalClose";
import { axiosConfig } from "../../../axiosConfig";
import { ContextGlobal } from "../../../context/GlobalContext";
import DataTableParcela from "../../../componentes/DataTableParcela";
import SelectTipoPedido from "../../select/SelectTipoPedido";

const CadastrarPedidos = ({ funcao, openModal, reloadPedido, setReloadPedido }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [openCloseModalSelectCliente, setOpenCloseModalSelectCliente] = useState(false);
    const [openCloseModalSelectFormaPagamento, setOpenCloseModalSelectFormaPagamento] = useState(false);
    const [openCloseModalSelectProduto, setOpenCloseModalSelectProduto] = useState(false);
    const [openCloseModalInformacaoProduto, setOpenCloseModalInformacaoProduto] = useState(false);
    const [openCloseModalItensPedido, setOpenCloseModalItensPedido] = useState(false);
    const [openCloseModalRemoverItensPedido, setOpenCloseModalRemoverItensPedido] = useState(false);
    const [openCloseModalTipoPedido, setOpenCloseModalTipoPedido] = useState(false);
    const [etapa, setEtapa] = useState(1);
    const [parcelas, setParcelas] = useState([]);
    const [loadingPedido, setLoadingPedido] = useState(false);
    // produto
    const [descricaoComplementar, setDescricaoComplementar] = useState();
    const [quantidadeProdPedido, setQuantidadeProdPedido] = useState();
    const [descontoProdPedido, setDescontoProdPedido] = useState();
    const [precoProdPedidoCopy, setPrecoProdPedidoCopy] = useState();
    const [precoProdPedido, setPrecoProdPedido] = useState();
    const [produtosPedido, setProdutosPedido] = useState([]);
    const [produtoRemoverPedido, setProdutoRemoverPedido] = useState({});
    const [observacoesPedido, setObservacoesPedido] = useState();
    const [numPedidoCli, setNumPedidoCli] = useState();
    const [nomeclientes, setNomeClientes] = useState();
    const [qtdParcelas, setQtdParcelas] = useState();
    const [totalPedido, setTotalPedido] = useState(0);
    const [totalDesconto, setTotalDesconto] = useState(0);

    const data = new Date();
    const ano = data.getFullYear();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    // const [dataPedido, setDataPedido] = useState(`${ano}-${mes}-${dia}`);
    const [dataFaturamentoPedido, setDataFaturamentoPedido] = useState(`${ano}-${mes}-${dia}`);
    const [cliente, setCliente] = useState();
    const [tipoPedido, setTipoPedido] = useState(2);
    const [formaPagamento, setFormaPagamento] = useState();
    const [produto, setProduto] = useState();
    const [parametrosPermissoes, setParametrosPermissoes] = useState();
    const [parcelaClicada, setParcelaClicada] = useState({});
    const [dataParcelaShow, setDataParcelaShow] = useState(false);

    const handleEtapa = (opcao) => {
        verificarToken();
        dataParametros();
        if (opcao === 0) {
            setEtapa(etapa - 1);
        }
        if (opcao === 1) {
            if (tipoPedido === 2) {
                Alert.alert('ATENÇÃO', 'Selecione um tipo de pedido para continuar', [{ onPress: () => null, text: 'fechar' }, { onPress: () => setOpenCloseModalTipoPedido(true), text: 'selecionar' }]);
                return
            }
            if (!cliente) {
                Alert.alert('ATENÇÃO', 'Selecione um cliente para continuar', [{ onPress: () => null, text: 'fechar' }, { onPress: () => setOpenCloseModalSelectCliente(true), text: 'selecionar' }]);
                return
            }
            if (etapa === 2 && produtosPedido?.length < 1) {
                Alert.alert('ATENÇÃO', 'Adicione ao menos 1 item para continuar', [{ onPress: () => null, text: 'fechar' }, { onPress: () => setOpenCloseModalSelectProduto(true), text: 'selecionar' }]);
                return
            }
            if (etapa === 3 && !formaPagamento) {
                Alert.alert('ATENÇÃO', 'Adicione uma forma de pagamento para continuar', [{ onPress: () => null, text: 'fechar' }, { onPress: () => setOpenCloseModalSelectFormaPagamento(true), text: 'selecionar' }]);
                return
            }
            setEtapa(etapa + 1);
        }
    }


    useEffect(() => {
        const dataFormaPagamento = async () => {
            setLoadingPedido(true);
            try {
                const response = await axiosConfig.post(Apis.urlReadFormasPgtoOne, { id: cliente?.forma_pagto_id });
                setFormaPagamento(response?.data?.registros[0]);
            } catch (error) {
                console.log(error.response?.data);
            }
            finally {
                setLoadingPedido(false);
            }
        }

        if (cliente?.forma_pagto_id > 0) {
            dataFormaPagamento();
        }

        dataParametros();
        setTotalPedido(0);
        setProdutosPedido([]);
        setObservacoesPedido();
        setNumPedidoCli();
        setTotalDesconto(0);
        setQtdParcelas();
        setProduto();
        setPrecoProdPedido();
        setQuantidadeProdPedido();
        setDescricaoComplementar();
        setDescontoProdPedido();
    }, [cliente, openModal]);

    const dataParametros = async () => {
        try {
            const response = await axiosConfig.get(Apis.urlReadParametros);

            setParametrosPermissoes(response?.data.registros);
        } catch (error) {
            console.log(error.response?.data);
        }
    }

    const handleAddProdPedido = () => {
        verificarToken();
        console.log('Produto', produto);

        const produtoExiste = produtosPedido.filter(item => item?.codpro == produto?.codigo);

        if (produtoExiste?.length > 0) {
            Alert.alert('ATENÇÃO', 'Esse produto já foi adicionado ao pedido, para alterar os dados, você deve remover o item e adiciona-lo novamente com as novas informações.', [{ onPress: () => null, text: 'entendi' }]);
            return
        }

        if (parseFloat(precoProdPedido) < parseFloat(precoProdPedidoCopy) && parametrosPermissoes?.altera_preco_pedido == 2 && tipoPedido == 0) {
            Alert.alert('ATENÇÃO', 'Você não tem permisão para alterar o valor do produto para baixo', [{ onPress: () => null, text: 'entendi' }]);
            return
        }

        if (!quantidadeProdPedido || !precoProdPedido || quantidadeProdPedido == 0 || precoProdPedido < 0) {
            Alert.alert('ATENÇÃO', 'Preencha todos os campos para adiconar o item ao pedido (quantidade e preço).', [{ text: 'entendi', onPress: () => null }]);
            return
        }

        if (parseFloat(descontoProdPedido) >= parseFloat(quantidadeProdPedido * precoProdPedido)) {
            Alert.alert('ATENÇÃO', `O valor do desconto deve ser menor que o valor total do item (${parseFloat(quantidadeProdPedido * precoProdPedido).toFixed(2)}).`, [{ text: 'entendi', onPress: () => null }]);
            return
        }

        const descontoInformado = Number(descontoProdPedido || 0);
        const percentualPermitido = Number(produto?.perc_desconto || 0);
        const valorUnitario = Number(precoProdPedido || 0);
        const quantidade = Number(quantidadeProdPedido || 0);

        // valor total do item
        const valorTotalItem = valorUnitario * quantidade;

        // desconto máximo permitido em reais
        const descontoMaximo = (valorTotalItem * percentualPermitido) / 100;

        if (descontoInformado > descontoMaximo) {
            Alert.alert(
                'ATENÇÃO',
                `O desconto não deve ultrapassar R$ ${descontoMaximo.toFixed(2)} (${percentualPermitido.toFixed(2)}%) do valor total (R$ ${valorTotalItem.toFixed(2)}).`,
                [{ text: 'Entendi' }]
            );

            return;
        }

        setTotalPedido(
            (
                (parseFloat(precoProdPedido) * parseFloat(quantidadeProdPedido) -
                    parseFloat(descontoProdPedido || 0) + parseFloat(totalPedido))
            ).toFixed(2)
        );
        setTotalDesconto(
            (parseFloat(descontoProdPedido || 0) + parseFloat(totalDesconto)).toFixed(2)
        );

        const prodTemp = {
            desconto: descontoProdPedido || 0,
            descricao: produto?.descricao,
            qt: quantidadeProdPedido,
            descricao_complementar: descricaoComplementar,
            preco: precoProdPedido,
            codpro: produto.codpro || produto.codigo,
            id_unico: `${data.getMilliseconds()}${data.getTime()}`,
        };

        if (produtosPedido.length > 0) {
            setProdutosPedido([...produtosPedido, prodTemp]);
        } else {
            setProdutosPedido([prodTemp]);

        }
        setOpenCloseModalInformacaoProduto(false)
        setProduto();
        setPrecoProdPedido();
        setQuantidadeProdPedido();
        setDescricaoComplementar();
        setDescontoProdPedido();
    }

    const handleClickItemPedido = (item) => {
        setOpenCloseModalRemoverItensPedido(true);
        setProdutoRemoverPedido(item);
        dataParametros();
    }

    const handleConfirmarRemoverItemPedido = () => {
        for (var i = 0; i < produtosPedido.length; i++) {
            if (produtosPedido[i].id_unico === produtoRemoverPedido?.id_unico) {
                setTotalPedido(
                    (
                        parseFloat(totalPedido) -
                        (parseFloat(produtosPedido[i].qt) *
                            parseFloat(produtosPedido[i].preco) -
                            parseFloat(produtosPedido[i].desconto))
                    ).toFixed(2)
                );
                setTotalDesconto(
                    (
                        parseFloat(totalDesconto) - parseFloat(produtosPedido[i].desconto)
                    ).toFixed(2)
                );
            }
        }

        let itensPedidoCopy = produtosPedido?.filter((item) => item?.id_unico != produtoRemoverPedido?.id_unico);
        setProdutosPedido(itensPedidoCopy);
        setOpenCloseModalRemoverItensPedido(false);
    }

    const handleSalvarPedido = async () => {
        verificarToken();
        const dadosBody =
        {
            forma_pagamento_id: formaPagamento?.id,
            vendedor_id: await AsyncStorage.getItem('@ge_pedido_online_representante_id'),
            qt_parcelas: qtdParcelas || 1,
            total: parseFloat(parseFloat(totalPedido * ((100 - parseFloat(cliente?.perc_desconto)) / 100)) + parseFloat(totalDesconto)).toFixed(2),
            total_desconto: totalDesconto,
            liquido: parseFloat(parseFloat(totalPedido) * ((100 - parseFloat(cliente?.perc_desconto)) / 100)).toFixed(2),
            parcelas: parcelas,
            // data: dataPedido,
            obs: observacoesPedido,
            num_pedido_cli: numPedidoCli,
            cliente_id: cliente?.id,
            produtos: produtosPedido,
            nome_cliente: nomeclientes,
            cliente: cliente,
            tipo: tipoPedido, // 0 = venda, 1 = troca
        };


        if (cliente && produtosPedido.length > 0 && formaPagamento) {
            setLoadingPedido(true);
            try {
                const response = await axiosConfig.post(Apis.urlCreatePedidos, dadosBody);

                funcao();
                setCliente();
                setTipoPedido(2);
                setTotalPedido(0);
                setProdutosPedido([]);
                setObservacoesPedido();
                setNumPedidoCli();
                setTotalDesconto(0);
                setQtdParcelas();
                setFormaPagamento();
                setEtapa(1);
                Alert.alert('SUCESSO', response?.data.retorno.mensagem, [{ text: 'confirmar', onPress: () => setLoadingPedido(false) }]);
                console.log(response.data);
            } catch (error) {
                funcao();
                console.log(error.response.data);

                Alert.alert('ATENÇÃO', error.response?.data.retorno.mensagem, [{ text: 'confirmar', onPress: () => setLoadingPedido(false) }]);
            }
            finally {
                setReloadPedido(!reloadPedido)
            }
        } else {
            Alert.alert('ATENÇÃO', 'Preencha todos os campos para realizar o pedido (cliente, forma de pagamento e ao menos 1 item).', [{ onPress: () => setLoadingPedido(false), text: 'entendi' }])
        }

    }

    const handleParcelamento = async () => {
        let valorParcelas = parseFloat(parseFloat(totalPedido * ((100 - parseFloat(cliente?.perc_desconto)) / 100)) / parseInt(qtdParcelas)).toFixed(2);
        const parcelasCopy = [];
        let dataParcela = new Date(dataFaturamentoPedido);

        for (let i = 0; i < qtdParcelas; i++) {
            // Adiciona 30 dias à data da próxima parcela
            dataParcela.setDate(dataParcela.getDate() + 30);

            // Formata a data para o formato 'YYYY-MM-DD'
            let prcl = new Date(dataParcela);
            let dataFormatada = prcl.toISOString().split('T')[0];

            parcelasCopy.push({ "parcela": i + 1, "vencimento": dataFormatada, "valor": valorParcelas });
        }

        if (!qtdParcelas) {
            parcelasCopy.push({ "parcela": 1, "vencimento": dataFaturamentoPedido, "valor": parseFloat(totalPedido * ((100 - parseFloat(cliente?.perc_desconto)) / 100)) });
        }
        setParcelas(parcelasCopy);

        handleEtapa(1);
    }

    const handleClickParcelamento = async (item) => {
        setParcelaClicada(item);
        setDataParcelaShow(true);
    }

    const handleSelectCliente = () => {
        verificarToken();
        setOpenCloseModalSelectCliente(true);
    }
    const handleSelectProduto = () => {
        verificarToken();
        setOpenCloseModalSelectProduto(true);
    }
    const handleSelectFormaPgto = () => {
        verificarToken();
        setOpenCloseModalSelectFormaPagamento(true);
    }
    return (
        <>
            {loadingPedido ?
                <Modal visible={loadingPedido} onRequestClose={() => setLoadingPedido(false)}>
                    <Loading />
                </Modal>
                :
                <ModalAlert ocultarInfoGe={true} funcao={etapa > 1 ? () => handleEtapa(0) : funcao} openModal={openModal} scroll={true} >
                    <AppBarModalClose funcao={etapa > 1 ? () => handleEtapa(0) : funcao} texto={`${etapa === 1 ? 'PEDIDO' : ''}${etapa === 2 ? 'ITEM DO PEDIDO' : ''}${etapa === 3 ? 'FINANCEIRO' : ''}${etapa === 4 ? 'CONDIÇÕES DE PAGAMENTO' : ''}${etapa === 5 ? 'RESUMO DO PEDIDO' : ''}`} />

                    <TouchableOpacity style={{ backgroundColor: '#3a97ed', height: 5, width: `${etapa * 20}%` }} />
                    <AreaModalBtnInput>
                        {etapa === 1 &&
                            <>
                                {/* <Data setValor={setDataPedido} valor={dataPedido} /> */}
                                <ButtonInput borderBottomWidth={true} texto={tipoPedido === 0 ? 'pedido de venda' : tipoPedido === 1 ? 'pedido de troca' : 'selecione o tipo de pedido'} funcao={() => setOpenCloseModalTipoPedido(true)} />
                                <SelectTipoPedido openClose={openCloseModalTipoPedido} setOpenClose={setOpenCloseModalTipoPedido} setTipoPedidoSelected={setTipoPedido} tipoPedidoSelected={tipoPedido} />
                                <ButtonInput borderBottomWidth={true} texto={cliente?.nome || 'selecionar cliente'} funcao={handleSelectCliente} />
                                {cliente?.generico == 1 && <InputComponent borderBottomWidth={true} placeholder='Nome generico' valor={nomeclientes} setValor={setNomeClientes} />}
                                <InputComponent placeholder='Nº pedido do cliente' valor={numPedidoCli} setValor={setNumPedidoCli} />
                            </>
                        }
                        {etapa === 2 &&
                            <>
                                {produtosPedido?.length > 0 && <ButtonInput borderBottomWidth={true} funcao={() => produtosPedido?.length > 0 ? setOpenCloseModalItensPedido(true) : null} texto={`mostrar itens (${produtosPedido?.length})`} />}
                                <ButtonInput texto='adicionar novo item ao pedido' funcao={handleSelectProduto} >
                                    <MaterialCommunityIcons name='plus' style={{ fontSize: 20, color: '#000' }} />
                                </ButtonInput>
                            </>
                        }
                        {etapa === 3 &&
                            <>
                                {parametrosPermissoes?.financeiro_venda == 0 &&
                                    <>
                                        <ButtonInput borderBottomWidth={true} texto={formaPagamento?.descricao || 'forma de pagamento'} funcao={handleSelectFormaPgto} />
                                        <Data setValor={setDataFaturamentoPedido} valor={dataFaturamentoPedido} />
                                        {formaPagamento?.parcelamento == 1 && totalPedido > 0 &&
                                            <>
                                                <InputComponent borderBottomWidth={true} placeholder='Parcelas' valor={qtdParcelas || 1} type='numeric' setValor={setQtdParcelas} />
                                                <ButtonInput borderBottomWidth={true} texto={`R$ ${parseFloat((totalPedido * ((100 - parseFloat(cliente?.perc_desconto)) / 100)) / (qtdParcelas || 1)).toFixed(2)}`} funcao={() => null} />
                                            </>
                                        }
                                    </>
                                }
                                <InputComponent placeholder='Observações' valor={observacoesPedido} setValor={setObservacoesPedido} />
                            </>
                        }
                        {etapa === 4 &&
                            <>
                                <View style={{ flexDirection: 'row', padding: 10, height: 50, alignItems: 'center' }}>
                                    <Text style={{ flexGrow: 1, minWidth: '23.23%', fontSize: 13, textAlign: 'center', fontWeight: '900' }}>Parc.</Text>
                                    <Text style={{ flexGrow: 1, minWidth: '23.23%', fontSize: 13, textAlign: 'center', fontWeight: '900' }}>Vencimento</Text>
                                    <Text style={{ flexGrow: 1, minWidth: '23.23%', fontSize: 13, textAlign: 'center', fontWeight: '900' }}>Valor</Text>
                                    <Text style={{ flexGrow: 1, minWidth: '10%', fontSize: 13, textAlign: 'center', fontWeight: '900' }}></Text>
                                </View>
                                {parametrosPermissoes?.financeiro_venda == 0 &&
                                    <View>
                                        {
                                            parcelas?.map((item, index) => (
                                                <TouchableOpacity onPress={() => handleClickParcelamento(item)} key={index} style={{ flexDirection: 'row', padding: 10, height: 50, borderTopWidth: 1, borderColor: '#d9d9d5', alignItems: 'center' }}>
                                                    <Text style={{ flexGrow: 1, minWidth: '23.23%', fontSize: 13, textAlign: 'center' }}>{item?.parcela}</Text>
                                                    <Text style={{ flexGrow: 1, minWidth: '23.23%', fontSize: 13, textAlign: 'center' }}>{item?.vencimento?.split('-').reverse().join('/')}</Text>
                                                    <Text style={{ flexGrow: 1, minWidth: '23.23%', fontSize: 13, textAlign: 'center' }}>R$ {item?.valor}</Text>
                                                    <Text style={{ flexGrow: 1, minWidth: '10%', fontSize: 13, textAlign: 'center' }}>
                                                        <MaterialCommunityIcons name="calendar-edit" style={{ fontSize: 17 }} />
                                                    </Text>
                                                </TouchableOpacity>
                                            ))
                                        }
                                        <DataTableParcela setShow={setDataParcelaShow} show={dataParcelaShow} objClicado={parcelaClicada} parcelas={parcelas} setParcelas={setParcelas} />
                                    </View>
                                }
                            </>
                        }
                        {etapa === 5 &&
                            <>
                                {/* <Text style={styles.itemConfirmarText}>{String(dataPedido)?.split('-').reverse().join('/')}</Text> */}
                                <Text style={styles.itemConfirmarText}>{cliente?.nome}</Text>
                                <Text style={styles.itemConfirmarText}>{cliente?.cnpj_cpf}</Text>
                                <Text style={styles.itemConfirmarText}>Pedido de {tipoPedido === 0 ? 'Venda' : 'Troca'}</Text>
                                {observacoesPedido && <Text style={styles.itemConfirmarText}>Obs: {observacoesPedido}</Text>}
                                <Text style={styles.itemConfirmarText}>{formaPagamento?.descricao}</Text>
                                <Text style={styles.itemConfirmarText}>{qtdParcelas || 1} x {parseFloat((totalPedido * ((100 - parseFloat(cliente?.perc_desconto)) / 100)) / (qtdParcelas || 1)).toFixed(2)} = R$ {parseFloat(totalPedido * ((100 - parseFloat(cliente?.perc_desconto)) / 100)).toFixed(2)}</Text>
                                <Text style={styles.itemConfirmarText}>Total: R$ {parseFloat(parseFloat(totalPedido * ((100 - parseFloat(cliente?.perc_desconto)) / 100)) + parseFloat(totalDesconto)).toFixed(2)}</Text>
                                <Text style={styles.itemConfirmarText}>Desconto: R$ {parseFloat(totalDesconto).toFixed(2)}</Text>
                                <Text style={{ padding: 15 }}>Liquido: R$ {parseFloat(totalPedido * ((100 - parseFloat(cliente?.perc_desconto)) / 100)).toFixed(2)}</Text>
                            </>
                        }
                    </AreaModalBtnInput>
                    {produtosPedido?.length > 0 && etapa < 5 &&
                        <AreaModalBtnInput>
                            <View style={{ height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>Total: R$ {parseFloat(totalPedido * ((100 - parseFloat(cliente?.perc_desconto)) / 100))?.toFixed(2)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>Desconto: R$ {parseFloat(totalDesconto)?.toFixed(2)}</Text>
                                </View>
                            </View>
                        </AreaModalBtnInput>
                    }

                    <ButtonInput color='#fff' texto={etapa === 5 ? 'finalizar' : 'seguinte'} bgColor={etapa === 5 ? '#4ac795' : '#3b97ee'}
                        funcao={
                            etapa === 3
                                ? () => handleParcelamento()
                                : etapa === 5
                                    ? handleSalvarPedido
                                    : () => handleEtapa(1)
                        }
                    >
                        <MaterialCommunityIcons name={etapa < 5 ? 'chevron-right' : 'content-save-outline'} style={{ fontSize: 20, color: '#fff' }} />
                    </ButtonInput>

                    {/* modal infomações do item */}
                    <ModalAlert openModal={openCloseModalInformacaoProduto} ocultarInfoGe={true} scroll={true} funcao={() => setOpenCloseModalInformacaoProduto(false)}>
                        <AppBarModalClose funcao={() => setOpenCloseModalInformacaoProduto(false)} texto='DADOS DO ITEM' />

                        <AreaModalBtnInput>
                            <ButtonInput texto={produto?.descricao} funcao={() => null} borderBottomWidth={true}>
                                <MaterialCommunityIcons name='chevron-right' style={{ fontSize: 20 }} />
                            </ButtonInput>
                            <InputComponent placeholder='Complemento' valor={descricaoComplementar} setValor={setDescricaoComplementar} borderBottomWidth={true} />
                            <InputComponent placeholder='Quantidade' valor={quantidadeProdPedido} setValor={setQuantidadeProdPedido} type='numeric' borderBottomWidth={true} />
                            {parametrosPermissoes?.permite_desconto == 0 && <InputComponent borderBottomWidth={true} placeholder='Desconto' valor={descontoProdPedido} setValor={setDescontoProdPedido} type='numeric' />}
                            {(parametrosPermissoes?.altera_preco_pedido == 0 && tipoPedido === 0) &&
                                <ButtonInput texto={precoProdPedido} funcao={() => null}>
                                    <MaterialCommunityIcons name='chevron-right' style={{ fontSize: 20 }} />
                                </ButtonInput>
                            }
                            {(parametrosPermissoes?.altera_preco_pedido > 0 || tipoPedido === 1) && <InputComponent placeholder='Valor' valor={precoProdPedido} setValor={setPrecoProdPedido} type='numeric' />}
                        </AreaModalBtnInput>
                        <ButtonInput color='#fff' texto='adicionar item ao pedido' bgColor='#fd6c03' funcao={handleAddProdPedido}>
                            <MaterialCommunityIcons name='plus' style={{ fontSize: 20, color: '#fff' }} />
                        </ButtonInput>
                    </ModalAlert>

                    {/* modal itens do pedido */}
                    {produtosPedido?.length > 0 &&
                        <ModalAlert ocultarInfoGe={true} scroll={true} openModal={openCloseModalItensPedido} funcao={() => setOpenCloseModalItensPedido(false)}>
                            <AppBarModalClose funcao={() => setOpenCloseModalItensPedido(false)} texto='ITENS DO PEDIDO' />

                            <View>
                                {produtosPedido?.map((item, index) => (
                                    <TouchableOpacity key={index} onPress={() => handleClickItemPedido(item)} activeOpacity={0.5} style={[styles.item, { borderTopWidth: index === 0 ? .5 : 0, borderColor: '#d9d9d5' }]}>
                                        <View style={styles.item.itemLeft}>
                                            <Text style={styles.item.itemLeft.descricao}>{item?.descricao}</Text>
                                            <Text style={styles.item.itemLeft.calcTotal}>{item?.qt} x {parseFloat(item?.preco).toFixed(2)} - {parseFloat(item?.desconto).toFixed(2)}</Text>
                                            <Text style={styles.item.itemLeft.situacao}>{item?.codigo || item.codpro}</Text>
                                        </View>
                                        <Text style={styles.item.total}>R$ {parseFloat(item?.preco * item?.qt - item?.desconto).toFixed(2)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ModalAlert>
                    }

                    {/* modal remover item do pedido */}
                    <ModalAlert ocultarInfoGe={true} openModal={openCloseModalRemoverItensPedido} funcao={() => setOpenCloseModalRemoverItensPedido(false)}>
                        <AppBarModalClose funcao={() => setOpenCloseModalRemoverItensPedido(false)} texto='REMOVER ITEM DO PEDIDO' />
                        <ButtonInput color='#fff' texto='remover item do pedido' bgColor='#fd6c03' funcao={handleConfirmarRemoverItemPedido}>
                            <MaterialCommunityIcons name='delete' style={{ fontSize: 20, color: '#fff' }} />
                        </ButtonInput>
                    </ModalAlert>
                    <SelectCliente openClose={openCloseModalSelectCliente} setCliente={setCliente} setOpenClose={setOpenCloseModalSelectCliente} />
                    <SelectFormaPagamento openClose={openCloseModalSelectFormaPagamento} setOpenClose={setOpenCloseModalSelectFormaPagamento} setFormaPagamento={setFormaPagamento} />
                    <SelectProduto setLoadingCadPedido={setLoadingPedido} dataParametros={dataParametros} setPrecoCopy={setPrecoProdPedidoCopy} setPreco={setPrecoProdPedido} setOpenCloseModalInformacaoProduto={setOpenCloseModalInformacaoProduto} openClose={openCloseModalSelectProduto} setOpenClose={() => setOpenCloseModalSelectProduto(false)} setProduto={setProduto} tabela_preco_id={cliente?.tabela_preco_id} />
                </ModalAlert>
            }
        </>
    )
}
export default CadastrarPedidos;
const styles = StyleSheet.create({
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textAppBar: {
        fontSize: 13,
    },
    item: {
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#d9d9d5',
        itemLeft: {
            flex: 1,
            numData: {
                color: 'gray',
                marginBottom: 10,
                fontSize: 10
            },
            descricao: {
                fontWeight: '900',
                fontSize: 12,
                flex: 1,
                maxWidth: '85%',
            },
            calcTotal: {
                color: 'gray',
                fontSize: 10,
            },
            situacao: {
                color: '#25d399',
                backgroundColor: '#cbf8ec',
                width: 100,
                textAlign: 'center',
                padding: 3,
                borderRadius: 5,
                marginTop: 10,
                fontSize: 10
            },
        },
        total: {
            fontSize: 12,
            fontWeight: '900',
        }
    },
    itemConfirmarText: {
        borderBottomWidth: 1,
        borderColor: '#d9d9d5',
        padding: 15
    }
})