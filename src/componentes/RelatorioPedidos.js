import * as Print from "expo-print";

var selectedPrinter = "";

export const printRelatorioPedidos = async (dados) => {
  // Atualizar o HTML com os pedidos e itens completos
  await Print.printAsync({
    html: gerarHtml(dados),
    printerUrl: selectedPrinter?.url,
  });
};


// Função para gerar o HTML com base nos pedidos completos
const gerarHtml = (dados) => {
  var totalDesconto = 0;
  var totalValor = 0;
  var unidadeDesc = '';
  var unidade = '';
  var quantidade = 0;

  dados?.listagem?.map((item, index) => {
    totalDesconto = parseFloat(totalDesconto) + parseFloat(item?.desconto);
    totalValor = parseFloat(totalValor) + parseFloat(item?.total);
    quantidade = parseFloat(quantidade) + parseFloat(item?.quantidade);

    if (index > 0) {
      if (unidadeDesc != item?.unidade) {
        unidade = true;
      }
    }
    unidadeDesc = item?.unidade;
  });
  const produtos = dados?.listagem?.map((item, index) =>
    `
      <tr key={${index}} style="background-color: ${index % 2 != 0 ? '#ebebeb' : 'white'}">
          <td style="font-size: 15px; font-family: Helvetica Neue; text-align: left;">${item?.codpro}</td>
          <td style="font-size: 15px; font-family: Helvetica Neue; text-align: left;">${item?.descricao}</td>
          <td style="font-size: 15px; font-family: Helvetica Neue; text-align: right;">${item?.unidade}</td>
          <td style="font-size: 15px; font-family: Helvetica Neue; text-align: right;">${parseFloat(item?.quantidade).toFixed(2)}</td>
          <td style="font-size: 15px; font-family: Helvetica Neue; text-align: right;">${parseFloat(item?.preco).toFixed(2)}</td>
          <td style="font-size: 15px; font-family: Helvetica Neue; text-align: right;">${parseFloat(item?.desconto).toFixed(2)}</td>
          <td style="font-size: 15px; font-family: Helvetica Neue; text-align: right;">${parseFloat(parseFloat(item?.total) - parseFloat(item?.desconto)).toFixed(2)}</td>
      </tr>
  `).join('');

  return `
    <html>
      <head>
          <meta name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      </head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      <style>
          table {
              border-collapse: collapse;
              border: none;
          }

          td,
          th {
              border: none;
          }
      </style>
      <body style="text-align: center; padding: 30px; position: relative;">
        <span style="position: fixed; top: 50px; right: 50px;">${String(dados?.data).split('-').reverse().join('/')}</span>
        <div style="padding: 20px;">
          <span style="font-size: 20px; font-weight: bold;">RELATÓRIO DE VENDAS RESUMIDA</span>
          </br>
          <span>PERÍODO DE ${String(dados?.período?.data_inicial)?.split('-').reverse().join('/')} À ${String(dados?.período?.data_final)?.split('-').reverse().join('/')}</span>
          </br>
          <span>VENDEDOR: ${dados?.vendedor}</span>
        </div>
        <table class="table">
            <thead style="background-color: #ebebeb; border-top: dashed; border-top-width: 2px;border-bottom: dashed; border-bottom-width: 2px;">
              <th>Código</th>
              <th>Produto</th>
              <th style="text-align: right;">Unid.</th>
              <th style="text-align: right;">Qt.</th>
              <th style="text-align: right;">Preço</th>
              <th style="text-align: right;">Desconto</th>
              <th style="text-align: right;">Total</th>
            </thead>
            <tbody>
              ${produtos}
              <tr style="border-top: dashed; border-top-width: 2px;border-bottom: dashed; border-bottom-width: 2px;">
                <td style="font-size: 15px; font-family: Helvetica Neue; font-weight: bold; text-align: left;">Total</td>
                <td></td>
                <td></td>
                <td style="font-size: 15px; font-family: Helvetica Neue; font-weight: bold; text-align: right;">${!unidade ? parseFloat(quantidade).toFixed(2) : ''}</td>
                <td></td>
                <td style="font-size: 15px; font-family: Helvetica Neue; font-weight: bold; text-align: right;">${parseFloat(totalDesconto).toFixed(2)}</td>
                <td style="font-size: 15px; font-family: Helvetica Neue; font-weight: bold; text-align: right;">${parseFloat(totalValor - totalDesconto).toFixed(2)}</td>
              </tr>
            </tbody>
        </table>
      </body>
    </html>
  `;
};
