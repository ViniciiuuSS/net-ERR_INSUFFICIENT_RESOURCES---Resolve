var arrayItens = [];
var array = [];

async function processarItensEmLotes(totalItens, batchSize) {
    for (let i = 0; i < totalItens; i += batchSize) {
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, totalItens); j++) {
            const item = { id: j, resolve: false };
            arrayItens.push(item);
            batch.push(valid(item));
        }
        await Promise.all(batch);
    }
    if(arrayItens.length > 0){
        array = [];
        arrayItens.forEach((item) =>{
            array.push(valid(item));
        })
        resolvePromisses(array);
    }   
}

const batchSize = 1000;
const totalItens = 14000;

processarItensEmLotes(totalItens, batchSize);

function valid(item) {
    return new Promise((resolve, reject) => {
        obj(item)
            .then(() => {
                console.log("resolvido");
                const index = arrayItens.findIndex(itens => itens.id === item.id);
                if (index !== -1) {
                    arrayItens.splice(index, 1);
                }
                
                resolve();
            })
            .catch((error) => {
                console.error(error);
                resolve(); 
            });
    });
}

function obj(item) {
    return new Promise((resolve, reject) => {
        async function get() {
            try {
                var v = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL");
                var currencys = await v.json();
                item.resolve = true;
                resolve();
            } catch (error) {
                reject(error); 
            }
        }
        get();
    });
}
async function resolvePromisses(a){
    await Promise.all(array).then(() =>{
        if(arrayItens.length > 0){
            array = [];
            arrayItens.forEach((item) =>{
                array.push(valid(item));
            })
            resolvePromisses(array);
        }       
    })
}


function converterPlanilhaSelecionadaParaJSON() {
    const inputArquivo = document.createElement('input');
    inputArquivo.type = 'file';

    
        const reader = new FileReader();

        reader.onload = function(e) {
            const content = e.target.result;
            const linhas = content.split('\n');
            const headers = linhas[0].trim().split('\t'); // Assume que os cabeçalhos estão separados por tabulação

            const jsonResult = [];

            for (let i = 1; i < linhas.length; i++) {
                const valores = linhas[i].trim().split('\t');
                const item = {};

                for (let j = 0; j < headers.length; j++) {
                    item[headers[j]] = valores[j];
                }

                jsonResult.push(item);
            }

            console.log(jsonResult); // Aqui você pode fazer o que quiser com o JSON resultante
        };

        reader.readAsText(arquivo);
    });

    inputArquivo.click();
}


converterPlanilhaSelecionadaParaJSON();


inputArquivo.addEventListener('change', function(e) {
        const arquivo = e.target.files[0];
