document.addEventListener('DOMContentLoaded', async function(){
    const data = await hit_api_get_product_category();
    console.log(data);
})

async function hit_api_get_product_category(){
    try {
        const response = await fetch('http://localhost:4100/api/product/category/2/12');
        const result = await response.json();
        console.log(result);
        return result.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}
