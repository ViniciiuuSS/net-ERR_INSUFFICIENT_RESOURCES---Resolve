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