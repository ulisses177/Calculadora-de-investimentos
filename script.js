// 1. Função para calcular valor mês a mês
function calcularJurosCompostosMesAMes(depositoMensal, taxaMensalDecimal, totalAnos, valorInicial) {
    const numMeses = totalAnos * 12;
    let saldo = valorInicial;
    let montantesMensais = [];
  
    for (let mes = 1; mes <= numMeses; mes++) {
      // Deposita antes de render
      saldo += depositoMensal;
      // Aplica juros no fim do mês
      saldo *= (1 + taxaMensalDecimal);
      montantesMensais.push(saldo);
    }
    return montantesMensais;
  }
  
  // 2. Função para extrair valores anuais (final de cada 12 meses)
  function extrairValoresAnuais(montantesMensais) {
    let valoresAnuais = [];
    const numAnos = Math.floor(montantesMensais.length / 12);
    for (let ano = 1; ano <= numAnos; ano++) {
      const index = ano * 12 - 1; // ex.: ano=1 -> index=11
      valoresAnuais.push(montantesMensais[index]);
    }
    return valoresAnuais;
  }
  
  // 3. Função para criar (ou atualizar) o gráfico de barras com Chart.js
  let myChartInstance = null;
  function gerarGraficoBarrasAnual(valoresAnuais) {
    const ctx = document.getElementById('myChart').getContext('2d');
  
    // Se já existir um chart anterior, destruímos para recriar
    if (myChartInstance) {
      myChartInstance.destroy();
    }
  
    // Montando labels (Ano 1, Ano 2, etc.)
    const labels = valoresAnuais.map((_, i) => `Ano ${i + 1}`);
  
    myChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Valor Acumulado (R$)',
          data: valoresAnuais,
          backgroundColor: 'rgba(0, 140, 186, 0.7)'
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    // Exibe o canvas (caso esteja oculto)
    document.getElementById('myChart').style.display = 'block';
  }
  
  // 4. Tratamento do formulário
  document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault(); // evita recarregar a página
  
    // Ler campos
    const depositoMensal = parseFloat(document.getElementById('depositoMensal').value) || 0;
    const taxaMensal = parseFloat(document.getElementById('taxaMensal').value) || 0; // em %
    const totalAnos = parseInt(document.getElementById('totalAnos').value) || 0;
    const valorInicial = parseFloat(document.getElementById('valorInicial').value) || 0;
  
    // Cálculo
    const taxaMensalDecimal = taxaMensal / 100; // converter para decimal
    const montantesMensais = calcularJurosCompostosMesAMes(depositoMensal, taxaMensalDecimal, totalAnos, valorInicial);
  
    if (montantesMensais.length === 0) {
      alert("Por favor, verifique os dados inseridos.");
      return;
    }
  
    const valorFinal = montantesMensais[montantesMensais.length - 1];
    const totalDeposito = depositoMensal * (totalAnos * 12);
    const jurosAcumulados = valorFinal - totalDeposito - valorInicial;
  
    // Atualiza a div de resultados
    document.getElementById('resDeposito').textContent = depositoMensal.toFixed(2);
    document.getElementById('resTaxa').textContent = taxaMensal.toFixed(2);
    document.getElementById('resAnos').textContent = totalAnos;
    document.getElementById('resInicial').textContent = valorInicial.toFixed(2);
    document.getElementById('resFinal').textContent = valorFinal.toFixed(2);
    document.getElementById('resTotalDeposito').textContent = totalDeposito.toFixed(2);
    document.getElementById('resJuros').textContent = jurosAcumulados.toFixed(2);
  
    // Exibe a div de resultados
    document.getElementById('results').style.display = 'block';
  
    // Gerar gráfico de barras (valores anuais)
    const valoresAnuais = extrairValoresAnuais(montantesMensais);
    gerarGraficoBarrasAnual(valoresAnuais);
  });
  