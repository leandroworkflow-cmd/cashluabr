export interface GuiaContent {
  slug: string;
  title: string;
  excerpt: string;
  readingTime: string;
  body: string[]; // paragraphs, "## " prefix marks a subheading
}

export const guiasContent: GuiaContent[] = [
  {
    slug: "como-saber-se-uma-oferta-e-boa",
    title: "Como saber se uma oferta é realmente boa (e não só parece)",
    excerpt:
      "Nem todo desconto é vantagem. Aprenda a checar histórico de preço, comparar lojas e identificar quando um 'desconto' é só marketing.",
    readingTime: "5 min",
    body: [
      "É comum ver um produto anunciado com '50% OFF' e sentir aquela vontade imediata de comprar. Mas desconto alto no rótulo nem sempre significa preço baixo de verdade. Muitas lojas inflam o preço 'de' antes de aplicar o desconto, fazendo o valor final parecer mais vantajoso do que realmente é.",
      "## Compare o histórico de preço, não só o desconto anunciado",
      "Antes de comprar, vale a pena checar como o preço daquele produto se comportou nas últimas semanas ou meses. Se o valor 'promocional' de hoje é igual ou parecido com o preço normal de um mês atrás, o desconto é apenas cosmético. Ferramentas de histórico de preço (como extensões de navegador voltadas para isso) ajudam nessa checagem em segundos.",
      "## Compare entre lojas diferentes",
      "Uma oferta só é boa em termos absolutos, não relativos ao preço 'de'. Antes de finalizar a compra, pesquise o mesmo produto em pelo menos duas ou três lojas diferentes. Às vezes um produto sem nenhum selo de desconto está mais barato do que outro anunciado como oferta.",
      "## Fique atento ao frete e às condições de pagamento",
      "Um produto R$ 20 mais barato pode sair mais caro se o frete for alto ou se o parcelamento tiver juros embutidos. Sempre calcule o valor final total — produto + frete + eventuais taxas — antes de comparar duas ofertas.",
      "## Sinais de que a oferta é confiável",
      "Descrição completa do produto, vendedor com avaliações reais, política de troca clara e prazo de entrega informado são bons indícios de que a oferta é legítima. Ofertas sem essas informações básicas merecem mais cautela.",
      "Na CashLua, buscamos destacar ofertas que realmente representam economia, mas mesmo assim recomendamos sempre fazer essa checagem rápida antes de finalizar qualquer compra — é um hábito simples que evita frustração e ajuda a economizar de verdade.",
    ],
  },
  {
    slug: "melhores-epocas-para-comprar-eletronicos",
    title: "As melhores épocas do ano para comprar eletrônicos no Brasil",
    excerpt:
      "Black Friday não é a única data que importa. Veja o calendário de quedas de preço em celulares, notebooks e eletrodomésticos.",
    readingTime: "6 min",
    body: [
      "A Black Friday, em novembro, costuma concentrar as atenções, mas não é o único — nem sempre o melhor — momento para comprar eletrônicos no Brasil. O mercado tem um calendário próprio de quedas de preço ao longo do ano, ligado a lançamentos, sazonalidade de vendas e estoque das lojas.",
      "## Janeiro e fevereiro: liquidação de fim de ano",
      "Logo após as festas de fim de ano, muitas lojas fazem liquidação para girar o estoque que sobrou do Natal. É um bom momento para eletrodomésticos e itens de casa, embora a variedade de eletrônicos costume ser menor que na Black Friday.",
      "## Abril e maio: pré-lançamentos",
      "Quando uma nova geração de celulares ou notebooks está prestes a ser anunciada, os modelos anteriores costumam ter quedas de preço para dar espaço ao lançamento. Vale acompanhar rumores de lançamento das marcas que você tem interesse.",
      "## Junho: Dia dos Namorados e mid-year sales",
      "Muitas lojas fazem campanhas específicas em junho, especialmente em categorias como fones de ouvido, smartwatches e acessórios — itens comuns como presente.",
      "## Agosto e setembro: pré-Black Friday",
      "Algumas lojas começam a 'esquentar' o mercado com promoções antecipadas. Nem sempre são os melhores preços do ano, mas vale comparar com o histórico antes da Black Friday oficial.",
      "## Novembro: Black Friday",
      "Ainda é, estatisticamente, o período com maior concentração de bons descontos reais em eletrônicos no Brasil — mas só vale a pena se você já sabe o preço histórico do produto (veja nosso guia sobre como identificar ofertas reais).",
      "## Dezembro: cuidado com o preço de Natal",
      "Em dezembro, a demanda sobe e os preços tendem a subir também, mesmo com campanhas de 'oferta de Natal'. Se você já garantiu o produto na Black Friday, geralmente não vale a pena esperar até dezembro.",
      "Acompanhar essas janelas ao longo do ano, em vez de esperar só pela Black Friday, aumenta bastante as chances de comprar eletrônicos pagando menos.",
    ],
  },
  {
    slug: "cupom-de-desconto-vale-a-pena",
    title: "Cupom de desconto: quando vale a pena usar (e quando é pegadinha)",
    excerpt:
      "Cupons com regras confusas, valor mínimo alto ou prazo curtíssimo podem custar mais caro que parecem economizar. Entenda os sinais de alerta.",
    readingTime: "4 min",
    body: [
      "Cupons de desconto são uma das ferramentas mais populares para economizar em compras online, mas nem todo cupom traz vantagem real. Algumas condições escondidas podem fazer você gastar mais do que pretendia só para 'aproveitar' o desconto.",
      "## Valor mínimo de compra",
      "Um cupom de R$ 20 de desconto acima de R$ 300 em compras só vale a pena se você já ia gastar esse valor de qualquer forma. Comprar itens extras só para atingir o mínimo geralmente anula (ou até supera) a economia do cupom.",
      "## Produtos excluídos",
      "Muitos cupons têm letras miúdas excluindo justamente as categorias mais procuradas, como eletrônicos ou itens já em promoção. Sempre leia os termos antes de contar com o desconto.",
      "## Prazo de validade curto",
      "Cupons com validade de poucas horas costumam induzir decisões por impulso. Se a pressa faz você pular a etapa de comparar preços entre lojas, o cupom pode custar mais do que economiza.",
      "## Cupons empilháveis",
      "Alguns cupons não podem ser usados junto com outras promoções já ativas no produto — nesse caso, o desconto 'extra' do cupom pode não se somar ao preço promocional, e sim substituí-lo.",
      "Nosso conselho: trate o cupom como uma ferramenta a mais, não como motivo principal para comprar. Ele só é vantagem de verdade quando o produto já era algo que você precisava, no preço certo, com o cupom aplicado por cima.",
    ],
  },
  {
    slug: "como-comprar-com-seguranca-online",
    title: "Como comprar com segurança em lojas online desconhecidas",
    excerpt:
      "Antes de colocar o cartão numa loja nova, verifique estes pontos: CNPJ, reclamações no Reclame Aqui, política de troca e formas de pagamento.",
    readingTime: "5 min",
    body: [
      "Encontrar uma oferta muito boa numa loja que você nunca ouviu falar é comum — e nem sempre é motivo de preocupação. Mas antes de finalizar a compra, alguns cuidados simples ajudam a evitar dor de cabeça.",
      "## Verifique o CNPJ e o endereço da empresa",
      "Lojas sérias informam CNPJ, razão social e endereço físico, geralmente no rodapé do site. Você pode consultar a situação do CNPJ gratuitamente no site da Receita Federal.",
      "## Consulte a reputação da loja",
      "Sites como Reclame Aqui mostram o histórico de reclamações e, principalmente, como a loja resolve os problemas. Uma nota baixa não é automaticamente desqualificante, mas merece atenção — veja se há resposta às reclamações.",
      "## Prefira pagamento com proteção",
      "Cartão de crédito costuma oferecer mais proteção ao consumidor do que Pix ou boleto em lojas desconhecidas, já que permite contestação em caso de problema. Para compras de maior valor em lojas novas, vale considerar essa diferença.",
      "## Leia a política de troca e devolução",
      "Pelo Código de Defesa do Consumidor, compras online têm direito a arrependimento em até 7 dias. Uma loja séria deixa isso claro e facilita o processo — desconfie se essa informação estiver ausente ou muito escondida.",
      "## Desconfie de preços absurdamente abaixo do mercado",
      "Se um produto está sendo vendido por uma fração do preço praticado em qualquer outra loja, vale redobrar a atenção antes de comprar. Preços fora da realidade são, muitas vezes, sinal de golpe.",
      "Seguir esses passos leva poucos minutos e reduz bastante o risco de problemas em compras com lojas que você ainda não conhece.",
    ],
  },
  {
    slug: "planejar-orcamento-para-compras",
    title: "Como planejar o orçamento do mês para aproveitar promoções sem se endividar",
    excerpt:
      "Comprar na promoção só é economia se caber no seu orçamento. Um método simples para separar o que é oportunidade do que é impulso.",
    readingTime: "6 min",
    body: [
      "Aproveitar boas promoções é ótimo, mas só faz sentido financeiro quando cabe no seu orçamento. Comprar parcelado além do que se pode pagar transforma uma 'economia' em dívida — e no fim, o desconto vira prejuízo.",
      "## Separe um valor mensal para 'oportunidades'",
      "Uma forma simples de aproveitar promoções sem comprometer o orçamento é reservar, todo mês, um valor fixo — mesmo que pequeno — destinado só a aproveitar boas ofertas quando aparecerem. Isso cria uma reserva específica, sem misturar com contas fixas.",
      "## Distinga 'preciso' de 'quero'",
      "Antes de comprar por causa do desconto, pergunte: eu compraria esse item no preço cheio, se precisasse dele agora? Se a resposta for não, provavelmente é o desconto que está criando a necessidade, não o contrário.",
      "## Cuidado com o parcelamento sem juros",
      "Parcelar sem juros não é problema em si, mas comprometer várias parcelas futuras ao mesmo tempo, em compras diferentes, pode apertar o orçamento dos meses seguintes sem você perceber. Vale somar mentalmente todas as parcelas já assumidas antes de adicionar mais uma.",
      "## Espere 24 horas antes de decidir",
      "Para compras que não são urgentes, esperar um dia inteiro antes de finalizar ajuda a separar impulso de decisão consciente. Se a oferta ainda parecer boa (e ainda estiver disponível) no dia seguinte, provavelmente vale a pena.",
      "## Acompanhe o que já foi gasto no mês",
      "Manter um controle simples — mesmo que numa planilha básica — de quanto já foi gasto em compras 'de oportunidade' ajuda a não perder a noção do orçamento total.",
      "Economizar em cada compra individual só faz diferença de verdade quando o conjunto das compras do mês continua dentro do que você pode pagar.",
    ],
  },
  {
    slug: "diferenca-cashback-cupom-oferta",
    title: "Cashback, cupom ou oferta direta: qual combina mais com você?",
    excerpt:
      "Os três reduzem o valor final, mas funcionam de formas diferentes. Entenda as vantagens e desvantagens de cada modelo de economia.",
    readingTime: "5 min",
    body: [
      "Cashback, cupom de desconto e oferta direta são formas diferentes de pagar menos por um produto, mas cada uma tem uma lógica própria — e nem sempre a mais vantajosa é a mais óbvia.",
      "## Oferta direta",
      "É o desconto já aplicado no preço, sem necessidade de código ou espera. Vantagem: simplicidade, você vê exatamente quanto vai pagar. Desvantagem: como vimos no guia sobre ofertas reais, o preço 'de' pode estar inflado, então é preciso checar o histórico de preço.",
      "## Cupom de desconto",
      "Exige um código aplicado no carrinho e costuma ter regras (valor mínimo, categorias excluídas, validade curta). Vantagem: pode gerar descontos maiores em compras específicas. Desvantagem: letras miúdas podem reduzir ou anular a vantagem — vale sempre ler as condições.",
      "## Cashback",
      "Devolve parte do valor gasto, geralmente depois de um prazo (dias ou semanas). Vantagem: costuma ser cumulativo com cupons e ofertas. Desvantagem: o dinheiro não volta na hora, e alguns programas têm valor mínimo para resgate ou prazo de expiração do saldo.",
      "## Qual escolher?",
      "Para compras urgentes, a oferta direta é mais previsível. Para compras grandes e planejadas, vale comparar se um cupom reduz mais o valor do que o cashback devolveria. E sempre que possível, verificar se cupom e cashback podem ser somados — nesse caso, a economia total pode ser bem maior do que usar só um dos dois.",
      "Entender essas diferenças ajuda a escolher, compra a compra, qual mecanismo de desconto realmente compensa mais para o seu caso.",
    ],
  },
  {
    slug: "pix-parcelado-vale-a-pena",
    title: "Pix parcelado: como funciona e quando realmente vale a pena",
    excerpt:
      "Parcelar no Pix parece prático, mas nem sempre é a opção mais barata. Veja como comparar com o cartão de crédito antes de escolher.",
    readingTime: "5 min",
    body: [
      "O Pix parcelado ganhou espaço em lojas online como alternativa ao cartão de crédito, principalmente para quem não tem limite disponível ou prefere não usar cartão. Mas o funcionamento é diferente do que muita gente imagina, e isso muda a conta na hora de decidir.",
      "## Como funciona na prática",
      "Diferente do Pix comum (à vista, instantâneo), o Pix parcelado normalmente é oferecido por uma financeira parceira da loja ou por instituições de crédito, que emprestam o valor da compra e cobram o parcelamento à parte, fora do sistema do Pix em si. Ou seja: juridicamente é um crédito, não uma característica nativa do Pix.",
      "## Fique atento aos juros",
      "Muitas lojas anunciam 'Pix parcelado sem juros', mas isso nem sempre é verdade — em alguns casos o juro já está embutido no preço final, ou aparece só depois, na tela de confirmação do parcelamento. Antes de fechar, compare o valor total parcelado com o preço à vista anunciado no mesmo produto.",
      "## Compare com o parcelamento do cartão de crédito",
      "Se você já tem cartão de crédito com limite disponível, vale comparar as duas opções lado a lado: número de parcelas, valor de cada parcela e o total pago no fim. Cartões costumam ter parcelamento sem juros em mais lojas do que o Pix parcelado, especialmente em compras maiores.",
      "## Quando o Pix parcelado faz sentido",
      "Ele tende a valer mais a pena para quem não tem cartão de crédito ou já está no limite, e precisa de uma alternativa para não pagar tudo à vista. Nesses casos, é importante confirmar a taxa de juros efetiva antes de aceitar — muitas plataformas mostram esse número como 'CET' (Custo Efetivo Total).",
      "Assim como qualquer parcelamento, a regra de ouro continua a mesma: só parcele o que cabe no seu orçamento dos próximos meses, e sempre compare o valor total pago, não só o valor da parcela.",
    ],
  },
  {
    slug: "frete-gratis-vale-a-pena",
    title: "Frete grátis: quando é vantagem de verdade e quando esconde o custo no produto",
    excerpt:
      "Nem todo 'frete grátis' é economia real. Descubra como identificar quando o custo do frete só foi embutido no preço do produto.",
    readingTime: "4 min",
    body: [
      "'Frete grátis' é um dos gatilhos mais fortes de decisão de compra online, mas o nome nem sempre reflete a realidade. Em muitos casos, o custo do envio simplesmente é embutido no preço do produto, e o frete só parece gratuito.",
      "## Compare o mesmo produto com e sem frete grátis",
      "Quando a loja oferece as duas opções (com e sem frete grátis, geralmente mudando o vendedor ou a modalidade de entrega), compare o preço final das duas. Se a diferença de preço for parecida com o valor do frete cobrado na outra opção, você não está economizando — só trocando onde o custo aparece.",
      "## Desconfie de frete grátis com valor mínimo muito alto",
      "Regras como 'frete grátis acima de R$ 200' podem levar você a comprar itens extras só para atingir o valor mínimo. Se esses itens extras não eram necessários, o frete 'grátis' saiu mais caro do que pagar o frete normal em uma compra menor.",
      "## Verifique o prazo de entrega",
      "Frete grátis costuma vir com prazos mais longos, porque geralmente usa modalidades de envio mais lentas. Se você precisa do produto com urgência, vale calcular se compensa pagar por um frete expresso em vez de esperar.",
      "## Somente comparar preços finais revela a verdade",
      "A forma mais segura de saber se um frete grátis é vantagem real é sempre olhar o valor final da compra (produto + frete + eventuais taxas) e comparar com outras lojas que vendem o mesmo item. O rótulo 'frete grátis' sozinho não diz nada sobre se o preço total é bom.",
      "No fim, frete grátis é uma ferramenta de marketing legítima quando o preço do produto continua competitivo — o problema é quando ele é usado só para disfarçar um preço mais alto.",
    ],
  },
  {
    slug: "como-acertar-tamanho-roupas-calcados-online",
    title: "Comprando roupas e calçados online: como acertar no tamanho e evitar trocas",
    excerpt:
      "Comprar moda pela internet tem um risco a mais: o tamanho. Veja como reduzir a chance de errar e o que fazer quando o produto chega diferente do esperado.",
    readingTime: "5 min",
    body: [
      "Roupas e calçados estão entre os itens mais devolvidos em compras online, principalmente por causa de tamanho. Diferente de uma loja física, você não experimenta antes — mas alguns cuidados simples reduzem bastante esse risco.",
      "## Use a tabela de medidas da própria loja, não a genérica",
      "Cada marca tem seu próprio padrão de numeração, então uma tabela de medidas genérica de 'tamanho M' pode não bater com a peça específica que você está comprando. Sempre que disponível, use a tabela de medidas da própria página do produto, medindo uma peça parecida que você já tenha em casa para comparar.",
      "## Leia as avaliações com foco em caimento",
      "Avaliações de outros compradores costumam trazer informações valiosas sobre se a peça 'veste maior' ou 'veste menor' do que o esperado. Vale procurar especificamente por comentários que mencionem isso, em vez de só olhar a nota geral do produto.",
      "## Calçados: meça o pé, não confie só no número",
      "Numeração de calçado varia bastante entre marcas e até entre modelos da mesma marca. Medir o comprimento do pé em centímetros e comparar com a tabela de conversão do fabricante costuma ser mais confiável do que assumir que 'sempre uso o mesmo número'.",
      "## Confira a política de troca antes de comprar",
      "Pelo Código de Defesa do Consumidor, você tem direito a arrependimento em até 7 dias em compras online, mas as condições de troca por tamanho errado (quem paga o frete de devolução, prazo, se é troca ou reembolso) variam de loja para loja. Vale ler essa política antes de comprar peças que você tem mais dúvida sobre o caimento.",
      "Seguindo esses cuidados, o risco de errar não desaparece completamente, mas cai bastante — e você evita o transtorno de precisar devolver ou trocar depois.",
    ],
  },
  {
    slug: "vale-a-pena-comprar-eletroportateis-na-promocao",
    title: "Air fryer, liquidificador, purificador de ar: vale a pena comprar na promoção ou esperar por reviews?",
    excerpt:
      "Eletroportáteis novos no mercado costumam ter descontos de lançamento, mas comprar cedo demais tem riscos. Veja como decidir o melhor momento.",
    readingTime: "5 min",
    body: [
      "Air fryers, liquidificadores, purificadores de ar e outros eletroportáteis aparecem com frequência em promoções agressivas, principalmente quando são lançamentos ou modelos novos de uma marca. Mas comprar assim que a promoção aparece nem sempre é a decisão mais segura.",
      "## O risco de comprar um lançamento sem reviews",
      "Produtos recém-lançados costumam ter poucas avaliações reais de uso, e problemas de fabricação (quando existem) geralmente só aparecem depois de um volume razoável de unidades vendidas e usadas por um tempo. Um desconto bom em um produto sem histórico de avaliação carrega mais risco do que o mesmo desconto em um modelo já estabelecido.",
      "## Modelos com mais tempo de mercado tendem a ser mais previsíveis",
      "Se o objetivo é reduzir risco, um eletroportátil que já está a alguns meses ou anos no mercado, com centenas de avaliações e um padrão claro de elogios ou reclamações, costuma ser uma escolha mais segura — mesmo que o desconto seja um pouco menor do que o do lançamento mais recente.",
      "## Verifique a disponibilidade de peças e assistência técnica",
      "Eletroportáteis eventualmente precisam de manutenção (troca de resistência, cesto, lâmina, filtro). Antes de comprar por causa do preço, vale checar se a marca tem assistência técnica e peças de reposição disponíveis no Brasil — isso importa mais do que parece a longo prazo.",
      "## Quando vale comprar o lançamento mesmo assim",
      "Se o preço de lançamento é excepcionalmente bom e você já confia na marca (por já ter outros produtos dela, por exemplo), o risco fica menor. Nesse caso, guardar a nota fiscal e verificar o prazo de garantia ajuda a se proteger caso apareça algum defeito nos primeiros meses de uso.",
      "Não existe resposta única: comprar o lançamento é uma aposta com desconto maior e menos informação; esperar um pouco reduz o risco, mas geralmente custa um pouco mais caro.",
    ],
  },
  {
    slug: "como-cancelar-pedido-reembolso-marketplace",
    title: "Como cancelar uma compra ou pedir reembolso em marketplaces como Mercado Livre, Shopee e Amazon",
    excerpt:
      "Cada marketplace tem um processo próprio para cancelamento e reembolso. Veja o caminho geral e os prazos que valem para a maioria dos casos.",
    readingTime: "5 min",
    body: [
      "Comprar em marketplaces (plataformas com vários vendedores diferentes) tem uma vantagem: as regras de cancelamento e reembolso costumam ser padronizadas pela própria plataforma, não pelo vendedor individual. Isso facilita, mas o processo varia um pouco entre elas.",
      "## Direito de arrependimento (7 dias)",
      "Pelo Código de Defesa do Consumidor, qualquer compra feita fora de estabelecimento físico (incluindo internet) pode ser cancelada em até 7 dias corridos após o recebimento, sem precisar justificar o motivo. Esse direito vale independentemente da política interna da loja ou marketplace.",
      "## Antes do envio: cancelamento costuma ser mais simples",
      "Se o pedido ainda não foi despachado, a maioria das plataformas permite cancelar diretamente pelo histórico de pedidos, com reembolso processado em poucos dias. Depois que o produto já foi enviado, geralmente é necessário aguardar a entrega e então solicitar devolução.",
      "## Produto com defeito ou diferente do anunciado",
      "Nesses casos, o prazo de garantia legal (30 dias para produtos não duráveis, 90 dias para duráveis) se soma ao direito de arrependimento. A maioria dos marketplaces tem um canal específico de 'abrir uma reclamação' ou 'solicitar devolução por defeito', separado do cancelamento simples — vale procurar essa opção específica para ter prioridade no atendimento.",
      "## Prazo para o reembolso cair",
      "O prazo varia pela forma de pagamento: cartão de crédito costuma levar até 1 ou 2 faturas para o estorno aparecer; Pix e boleto tendem a ser mais rápidos, geralmente em poucos dias úteis após a plataforma confirmar a devolução.",
      "## Guarde os comprovantes",
      "Prints da solicitação de cancelamento, número de protocolo e comprovante de postagem da devolução (quando aplicável) ajudam bastante caso o processo demore mais do que o esperado ou seja necessário abrir uma reclamação em canais como Reclame Aqui ou Procon.",
      "Conhecer esses prazos evita ansiedade desnecessária e ajuda a saber quando é hora de cobrar a plataforma e quando ainda está dentro do prazo normal do processo.",
    ],
  },
];

export function getGuiaBySlug(slug: string | undefined) {
  return guiasContent.find((g) => g.slug === slug);
}
