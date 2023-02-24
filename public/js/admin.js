const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf').value;

    const productElement = btn.closest('article'); //to select the main component i want to delete

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        console.log(data);
        //productElement.remove(); <-- this does not work on every browser
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
        console.log(err);
    })
};
