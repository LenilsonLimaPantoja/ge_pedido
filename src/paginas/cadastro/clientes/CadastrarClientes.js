import { Alert, Modal, TouchableOpacity } from "react-native";
import InputComponent from "../../../componentes/InputComponent";
import ModalAlert from "../../../componentes/ModalAlert"
import { useContext, useEffect, useState } from "react";
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import SelectTipoCliente from "../../select/SelectTipoCliente";
import SelectDiaSemana from "../../select/SelectDiaSemana";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../../componentes/Loading";
import Apis from "../../../Apis";
import AreaModalBtnInput from "../../../componentes/AreaModalBtnInput";
import ButtonInput from "../../../componentes/ButtonInput";
import AppBarModalClose from "../../../componentes/AppBarModalClose";
import { axiosConfig } from "../../../axiosConfig";
import { ContextGlobal } from "../../../context/GlobalContext";
import SelectFormaPagamento from "../../select/SelectFormaPagamento";
import SelectRota from "../../select/SelectRota";

const CadastrarClientes = ({ setOpenClose, openModal, reloadCliente, setReloadCliente }) => {
    const { verificarToken } = useContext(ContextGlobal);
    const [openCloseModalTipoCliente, setOpenCloseModalTipoCliente] = useState(false);
    const [etapa, setEtapa] = useState(1);
    const [cnpjCpf, setCnpjCpf] = useState("");
    const [ieRg, setIeRg] = useState("");
    const [razao, setRazao] = useState("");
    const [fantasia, setFantasia] = useState("");
    const [cep, setCep] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numero, setNumero] = useState("");
    const [bairro, setBairro] = useState("");
    const [complemento, setComplemento] = useState("");
    const [cidade, setCidade] = useState("");
    const [codigoCidade, setCodigoCidade] = useState("");
    const [uf, setUf] = useState("");
    const [email, setEmail] = useState("");
    const [fone1, setFone1] = useState("");
    const [fone2, setFone2] = useState("");
    const [contato, setContato] = useState("");
    const [generico, setGenerico] = useState(0);
    const [loadingCliente, setLoadingCliente] = useState(false);
    const [openCloseModalSelectFormaPagamento, setOpenCloseModalSelectFormaPagamento] = useState(false);
    const [formaPagamento, setFormaPagamento] = useState();
    const [openCloseModalDiaSemana, setOpenCloseModalDiaSemana] = useState(false);
    const [diasSemana, setDiasSemana] = useState({ domingo: 0, segunda: 0, terca: 0, quarta: 0, quinta: 0, sexta: 0, sabado: 0 });
    const [openCloseModalSelectRota, setOpenCloseModalSelectRota] = useState(false);
    const [rota, setRota] = useState();

    const handleSelectFormaPgto = () => {
        verificarToken();
        setOpenCloseModalSelectFormaPagamento(true);
    }

    const handleSelectDiaSemana = () => {
        verificarToken();
        setOpenCloseModalDiaSemana(true);
    }

    const handleSelectRota = () => {
        verificarToken();
        setOpenCloseModalSelectRota(true);
    }

    // rota_id
    // forma_pagto_id
    // dia_faturamento

    const handleEtapa = (opcao) => {
        verificarToken();
        if (opcao === 0) {
            setEtapa(etapa - 1);
        }
        if (opcao === 1) {
            setEtapa(etapa + 1);
        }
    }

    // busca os dados do cliente pelo cnpj se houve conexão de rede
    useEffect(() => {
        const dataDadosCnpj = async () => {
            if (cnpjCpf.length === 14) {
                setLoadingCliente(true);
                try {
                    const response = await axiosConfig.get(`https://publica.cnpj.ws/cnpj/${cnpjCpf}`);
                    if (response?.data && response?.data?.status !== 400 && response?.data?.status !== 429) {
                        setRazao(response?.data?.razao_social);
                        setFantasia(response?.data?.estabelecimento?.nome_fantasia);
                        setFone1(response?.data?.estabelecimento?.telefone1);
                        setFone2(response?.data?.estabelecimento?.telefone2);
                        setContato(response?.data?.estabelecimento?.contato);
                        setIeRg(
                            response?.data?.estabelecimento?.inscricoes_estaduais[0]
                                .inscricao_estadual
                        );
                        setUf(response?.data?.estabelecimento?.estado.sigla);
                        setCep(response?.data?.estabelecimento?.cep);
                        setBairro(response?.data?.estabelecimento?.bairro);
                        setCidade(response?.data?.estabelecimento?.cidade.nome);
                        setCodigoCidade(response?.data?.estabelecimento?.cidade.ibge_id);
                        setLogradouro(response?.data?.estabelecimento?.logradouro);
                        setNumero(response?.data?.estabelecimento?.numero);
                        setEmail(response?.data?.estabelecimento?.email);
                        setComplemento(response?.data?.estabelecimento?.complemento);
                    }
                } catch (error) {
                    console.log(error.response?.data);
                    Alert.alert('ATENÇÃO', error.response?.data?.detalhes, [{ onPress: () => setLoadingCliente(false), text: 'entendi' }]);
                    return
                } finally {
                    setLoadingCliente(false);
                }
            }
        }
        dataDadosCnpj();
    }, [cnpjCpf]);

    // busca dados de endereço pelo cep se houver conexão de rede
    useEffect(() => {
        const dataBuscarCep = async () => {
            if (cep.length === 8 && cep.length > 7) {
                setLoadingCliente(true);
                try {
                    const response = await axiosConfig.get(`https://viacep.com.br/ws/${cep}/json/`);

                    if (!response?.data.erro) {
                        setLogradouro(response?.data?.logradouro);
                        setUf(response?.data?.uf);
                        setBairro(response?.data?.bairro);
                        setCidade(response?.data?.localidade);
                        setCodigoCidade(response?.data?.ibge);
                        setLoadingCliente(false);
                    } else {
                        Alert.alert('ATENÇÃO', `Buscar dados de endereço pelo CEP falhou, tente novamente ou preencha os dados manualmente.`, [{ onPress: () => setLoadingCliente(false), text: 'entendi' }]);
                    }
                } catch (error) {
                    Alert.alert('ATENÇÃO', `Buscar dados de endereço pelo CEP falhou, tente novamente ou preencha os dados manualmente.`, [{ onPress: () => setLoadingCliente(false), text: 'entendi' }]);
                    console.log(error.response?.data);
                }
            }
        }
        dataBuscarCep();
    }, [cep]);

    const handleCadastrarCliente = async () => {
        verificarToken();
        const dia_faturamento = Object.values(diasSemana).join('');

        var clienteObjCriar =
        {
            apelido: fantasia,
            bairro: bairro,
            cep: cep,
            cidade: cidade,
            cnpj_cpf: cnpjCpf,
            complemento: complemento,
            email: email,
            fone1: fone1,
            fone2: fone2,
            contato: contato,
            codigo_cidade: codigoCidade,
            ie_rg: ieRg,
            logradouro: logradouro,
            nome: razao,
            numero: numero,
            representante_id: await AsyncStorage.getItem('@ge_pedido_online_representante_id'),
            uf: uf,
            generico: generico,
            status: 0,
            rota_id: rota?.id,
            forma_pagto_id: formaPagamento?.id,
            dia_faturamento: dia_faturamento
        };

        if (razao !== "" && cnpjCpf !== "" && logradouro !== "" && numero !== "" && bairro !== "" && fone1 !== "" && cidade !== "" && formaPagamento && rota && dia_faturamento !== "0000000") {
            setLoadingCliente(true);
            try {
                const response = await axiosConfig.post(Apis.urlCreateClientes, clienteObjCriar);
                Alert.alert('ATENÇÃO', response?.data.retorno?.mensagem, [{ onPress: () => handleCadastroSucesso(), text: 'entendi' }]);
            } catch (error) {
                console.log(error.response?.data.retorno);
                Alert.alert('ATENÇÃO', error.response?.data.retorno.mensagem, [{ onPress: () => setLoadingCliente(false), text: 'entendi' }]);
            }
        } else {
            Alert.alert('ATENÇÃO', 'Todos os campos devem ser preenchidos', [{ onPress: () => setLoadingCliente(false), text: 'entendi' }]);
        }
    }

    const handleCadastroSucesso = () => {
        setReloadCliente(!reloadCliente);
        setLoadingCliente(false);
        setOpenClose(false);
    }
    return (
        <>
            {loadingCliente ?
                <Modal visible={loadingCliente} onRequestClose={() => setLoadingCliente(false)}>
                    <Loading />
                </Modal>
                :
                <ModalAlert ocultarInfoGe={true} funcao={etapa > 1 ? () => handleEtapa(0) : () => setOpenClose(false)} openModal={openModal} scroll={true}>
                    <AppBarModalClose funcao={etapa > 1 ? () => handleEtapa(0) : () => setOpenClose(false)}
                        texto={`${etapa === 1 ? ' DADOS PESSOAIS' : ''}${etapa === 2 ? ' ENDEREÇO' : ''}${etapa === 3 ? 'ENDEREÇO' : ''}${etapa === 4 ? 'CONTATO' : ''}${etapa === 5 ? 'FINANCEIRO' : ''}${etapa === 6 ? 'TIPO DE CLIENTE' : ''}`}
                    />
                    <TouchableOpacity style={{ backgroundColor: '#3a97ed', height: 5, width: `${etapa * 16.66}%` }} />
                    <AreaModalBtnInput>
                        {etapa === 1 &&
                            <>
                                <InputComponent borderBottomWidth={true} placeholder='CNPJ/CPF' type="numeric" valor={cnpjCpf} setValor={setCnpjCpf} />
                                <InputComponent borderBottomWidth={true} placeholder='IR/RG' type="numeric" valor={ieRg} setValor={setIeRg} />
                                <InputComponent borderBottomWidth={true} placeholder='Razão Social' valor={razao} setValor={setRazao} />
                                <InputComponent borderBottomRadius={true} placeholder='Fantasia' valor={fantasia} setValor={setFantasia} />
                            </>
                        }
                        {etapa === 2 &&
                            <>
                                <InputComponent borderBottomWidth={true} placeholder='CEP' type="numeric" valor={cep} setValor={setCep} />
                                <InputComponent borderBottomWidth={true} placeholder='Logradouro' valor={logradouro} setValor={setLogradouro} />
                                <InputComponent borderBottomWidth={true} placeholder='Número' type="numeric" valor={numero} setValor={setNumero} />
                                <InputComponent borderBottomRadius={true} placeholder='Bairro' valor={bairro} setValor={setBairro} />
                            </>
                        }
                        {etapa === 3 &&
                            <>
                                <InputComponent borderBottomWidth={true} placeholder='Complemento' valor={complemento} setValor={setComplemento} />
                                <InputComponent borderBottomWidth={true} placeholder='Cidade' valor={cidade} setValor={setCidade} />
                                <InputComponent borderBottomWidth={true} placeholder='Cidade Código' valor={codigoCidade} setValor={setCodigoCidade} />
                                <InputComponent borderBottomRadius={true} placeholder='UF' valor={uf} setValor={setUf} />
                            </>
                        }
                        {etapa === 4 &&
                            <>
                                <InputComponent borderBottomWidth={true} placeholder='Email' type="email-address" valor={email} setValor={setEmail} />
                                <InputComponent borderBottomWidth={true} placeholder='Telefone 1' type="phone-pad" valor={fone1} setValor={setFone1} />
                                <InputComponent borderBottomWidth={true} placeholder='Telefone 2' type="phone-pad" valor={fone2} setValor={setFone2} />
                                <InputComponent borderBottomRadius={true} placeholder='Contato' valor={contato} setValor={setContato} />
                            </>
                        }
                        {etapa === 5 &&
                            <>
                                <ButtonInput borderBottomWidth={true} texto="Dias da Semana" funcao={handleSelectDiaSemana} />
                                <ButtonInput borderBottomWidth={true} texto={formaPagamento?.descricao || 'forma de pagamento'} funcao={handleSelectFormaPgto} />
                                <ButtonInput borderBottomWidth={false} texto={rota?.descricao || 'Rota'} funcao={handleSelectRota} />
                            </>
                        }
                        {etapa === 6 &&
                            <ButtonInput funcao={() => setOpenCloseModalTipoCliente(true)} texto={`cliente ${generico === 0 ? 'padrão' : 'generico'}`} />
                        }
                    </AreaModalBtnInput>
                    <ButtonInput color='#fff' texto={etapa === 6 ? 'finalizar' : 'seguinte'} bgColor={etapa === 6 ? '#4ac795' : '#3b97ee'} funcao={etapa < 6 ? () => handleEtapa(1) : handleCadastrarCliente}>
                        <MaterialCommunityIcons name={etapa < 6 ? 'chevron-right' : 'content-save-outline'} style={{ fontSize: 20, color: '#fff' }} />
                    </ButtonInput>

                    <SelectTipoCliente openClose={openCloseModalTipoCliente} setOpenClose={setOpenCloseModalTipoCliente} setTipoClienteSelected={setGenerico} tipoClienteSelected={generico} />
                    <SelectDiaSemana openClose={openCloseModalDiaSemana} setOpenClose={setOpenCloseModalDiaSemana} setDiasSemanaSelected={setDiasSemana} tipoDiasSemanaSelected={diasSemana} />
                    <SelectFormaPagamento openClose={openCloseModalSelectFormaPagamento} setOpenClose={setOpenCloseModalSelectFormaPagamento} setFormaPagamento={setFormaPagamento} />
                    <SelectRota openClose={openCloseModalSelectRota} setOpenClose={setOpenCloseModalSelectRota} setRota={setRota} />
                </ModalAlert>
            }
        </>
    )
}
export default CadastrarClientes;