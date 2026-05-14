import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

var selectedPrinter = "";
var empresaLocal = {};
var ImgAssinarComrprovante = '';
var representanteLocal = {};

export const printComprovanteVenda = async (dados) => {
    // Atualizar o HTML com os pedidos e itens completos
    ImgAssinarComrprovante = '';

    const { uri } = await Print.printToFileAsync({
        html: await gerarHtml(dados),
    });

    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    // versão anterior de visualização
    // await Print.printAsync({
    //     html: await gerarHtml(dados),
    //     printerUrl: selectedPrinter?.url,
    // });
};

export const printToFileComprovanteVenda = async (dados, img) => {
    ImgAssinarComrprovante = img;

    const { uri } = await Print.printToFileAsync({
        html: await gerarHtml(dados),
    });

    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
};

// Função para gerar o HTML com base nos pedidos completos
const gerarHtml = async (dados) => {
    const logo = await AsyncStorage.getItem('@ge_pedido_online_logo_empresa');
    const cleanLogo = logo?.replace(/"/g, "") || "";

    const representanteNome = await AsyncStorage.getItem('@ge_pedido_online_representante_nome');
    const representanteId = await AsyncStorage.getItem('@ge_pedido_online_representante_id');
    empresaLocal = JSON.parse(await AsyncStorage.getItem('@ge_pedido_online_empresa')) || {};
    representanteLocal = { nome: representanteNome, id: representanteId };

    const data = new Date();
    let hora = data.getHours(), minuto = data.getMinutes(), segundo = data.getSeconds();
    if (minuto < 10) minuto = "0" + minuto;
    if (segundo < 10) segundo = "0" + segundo;
    const horaFormatada = `${hora}:${minuto}:${segundo}`;
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const dataAtual = `${dia}/${mes}/${ano}`;

    const parcelas = dados?.parcelas?.map((item, index) =>
        `<div style="font-weight: bold;">
            <span>Parc. ${item?.parcela}</span> -
            <span>Vencimento: ${String(item?.vencimento).split('-').reverse().join('/')}</span> -
            <span>R$ ${item?.valor}</span>
        </div>`
    ).join('');

    let totalDesconto = 0;
    dados?.produtos?.forEach((item) => {
        totalDesconto += parseFloat(item?.desconto) || 0;
    });

    const produtos = dados?.produtos?.map((item, index) =>
        `<tr key=${index} style="background-color: ${index % 2 !== 0 ? '#ebebeb' : 'white'}">
            <td style="font-size: 15px; font-family: Helvetica, Arial, sans-serif;">${item?.descricao}</td>
            <td style="font-size: 15px; font-family: Helvetica, Arial, sans-serif;">${item?.unidade}</td>
            <td style="font-size: 15px; font-family: Helvetica, Arial, sans-serif; text-align: right;">${parseFloat(item?.qt || 0).toFixed(2)}</td>
            <td style="font-size: 15px; font-family: Helvetica, Arial, sans-serif; text-align: right;">${parseFloat(item?.preco || 0).toFixed(2)}</td>
            <td style="font-size: 15px; font-family: Helvetica, Arial, sans-serif; text-align: right;">${(parseFloat(item?.qt || 0) * parseFloat(item?.preco || 0)).toFixed(2)}</td>
            <td style="font-size: 15px; font-family: Helvetica, Arial, sans-serif; text-align: right;">${parseFloat(item?.desconto || 0).toFixed(2)}</td>
        </tr>`
    ).join('');

    const totalComDesconto = (parseFloat(dados?.total || 0) - parseFloat(dados?.total_desconto || 0)).toFixed(2);

    return `
    <html>
    <head>
        <meta name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <style>
            body { text-align: center; padding: 30px; position: relative; font-family: Helvetica, Arial, sans-serif; }
            .header { display: flex; align-items: center; width: 100%; column-gap: 20px; }
            .header .img-header { width: 150px; height: 150px; }
            .header .topo { text-align: left; }
            .header .topo .nome-empresa { font-size: 20px; font-weight: bold; margin-bottom: 3px; text-transform: uppercase; }
            .header .topo .p { font-size: 15px; font-weight: normal; margin-top: 3px; margin-bottom: 3px; }
            .dividir { margin-top: 30px; margin-bottom: 30px; }
            .dd-pedido { display: flex; justify-content: space-between; margin-top: 30px; }
            .dd-pedido p { font-size: 20px; font-weight: bold; margin-bottom: 3px; }
            .dd-pedido .right { text-align: right; }
            .cliente { font-size: 15px; font-weight: normal; margin-top: 3px; margin-bottom: 3px; text-align: left; }
            .vendedor { text-align: left; }
            .vendedor p { font-size: 15px; font-weight: normal; margin-top: 3px; margin-bottom: 3px; }
            .vendedor .nome { text-transform: capitalize; }
            table { border-collapse: collapse; border: none; width: 100%; }
            table thead { background-color: #ebebeb; border-top: dashed 2px; border-bottom: dashed 2px; }
            table td, table th { border: none; font-family: Helvetica, Arial, sans-serif; font-size: 15px; }
            table thead .right { text-align: right; }
            .rodape { text-align: left; }
            .rodape .div { display: flex; justify-content: space-between; }
            .rodape .div .rodape-p, .rodape .nao-recibo { font-size: 20px; font-weight: bold; margin-bottom: 3px; }
            .rodape .assinado { display: flex; justify-content: center; align-items: center; flex-direction: column; margin-top: 50px; }
            .rodape .assinado img { width: 180px; height: 70px; }
        </style>
    </head>
    <body>
        <div class="header">
            ${cleanLogo ? `<img src="data:image/jpg;base64,${cleanLogo}" class="img-header"/>` : ""}
            <div class="topo">
                <p class="nome-empresa">${empresaLocal?.nome || ""}</p>
                <p class="p">CNPJ: ${empresaLocal?.cnpj || ""}</p>
                <p class="p">${empresaLocal?.endereco?.logradouro || ""}, ${empresaLocal?.endereco?.numero || ""} - ${empresaLocal?.endereco?.bairro || ""}</p>
                <p class="p">${empresaLocal?.endereco?.cidade || ""} - ${empresaLocal?.endereco?.uf || ""} - CEP: ${empresaLocal?.endereco?.cep || ""}</p>
                <p class="p">Telefone: ${empresaLocal?.endereco?.telefone || ""} - email: ${empresaLocal?.endereco?.email || ""}</p>
            </div>
        </div>

        <hr class="dividir" />

        <h2>COMPROVANTE DE ${dados?.ident_operacao == 1 ? 'VENDA' : 'TROCA'}</h2>
        <div class="dd-pedido">
            <p>${dados?.numPedido ? `PEDIDO: ${dados?.numPedido}` : ""}</p>
            <p class="right">DATA: ${dados?.data?.split("-").reverse().join("/")} <br />FATURAMENTO: ${dados?.data_faturamento?.split("-").reverse().join("/")}</p>
        </div>

        <p class="cliente">CLIENTE: ${dados?.cliente?.codigo ? `${dados.cliente.codigo} - ` : ''}${dados?.cliente?.nome || ""} (${dados?.cliente?.cnpj_cpf || ""})</p>
        <p class="cliente">FANTASIA: ${dados?.cliente?.apelido || "NÃO INFORMADO"}</p>
        <p class="cliente">CONTATO: ${dados?.cliente?.contato || "NÃO INFORMADO"}</p>
        <p class="cliente">${dados?.cliente?.cidade || ""} - ${dados?.cliente?.uf || ""} - ${dados?.cliente?.logradouro || ""} - ${dados?.cliente?.numero || ""} - ${dados?.cliente?.bairro || ""} - ${dados?.cliente?.cep || ""}</p>

        <hr class="dividir" />

        <div class="vendedor">
            <p class="nome">VENDEDOR: ${representanteLocal?.nome || ""}</p>
            ${dados?.ident_operacao == 1 ? `
                <p>CONDIÇÕES DE PAGAMENTO: ${dados?.forma_pagto_descricao || ""} ${parseFloat(dados?.qt_parcelas || 0)} PARCELA${parseFloat(dados?.qt_parcelas || 0) > 1 ? 'S' : ''}</p>
                ${parcelas}
            ` : ''}
        </div>

        <hr class="dividir" />

        <table class="table">
            <thead>
                <th>Descrição</th>
                <th>Unid.</th>
                <th class="right">Quantidade</th>
                <th class="right">Preço</th>
                <th class="right">Total</th>
                <th class="right">Desconto</th>
            </thead>
            <tbody>${produtos}</tbody>
        </table>

        <hr style="margin-top: 15px; margin-bottom: 15px;" />

        <div class="rodape">
            <div class="div">
                <p class="rodape-p">Subtotal</p>
                <p class="rodape-p">R$ ${parseFloat(dados?.total || 0).toFixed(2)}</p>
            </div>
            <div class="div">
                <p class="rodape-p">Desconto</p>
                <p class="rodape-p">R$ ${parseFloat(totalDesconto).toFixed(2)}</p>
            </div>
            <div class="div">
                <p class="rodape-p">Total</p>
                <p class="rodape-p">R$ ${totalComDesconto}</p>
            </div>
            <p class="nao-recibo">Não vale como recibo</p>
            <div style="width: 100%; display: flex; justify-content: space-between; align-items: flex-end;">
                <p style="font-weight: bold;">${dataAtual} ${horaFormatada}</p>
                ${ImgAssinarComrprovante ? `
                    <div class="assinado">
                        <img src=${ImgAssinarComrprovante} alt="Imagem Base64" />
                        <p>Assinado por: ${representanteLocal?.nome || ""} em ${dataAtual}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    </body>
    </html>
    `;
};