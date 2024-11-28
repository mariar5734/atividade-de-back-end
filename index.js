import express from 'express';
import historicoSalario from './dados/dados.js';
import { buscarHistoricoSalarioPorAno, buscarHistoricoSalarioPorId, calcularReajusteSalario, buscarInfoSalario } from './servico/servico.js';

const app = express();

app.get('/historicoSalario/calculo', (req, res) => {
    const valor = parseFloat(req.query.valor);
    const mesInicial = parseInt(req.query.mesInicial);
    const anoInicial = parseInt(req.query.anoInicial);
    const mesFinal = parseInt(req.query.mesFinal);
    const anoFinal = parseInt(req.query.anoFinal);

    if (isNaN(valor) || isNaN(mesInicial) || isNaN(anoInicial) || isNaN(mesFinal) || isNaN(anoFinal)) {
        return res.status(400).json({ error: "Todos os parâmetros (valor, mesInicial, anoInicial, mesFinal, anoFinal) são obrigatórios e devem ser válidos." });
    }

    if (anoInicial > anoFinal || (anoInicial === anoFinal && mesInicial > mesFinal)) {
        return res.status(400).json({ error: "O mês/ano inicial deve ser menor ou igual ao mês/ano final." });
    }

    try {
        const resultado = calcularReajusteSalario(valor, mesInicial, anoInicial, mesFinal, anoFinal);
        res.json({ valorReajustado: resultado.toFixed(2) });
    } catch (error) {
        res.status(500).json({ "erro": "Erro ao calcular o reajuste." });
    }
});

app.listen(8080, () => {
    console.log('Servidor iniciado na porta 8080');
});

app.get('/historicoSalario', (req, res) => {
    const anoInf = req.query.ano;
    const resultado = anoInf ? buscarHistoricoSalarioPorAno(anoInf) : buscarInfoSalario();
    if (resultado.length > 0) {
        res.json(resultado);
    } else {
        res.status(404).send({ "erro": "Nenhum registro encontrado" });
    }
});

app.get('/historicoSalario/:id', (req, res) => {
    const salario = buscarHistoricoSalarioPorId(req.params.id);

    if (salario) {
        res.json(salario);
    } else if (isNaN(parseInt(req.params.id))) {
        res.status(400).send({ "erro": 'Requisição inválida' });
    } else {
        res.status(404).send({ "erro": 'Registro não encontrado' });
    }    
});