const URL_BASE = "https://gesuportelogico.com.br/api/";
const Apis = {
  // login
  urlLogin: `${URL_BASE}representantes/login`,
  // CREATE
  // clientes
  urlCreateClientes: `${URL_BASE}clientes/create`,
  // pedidos
  urlCreatePedidos: `${URL_BASE}pedidosvenda/create`,
  // visitas
  urlCreateVisitas: `${URL_BASE}visitas/create`,
  // READ
  // produtos
  urlReadProdutos: `${URL_BASE}produtos/read`,
  // pedidos
  urlListarPedidos: `${URL_BASE}pedidosvenda/read_mobile`,
  // clientes
  urlReadClientes: `${URL_BASE}clientes/read`,
  // rotas
  urlReadRotas: `${URL_BASE}rotas/read`,
  // formas de pagamento
  urlReadFormasPgto: `${URL_BASE}formaspagamento/read`,
  // formas de pagamento one
  urlReadFormasPgtoOne: `${URL_BASE}formaspagamento/read_one`,
  // motivos das visitas
  urlReadMotivoVisitas: `${URL_BASE}visitas/situacoes_visita`,
  // motivos das visitas
  urlReadVisitas: `${URL_BASE}visitas/read`,
  // tabela de precos
  urlTabelaPrecos: `${URL_BASE}tabela_preco/read`,
  // tabela de precos one
  urlTabelaPrecosOne: `${URL_BASE}tabela_preco/read_one`,
  // parametros read
  urlReadParametros: `${URL_BASE}parametros/read`,
  // read one item tabela de preços
  utlReadOneItemTabelaPreco: `${URL_BASE}tabela_preco/checkPrice`,
  // read clientes inadimplentes
  urlReadClientesInadimplentes: `${URL_BASE}clientes/inadimplentes`,
  // relatorio pedido de venda
  urlRelatorioPedidoVenda: `${URL_BASE}pedidosvenda/listing`,
  // UPDATE
  // representante
  urlUpdateRepresentante: `${URL_BASE}representantes/update`,
  // pedidos
  urlUpdatePedidos: `${URL_BASE}pedidosvenda/update`,
  // forma de pagamento
  urlUpdateFormaPgto: `${URL_BASE}pedidosvenda/altera_forma_pag`,
  // trocar pedido
  urlTrocarPedido: `${URL_BASE}troca_venda`,

  // verificar validade do token
  urlValidarToken: `${URL_BASE}tcheck`
};
export default Apis;
