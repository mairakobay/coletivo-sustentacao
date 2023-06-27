let cart = []; /*criar uma variável que vai ser um array, que vai ser o carrinho.*/
let modalQt = 1; /*Modal é único para todas as saladas, então precisa de uma variável que vai armazenar a qtde de itens que tem no modal, criando essa variável. */
let modalKey = 0; /*criado no botão add do modal */

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

//LISTAGEM DAS SALADAS
saladJson.map((item, index)=>{
    // preencher as informações em saladitem
    let saladItem = c('.models .salad-item').cloneNode(true); /*clonar os itens*/

    saladItem.setAttribute('data-key', index);  /*setar um atributo chamado data-key. Data é um atributo com informação sobre uma div, um item*/ 

    saladItem.querySelector('.salad-item--img img').src = item.img;
    saladItem.querySelector('.salad-item--name').innerHTML = item.name;
    saladItem.querySelector('.salad-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    saladItem.querySelector('a').addEventListener('click', (e)=>{   /* evento de click */
        e.preventDefault();  /* bloquear a ação de atualizar a tela tag a = "previna a ação padrão" */
        let key = e.target.closest('.salad-item').getAttribute('data-key'); /*closest significa "ache o alemento mais próximo que tenha, no caso, salad-item*/ 
        modalQt = 1; /*vai resetar o modal para 1 */
        modalKey = key; /*criado no momento do botão add do modal*/

        //preencher as informações da salada no modal
        c('.saladBig img').src = saladJson[key].img;
        c('.saladInfo h1').innerHTML = saladJson[key].name;
        c('.saladInfo--desc').innerHTML = saladJson[key].description;
        c('.saladInfo--actualPrice').innerHTML = `R$ ${saladJson[key].price.toFixed(2)}`;
        c('.saladInfo--size.selected').classList.remove('selected'); /*vai remover a classe de seleção*/
        cs('.saladInfo--size').forEach((size, sizeIndex)=>{   /*para cada um dos itens vai rodar uma função, que vai receber o próprio item qua vamos chamar de size pq item já foi usado.*/
            if(sizeIndex == 2) {   /*se tiver na opção de salada grande */   
                size.classList.add('selected');  /*vai adcicionar a classe selected */ 
            }        
            size.querySelector('span').innerHTML = saladJson[key].sizes[sizeIndex];
        }); 

        c('.saladInfo--qt').innerHTML = modalQt;

        c('.saladWindowArea').style.opacity = 0; /* opacidade 0, o item vai aparecer na tela sem aparecer */
        c('.saladWindowArea').style.display = 'flex';
        setTimeout(()=>{   /* vai setar um timer */
            c('.saladWindowArea').style.opacity = 1;
        }, 200); /* vai esperar 1/5 de um segundo */
    });

    c('.salad-area').append( saladItem ); /*append - adicionar um conteúdo*/
});

//EVENTOS DO MODAL
function closeModal() {   /*vamos criar uma função que fecha o modal*/
    c('.saladWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.saladWindowArea').style.display = 'none'; /*modal vai sumir da tela.*/
    }, 500); /*vai esperar meio segundo */
}
cs('.saladInfo--cancelButton, .saladInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.saladInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--; 
        c('.saladInfo--qt').innerHTML = modalQt;
    }
});
c('.saladInfo--qtmais').addEventListener('click', ()=>{
    modalQt++; /*aumentar mais um*/
    c('.saladInfo--qt').innerHTML = modalQt; /*copia lá em cima o novo valor da variável modal*/
});
cs('.saladInfo--size').forEach((size, sizeIndex)=>{  /*copiado de cima. "para cada um dos itens vai rodar uma função, que vai receber o próprio item qua vamos chamar de size pq item já foi usado."*/
    size.addEventListener('click', (e)=>{  /*adicionar o evento de click*/
        c('.saladInfo--size.selected').classList.remove('selected');/*clicou em um item, desmarca a seleção e marca o seu */
        size.classList.add('selected'); /*e.target(trocado por size) para selecionar o item que estou clicando*/
    });
}); 
c('.saladInfo--addButton').addEventListener('click', ()=>{
    /*
    // Qual é a salada?
    console.log("Salada: "+modalKey);
    // Qual o tamanho?
    let size = c('.saladInfo--size.selected').getAttribute('data-key');
    console.log("Tamanho: "+size);
    // Quantas saladas?
    console.log("Quantidade: "+modalQt);
    */
    let size = parseInt(c('.saladInfo--size.selected').getAttribute('data-key')); /*parseInt para transformar uma string em inteiro.*/
    let identifier = saladJson[modalKey].id+'@'+size; /*criar o identificador. O tamanho vai ter o mesmo identificador. Corrigir erros de de tamanho das saladas no corrinho.*/
    let key = cart.findIndex((item)=>item.identifier == identifier); /*identificar se já tem o mesmo item no carrinho. Se achar, ele soma ao que já tem. */
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({   /*adicionar ao carrinho*/
            identifier,
            id:saladJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart(); /*vai atualizar o carrinho e fechar o modal, não importa a ordem.*/
    closeModal();
});

//CARRINHO DE COMPRAS
function updateCart() {  /*atualizar carrinho de compras*/
    if(cart.length > 0) {  /*decidir se vai mostrar o carrinho ou não, verificando se tem itens no carrinho.*/
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let saladItem = saladJson.find((item)=>item.id == cart[i].id);
            subtotal += saladItem.price * cart[i].qt;
            
            let cartItem = c('.models .cart--item').cloneNode(true);
           
            let saladSizeName;
            switch(cart[i].size) {
                case 0:
                    saladSizeName = 'P';
                    break;
                case 1:
                    saladSizeName = 'M';
                    break;
                case 2:
                    saladSizeName = 'G';
                    break;
            }
            let saladName = `${saladItem.name} (${saladSizeName})`;

            cartItem.querySelector('img').src = saladItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = saladName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
    }           
}