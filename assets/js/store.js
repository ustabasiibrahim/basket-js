if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
    loadData()
}
const cartContainer = document.getElementsByClassName('shop-items')[0];
document.getElementById('searchForm').addEventListener('submit', search);
var btnPurchase = document.getElementsByClassName('btn-purchase')[0];
btnPurchase.disabled = true;

var data = [];
function loadData() {
    var requestURL = './assets/json/menuData.json';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        data.push(request.response.d.ResultSet);
        data.forEach(el => {
            el.forEach(e => {
                var content = `<div class="shop-category-title">
                                    <h3 class="text-center">${e.DisplayName}</h3>
                                </div>
                                `;
                e.Products.forEach(res => {
                        content += `<div class="shop-item">
                                        <img class="shop-item-image" src="./assets/images/default-image.jpg">
                                        <span class="shop-item-title">${res.DisplayName}</span>
                                        <div class="shop-item-details">
                                            <span class="shop-item-price" hidden>${res.ExtendedPrice}</span>
                                            <button class="btn btn-ys shop-item-button" onclick="addToCartClicked(event)" type="button">SEPETE EKLE ( ${res.ExtendedPrice} TL )</button>
                                        </div>
                                    </div>`;
                });
                cartContainer.innerHTML += content;
            })
        })
    }   
}
function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-remove')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
    alert('Siparişiniz alınmıştır. Teşekkür ederiz')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerHTML
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerHTML
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerHTML == title) {
            alert('Bu ürün sepetinize zaten eklenmiş')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-remove" type="button">&times;</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-remove')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerHTML.replace('TL', ''))
        var price = priceElement.innerHTML.replace(',', '.')
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    if(total <= 0) {
        btnPurchase.disabled = true;
    }else {
        btnPurchase.disabled = false;
    }
    document.getElementsByClassName('cart-total-price')[0].innerHTML = total + ' TL'
}
function search(event) {
    event.preventDefault();
    cartContainer.innerHTML = '';
    var value = document.getElementById('searchInput').value.toLowerCase();
    if(value.trim() == '') {
        data = [];
        loadData();
    }else{
        for (let index = 0; index < data[0].length; index++) {
            const element = data[0][index];
                for(let index = 0; index < element.Products.length; index ++) {
                    const res = element.Products[index];
                    if(res.DisplayName.toLowerCase().indexOf(value) > -1) {
                            content += `<div class="shop-item">
                                            <img class="shop-item-image" src="./assets/images/default-image.jpg">
                                            <span class="shop-item-title">${res.DisplayName}</span>
                                            <div class="shop-item-details">
                                                <span class="shop-item-price" hidden>${res.ExtendedPrice}</span>
                                                <button class="btn btn-ys shop-item-button" onclick="addToCartClicked(event)" type="button">SEPETE EKLE ( ${res.ExtendedPrice} TL )</button>
                                            </div>
                                        </div>`;
                            document.getElementById('searchInput').value = '';
                    } else {
                        content = '';
                    }
                
                cartContainer.innerHTML += content;
            }
        }
    }
}